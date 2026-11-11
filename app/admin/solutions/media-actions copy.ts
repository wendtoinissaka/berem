"use server";

import { revalidatePath } from "next/cache";
import { MediaType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

/**
 * Prépare un brouillon technique si nécessaire.
 * Ce brouillon permet d'envoyer les médias avant la validation
 * finale du formulaire, sans rediriger l'administrateur.
 */
export async function ensureSolutionDraft(formData: FormData) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const existingId = readText(formData, "solutionId");

  if (existingId) {
    const existing = await prisma.solution.findUnique({
      where: { id: existingId },
      select: { id: true, status: true },
    });

    if (!existing) {
      throw new Error("La solution sélectionnée est introuvable.");
    }

    return { solutionId: existing.id };
  }

  const name = readText(formData, "name") || "Nouvelle solution";
  const summary =
    readText(formData, "summary") || "Solution en cours de création";
  const description =
    readText(formData, "description") || "Description en cours de rédaction";

  const solution = await prisma.solution.create({
    data: {
      name,
      slug: `brouillon-${crypto.randomUUID()}`,
      summary,
      description,
      status: "DRAFT",
      isFeatured: false,
    },
    select: { id: true },
  });

  return { solutionId: solution.id };
}

/**
 * Génère une signature pour les fichiers d'une solution.
 * Les fichiers sont stockés dans un dossier distinct.
 */
export async function createSolutionMediaUploadSignature(
  formData: FormData
) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const solutionId = readText(formData, "solutionId");
  const category = readText(formData, "category") || "galerie";

  if (!solutionId) {
    throw new Error("Identifiant de solution manquant.");
  }

  if (!["galerie", "logo", "couverture"].includes(category)) {
    throw new Error("Catégorie de média non autorisée.");
  }

  const solution = await prisma.solution.findUnique({
    where: { id: solutionId },
    select: { id: true },
  });

  if (!solution) {
    throw new Error("Solution introuvable.");
  }

  const config = cloudinary.config();

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error("La configuration Cloudinary est incomplète.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `berem/solutions/${solutionId}/${category}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    config.api_secret
  );

  return {
    cloudName: config.cloud_name,
    apiKey: config.api_key,
    timestamp,
    folder,
    signature,
  };
}

/**
 * Vérifie le média sur Cloudinary puis l'enregistre en base.
 */
export async function saveUploadedSolutionMedia(formData: FormData) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const solutionId = readText(formData, "solutionId");
  const url = readText(formData, "url");
  const publicId = readText(formData, "publicId");
  const resourceType = readText(formData, "resourceType");
  const caption = readText(formData, "caption");

  if (!solutionId || !url || !publicId) {
    throw new Error("Informations du média incomplètes.");
  }

  if (!["image", "video"].includes(resourceType)) {
    throw new Error("Type de média non autorisé.");
  }

  const expectedPrefix = `berem/solutions/${solutionId}/galerie/`;

  if (!publicId.startsWith(expectedPrefix)) {
    throw new Error("Ce fichier ne correspond pas à cette solution.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("URL du média invalide.");
  }

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.hostname !== "res.cloudinary.com"
  ) {
    throw new Error("Domaine du média non autorisé.");
  }

  const solution = await prisma.solution.findUnique({
    where: { id: solutionId },
    select: { id: true, slug: true },
  });

  if (!solution) {
    throw new Error("Solution introuvable.");
  }

  const asset = await cloudinary.api.resource(publicId, {
    resource_type: resourceType,
  });

  if (
    asset.secure_url !== url ||
    asset.public_id !== publicId ||
    asset.resource_type !== resourceType
  ) {
    throw new Error("Le fichier Cloudinary n'a pas pu être vérifié.");
  }

  const lastMedia = await prisma.solutionMedia.findFirst({
    where: { solutionId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const media = await prisma.solutionMedia.create({
    data: {
      solutionId,
      url,
      type: resourceType === "video" ? MediaType.VIDEO : MediaType.IMAGE,
      caption: caption || null,
      sortOrder: (lastMedia?.sortOrder ?? -1) + 1,
    },
    select: { id: true },
  });

  revalidatePath("/admin/solutions");
  revalidatePath("/solutions");
  revalidatePath(`/solutions/${solution.slug}`);
  revalidatePath("/");

  return { mediaId: media.id };
}



export async function saveUploadedSolutionBrandImage(
  formData: FormData
) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const solutionId = readText(formData, "solutionId");
  const url = readText(formData, "url");
  const publicId = readText(formData, "publicId");
  const category = readText(formData, "category");

  if (!solutionId || !url || !publicId) {
    throw new Error("Informations de l'image incomplètes.");
  }

  if (!["logo", "couverture"].includes(category)) {
    throw new Error("Type d'image non autorisé.");
  }

  const expectedPrefix =
    `berem/solutions/${solutionId}/${category}/`;

  if (!publicId.startsWith(expectedPrefix)) {
    throw new Error("Cette image ne correspond pas à cette solution.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("URL de l'image invalide.");
  }

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.hostname !== "res.cloudinary.com"
  ) {
    throw new Error("Domaine de l'image non autorisé.");
  }

  const solution = await prisma.solution.findUnique({
    where: { id: solutionId },
    select: { id: true, slug: true },
  });

  if (!solution) {
    throw new Error("Solution introuvable.");
  }

  const asset = await cloudinary.api.resource(publicId, {
    resource_type: "image",
  });

  if (
    asset.secure_url !== url ||
    asset.public_id !== publicId ||
    asset.resource_type !== "image"
  ) {
    throw new Error("L'image Cloudinary n'a pas pu être vérifiée.");
  }

  const field = category === "logo" ? "logoUrl" : "coverImageUrl";

  await prisma.solution.update({
    where: { id: solutionId },
    data: {
      [field]: url,
    },
  });

  revalidatePath("/admin/solutions");
  revalidatePath("/solutions");
  revalidatePath(`/solutions/${solution.slug}`);
  revalidatePath("/");

  return { url };
}