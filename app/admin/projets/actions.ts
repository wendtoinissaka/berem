"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  ProjectStatus,
  ProjectType,
} from "@/generated/prisma/client";

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readDate(value: FormDataEntryValue | null): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Une date saisie est invalide.");
  }

  return date;
}

function readProjectForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const status = String(formData.get("status") ?? "PLANNED");
  const type = String(formData.get("type") ?? "OTHER");
  const progress = Number(formData.get("progress") ?? 0);
  const startDate = readDate(formData.get("startDate"));
  const expectedEndDate = readDate(formData.get("expectedEndDate"));
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !description || !location) {
    throw new Error(
      "Le titre, la description et la localisation sont obligatoires."
    );
  }

  if (!Object.values(ProjectStatus).includes(status as ProjectStatus)) {
    throw new Error("Le statut sélectionné est invalide.");
  }

  if (!Object.values(ProjectType).includes(type as ProjectType)) {
    throw new Error("La catégorie sélectionnée est invalide.");
  }

  if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
    throw new Error("La progression doit être comprise entre 0 et 100.");
  }

  if (startDate && expectedEndDate && expectedEndDate < startDate) {
    throw new Error(
      "La date de fin prévue doit être postérieure à la date de début."
    );
  }

  return {
    title,
    slug: normalizeSlug(title),
    description,
    location,
    type: type as ProjectType,
    status: status as ProjectStatus,
    progress,
    startDate,
    expectedEndDate,
    isPublished,
  };
}

async function uniqueSlug(baseSlug: string, excludeId?: string) {
  const base = baseSlug || "chantier";
  let slug = base;
  let suffix = 2;

  while (
    await prisma.project.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix++;
  }

  return slug;
}

function refreshProjectPages(slug?: string) {
  revalidatePath("/admin/projets");
  revalidatePath("/realisations");
  revalidatePath("/");
  if (slug) revalidatePath(`/realisations/${slug}`);
}


export async function createProject(formData: FormData) {
  await requireAdmin();

  const data = readProjectForm(formData);
  const slug = await uniqueSlug(data.slug);

  const project = await prisma.project.create({
    data: {
      ...data,
      slug,
    },
  });

  refreshProjectPages(slug);

  // Après la création, ouvrir directement la page permettant
  // d'ajouter les photos et vidéos au chantier.
  redirect(`/admin/projets/${project.id}/modifier`);
}


export async function updateProject(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) throw new Error("Identifiant du chantier manquant.");

  const existing = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      completedAt: true,
      archivedAt: true,
    },
  });

  if (!existing) throw new Error("Ce chantier n'existe pas.");

  if (existing.archivedAt) {
    throw new Error(
      "Ce chantier est archivé. Restaurez-le avant de le modifier."
    );
  }

  const data = readProjectForm(formData);
  const slug =
    data.slug === normalizeSlug(existing.slug)
      ? existing.slug
      : await uniqueSlug(data.slug, id);

  const completedAt =
    data.status === "COMPLETED"
      ? existing.completedAt ?? new Date()
      : null;

  await prisma.project.update({
    where: { id },
    data: { ...data, slug, completedAt },
  });

  refreshProjectPages(existing.slug);
  refreshProjectPages(slug);
  redirect("/admin/projets");
}

export async function toggleProjectPublication(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Identifiant du chantier manquant.");

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, slug: true, isPublished: true, archivedAt: true },
  });

  if (!project) throw new Error("Ce chantier n'existe pas.");

  if (project.archivedAt) {
    throw new Error("Restaurez ce chantier avant de modifier sa publication.");
  }

  await prisma.project.update({
    where: { id },
    data: { isPublished: !project.isPublished },
  });

  refreshProjectPages(project.slug);
  redirect("/admin/projets");
}

export async function archiveProject(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Identifiant du chantier manquant.");

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, slug: true, archivedAt: true },
  });

  if (!project) throw new Error("Ce chantier n'existe pas.");

  if (!project.archivedAt) {
    await prisma.project.update({
      where: { id },
      data: {
        archivedAt: new Date(),
        isPublished: false,
      },
    });
  }

  refreshProjectPages(project.slug);
  redirect("/admin/projets");
}

export async function restoreProject(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Identifiant du chantier manquant.");

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!project) throw new Error("Ce chantier n'existe pas.");

  await prisma.project.update({
    where: { id },
    data: { archivedAt: null },
  });

  refreshProjectPages(project.slug);
  redirect("/admin/projets");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!id || confirmation !== "SUPPRIMER") {
    throw new Error("Confirmation de suppression invalide.");
  }

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!project) throw new Error("Ce chantier n'existe pas.");

  await prisma.project.delete({ where: { id } });

  refreshProjectPages(project.slug);
  redirect("/admin/projets");
}