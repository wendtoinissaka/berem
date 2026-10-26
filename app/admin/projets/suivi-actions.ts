"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ProjectStageStatus,
  ProjectStatus,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readEventDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("La date du compte rendu est obligatoire.");
  }

  const date = new Date(`${value}T12:00:00`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("La date du compte rendu est invalide.");
  }

  return date;
}

async function getEditableProject(projectId: string) {
  if (!projectId) {
    throw new Error("Identifiant du chantier manquant.");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      slug: true,
      archivedAt: true,
    },
  });

  if (!project) {
    throw new Error("Ce chantier n'existe pas.");
  }

  if (project.archivedAt) {
    throw new Error("Restaurez ce chantier avant de modifier son suivi.");
  }

  return project;
}

function refreshTracking(projectId: string, slug: string) {
  revalidatePath(`/admin/projets/${projectId}/suivi`);
  revalidatePath("/admin/projets");
  revalidatePath(`/realisations/${slug}`);
  revalidatePath("/realisations");
  revalidatePath("/");
}

export async function createProjectStage(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const project = await getEditableProject(projectId);

  if (!name) {
    throw new Error("Le nom de l'étape est obligatoire.");
  }

  const lastStage = await prisma.projectStage.findFirst({
    where: { projectId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.projectStage.create({
    data: {
      projectId,
      name,
      description: description || null,
      sortOrder: (lastStage?.sortOrder ?? -1) + 1,
    },
  });

  refreshTracking(projectId, project.slug);
  redirect(`/admin/projets/${projectId}/suivi`);
}

export async function updateProjectStage(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const stageId = readText(formData, "stageId");
  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const status = readText(formData, "status");

  const project = await getEditableProject(projectId);

  if (!name) {
    throw new Error("Le nom de l'étape est obligatoire.");
  }

  if (
    !Object.values(ProjectStageStatus).includes(
      status as ProjectStageStatus
    )
  ) {
    throw new Error("Le statut de l'étape est invalide.");
  }

  const stage = await prisma.projectStage.findFirst({
    where: { id: stageId, projectId },
    select: { id: true, startedAt: true, completedAt: true },
  });

  if (!stage) {
    throw new Error("Cette étape n'appartient pas à ce chantier.");
  }

  const now = new Date();

  await prisma.projectStage.update({
    where: { id: stageId },
    data: {
      name,
      description: description || null,
      status: status as ProjectStageStatus,
      startedAt:
        status === "IN_PROGRESS"
          ? stage.startedAt ?? now
          : stage.startedAt,
      completedAt:
        status === "COMPLETED"
          ? stage.completedAt ?? now
          : null,
    },
  });

  refreshTracking(projectId, project.slug);
  redirect(`/admin/projets/${projectId}/suivi`);
}

export async function createProjectUpdate(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const title = readText(formData, "title");
  const description = readText(formData, "description");
  const eventDate = readEventDate(readText(formData, "eventDate"));
  const stageId = readText(formData, "stageId") || null;
  const progress = Number(readText(formData, "progress"));
  const isPublished = formData.get("isPublished") === "on";

  const project = await getEditableProject(projectId);

  if (!title || !description) {
    throw new Error("Le titre et la description sont obligatoires.");
  }

  if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
    throw new Error("La progression doit être comprise entre 0 et 100.");
  }

  if (stageId) {
    const stage = await prisma.projectStage.findFirst({
      where: { id: stageId, projectId },
      select: { id: true },
    });

    if (!stage) {
      throw new Error("L'étape sélectionnée est invalide.");
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.projectUpdate.create({
      data: {
        projectId,
        stageId,
        title,
        description,
        progress,
        eventDate,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: {
        progress,
        ...(progress === 100
          ? {
              status: ProjectStatus.COMPLETED,
              completedAt: new Date(),
            }
          : {}),
      },
    });
  });

  refreshTracking(projectId, project.slug);
  redirect(`/admin/projets/${projectId}/suivi`);
}

export async function toggleProjectUpdatePublication(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const updateId = readText(formData, "updateId");
  const project = await getEditableProject(projectId);

  const update = await prisma.projectUpdate.findFirst({
    where: { id: updateId, projectId },
    select: { id: true, isPublished: true },
  });

  if (!update) {
    throw new Error("Ce compte rendu n'existe pas pour ce chantier.");
  }

  const nextPublished = !update.isPublished;

  await prisma.projectUpdate.update({
    where: { id: updateId },
    data: {
      isPublished: nextPublished,
      publishedAt: nextPublished ? new Date() : null,
    },
  });

  refreshTracking(projectId, project.slug);
  redirect(`/admin/projets/${projectId}/suivi`);
}