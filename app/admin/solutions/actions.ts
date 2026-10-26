"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { SolutionStatus } from "@/generated/prisma/client";

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readSolutionForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const logoUrl = String(formData.get("logoUrl") ?? "").trim();
  const coverImageUrl = String(
    formData.get("coverImageUrl") ?? ""
  ).trim();

  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const actionLabel =
    String(formData.get("actionLabel") ?? "").trim() ||
    "Découvrir la solution";

  const statusValue = String(
    formData.get("status") ?? "DRAFT"
  );

  const isFeatured = formData.get("isFeatured") === "on";
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name || !summary || !description) {
    throw new Error(
      "Le nom, le résumé et la description sont obligatoires."
    );
  }

  if (!Object.values(SolutionStatus).includes(statusValue as SolutionStatus)) {
    throw new Error("Le statut sélectionné est invalide.");
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error(
      "L'ordre d'affichage doit être un entier positif ou nul."
    );
  }

  if (websiteUrl) {
    try {
      const url = new URL(websiteUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error(
        "L'adresse du site doit être une URL valide commençant par https:// ou http://."
      );
    }
  }

  if (logoUrl) {
    try {
      const url = new URL(logoUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error("L'adresse du logo est invalide.");
    }
  }

  if (coverImageUrl) {
    try {
      const url = new URL(coverImageUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error("L'adresse de l'image de couverture est invalide.");
    }
  }

  const status = statusValue as SolutionStatus;

  if (status === SolutionStatus.PUBLISHED && !coverImageUrl) {
    throw new Error(
      "Ajoutez une image de couverture avant de publier cette solution."
    );
  }

  const features = formData
    .getAll("featureTitle")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const featureDescriptions = formData
    .getAll("featureDescription")
    .map((value) => String(value).trim());

  return {
    name,
    slug: normalizeSlug(name),
    summary,
    description,
    logoUrl: logoUrl || null,
    coverImageUrl: coverImageUrl || null,
    websiteUrl: websiteUrl || null,
    actionLabel,
    status,
    isFeatured: status === SolutionStatus.PUBLISHED && isFeatured,
    sortOrder,
    features: features.map((title, index) => ({
      title,
      description: featureDescriptions[index] || null,
      sortOrder: index,
    })),
  };
}

async function uniqueSlug(baseSlug: string, excludeId?: string) {
  const base = baseSlug || "solution";
  let slug = base;
  let suffix = 2;

  while (
    await prisma.solution.findFirst({
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

function refreshSolutionPages(slug?: string) {
  revalidatePath("/admin/solutions");
  revalidatePath("/solutions");
  revalidatePath("/");
  if (slug) revalidatePath(`/solutions/${slug}`);
}

export async function createSolution(formData: FormData) {
  await requireAdmin();

  const data = readSolutionForm(formData);
  const existingId = String(formData.get("id") ?? "").trim();

  if (existingId) {
    const existing = await prisma.solution.findUnique({
      where: { id: existingId },
      select: {
        id: true,
        slug: true,
        publishedAt: true,
      },
    });

    if (!existing) {
      throw new Error("La solution à enregistrer est introuvable.");
    }

    const slug = await uniqueSlug(data.slug, existingId);

    await prisma.$transaction([
      prisma.solutionFeature.deleteMany({
        where: { solutionId: existingId },
      }),
      prisma.solution.update({
        where: { id: existingId },
        data: {
          name: data.name,
          slug,
          summary: data.summary,
          description: data.description,
          logoUrl: data.logoUrl,
          coverImageUrl: data.coverImageUrl,
          websiteUrl: data.websiteUrl,
          actionLabel: data.actionLabel,
          status: data.status,
          isFeatured: data.isFeatured,
          sortOrder: data.sortOrder,
          publishedAt:
            data.status === SolutionStatus.PUBLISHED
              ? existing.publishedAt ?? new Date()
              : null,
          features: {
            create: data.features,
          },
        },
      }),
    ]);

    refreshSolutionPages(existing.slug);
    refreshSolutionPages(slug);

    redirect("/admin/solutions");
  }

  const slug = await uniqueSlug(data.slug);

  const solution = await prisma.solution.create({
    data: {
      name: data.name,
      slug,
      summary: data.summary,
      description: data.description,
      logoUrl: data.logoUrl,
      coverImageUrl: data.coverImageUrl,
      websiteUrl: data.websiteUrl,
      actionLabel: data.actionLabel,
      status: data.status,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
      publishedAt:
        data.status === SolutionStatus.PUBLISHED ? new Date() : null,
      features: {
        create: data.features,
      },
    },
  });

  refreshSolutionPages(solution.slug);

  redirect("/admin/solutions");
}

export async function updateSolution(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Identifiant de la solution manquant.");
  }

  const existing = await prisma.solution.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      publishedAt: true,
    },
  });

  if (!existing) {
    throw new Error("Cette solution n'existe pas.");
  }

  const data = readSolutionForm(formData);

  const slug =
    data.slug === normalizeSlug(existing.slug)
      ? existing.slug
      : await uniqueSlug(data.slug, id);

  await prisma.$transaction([
    prisma.solutionFeature.deleteMany({
      where: { solutionId: id },
    }),
    prisma.solution.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        summary: data.summary,
        description: data.description,
        logoUrl: data.logoUrl,
        coverImageUrl: data.coverImageUrl,
        websiteUrl: data.websiteUrl,
        actionLabel: data.actionLabel,
        status: data.status,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        publishedAt:
          data.status === SolutionStatus.PUBLISHED
            ? existing.publishedAt ?? new Date()
            : null,
        features: {
          create: data.features,
        },
      },
    }),
  ]);

  refreshSolutionPages(existing.slug);
  refreshSolutionPages(slug);

  redirect("/admin/solutions");
}

export async function changeSolutionStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const statusValue = String(formData.get("status") ?? "");

  if (!id) {
    throw new Error("Identifiant de la solution manquant.");
  }

  if (!Object.values(SolutionStatus).includes(statusValue as SolutionStatus)) {
    throw new Error("Le statut sélectionné est invalide.");
  }

  const status = statusValue as SolutionStatus;

  const solution = await prisma.solution.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  });

  if (!solution) {
    throw new Error("Cette solution n'existe pas.");
  }

  if (status === SolutionStatus.PUBLISHED && !solution.coverImageUrl) {
    throw new Error(
      "Ajoutez une image de couverture avant de publier cette solution."
    );
  }

  await prisma.solution.update({
    where: { id },
    data: {
      status,
      isFeatured: status === SolutionStatus.PUBLISHED
        ? undefined
        : false,
      publishedAt:
        status === SolutionStatus.PUBLISHED
          ? solution.publishedAt ?? new Date()
          : null,
    },
  });

  refreshSolutionPages(solution.slug);

  redirect("/admin/solutions");
}

export async function deleteSolution(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!id || confirmation !== "SUPPRIMER") {
    throw new Error("Confirmation de suppression invalide.");
  }

  const solution = await prisma.solution.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!solution) {
    throw new Error("Cette solution n'existe pas.");
  }

  await prisma.solution.delete({
    where: { id },
  });

  refreshSolutionPages(solution.slug);

  redirect("/admin/solutions");
}