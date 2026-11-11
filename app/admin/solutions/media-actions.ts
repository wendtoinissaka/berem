"use server";

import { revalidatePath } from "next/cache";
import { MediaType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary"

type MediaCategory = "galerie" | "logo" | "couverture";
type CloudinaryResourceType = "image" | "video";

const MAX_CAPTION_LENGTH = 250;

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function assertCategory(value: string): asserts value is MediaCategory {
  if (!["galerie", "logo", "couverture"].includes(value)) {
    throw new Error("Catégorie de média non autorisée.");
  }
}

function assertResourceType(
  value: string,
): asserts value is CloudinaryResourceType {
  if (value !== "image" && value !== "video") {
    throw new Error("Type de média non autorisé.");
  }
}

function validateCloudinaryUrl(url: string) {
  const cloudinary = getCloudinary();
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("URL du média invalide.");
  }

  const config = cloudinary.config();

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.hostname !== "res.cloudinary.com" ||
    !config.cloud_name ||
    !parsedUrl.pathname.startsWith(`/${config.cloud_name}/`)
  ) {
    throw new Error("URL Cloudinary non autorisée.");
  }

  return parsedUrl;
}

function validatePublicId(
  publicId: string,
  solutionId: string,
  category: MediaCategory,
) {
  const expectedPrefix = `berem/solutions/${solutionId}/${category}/`;

  if (
    !publicId ||
    publicId.length > 500 ||
    !publicId.startsWith(expectedPrefix)
  ) {
    throw new Error("Ce fichier ne correspond pas à cette solution.");
  }
}

/**
 * Vérifie que le fichier existe réellement sur Cloudinary
 * et qu'il appartient bien au dossier attendu.
 */
async function verifyCloudinaryAsset({
  solutionId,
  category,
  url,
  publicId,
  resourceType,
}: {
  solutionId: string;
  category: MediaCategory;
  url: string;
  publicId: string;
  resourceType: CloudinaryResourceType;
}) {
    const cloudinary = getCloudinary();

  validatePublicId(publicId, solutionId, category);
  validateCloudinaryUrl(url);

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

  return asset;
}

/**
 * Supprime un ancien fichier Cloudinary.
 * Une erreur de suppression ne doit jamais annuler
 * l'enregistrement du nouveau fichier en base.
 */
async function destroyCloudinaryAsset(
  publicId: string | null,
  resourceType: CloudinaryResourceType,
) {
  if (!publicId) return;

    const cloudinary = getCloudinary();
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      console.error(
        `[Cloudinary] Suppression non confirmée pour ${publicId}:`,
        result,
      );
    }
  } catch (error) {
    console.error(
      `[Cloudinary] Impossible de supprimer ${publicId}:`,
      error,
    );
  }
}

function refreshSolutionPages(slug?: string) {
  revalidatePath("/admin/solutions");
  revalidatePath("/solutions");
  revalidatePath("/");

  if (slug) {
    revalidatePath(`/solutions/${slug}`);
  }
}

/**
 * Prépare un brouillon technique si nécessaire.
 * Ce brouillon permet d'envoyer les médias avant la validation
 * finale du formulaire.
 */
export async function ensureSolutionDraft(formData: FormData) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const existingId = readText(formData, "solutionId");

  if (existingId) {
    const existing = await prisma.solution.findUnique({
      where: { id: existingId },
      select: { id: true },
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
    readText(formData, "description") ||
    "Description en cours de rédaction";

  const solution = await prisma.solution.create({
    data: {
      name: name.slice(0, 150),
      slug: `brouillon-${crypto.randomUUID()}`,
      summary: summary.slice(0, 300),
      description,
      status: "DRAFT",
      isFeatured: false,
    },
    select: { id: true },
  });

  return { solutionId: solution.id };
}

/**
 * Génère une signature Cloudinary.
 */
export async function createSolutionMediaUploadSignature(
  formData: FormData,
) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const solutionId = readText(formData, "solutionId");
  const category = readText(formData, "category") || "galerie";

  if (!solutionId) {
    throw new Error("Identifiant de solution manquant.");
  }

  assertCategory(category);

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
    config.api_secret,
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
 * Enregistre une photo ou vidéo de galerie.
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

  assertResourceType(resourceType);

  if (caption.length > MAX_CAPTION_LENGTH) {
    throw new Error("La légende ne doit pas dépasser 250 caractères.");
  }

  const solution = await prisma.solution.findUnique({
    where: { id: solutionId },
    select: { id: true, slug: true },
  });

  if (!solution) {
    throw new Error("Solution introuvable.");
  }

  await verifyCloudinaryAsset({
    solutionId,
    category: "galerie",
    url,
    publicId,
    resourceType,
  });

  const lastMedia = await prisma.solutionMedia.findFirst({
    where: { solutionId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const media = await prisma.solutionMedia.create({
    data: {
      solutionId,
      url,
      publicId,
      type: resourceType === "video" ? MediaType.VIDEO : MediaType.IMAGE,
      caption: caption || null,
      sortOrder: (lastMedia?.sortOrder ?? -1) + 1,
    },
    select: { id: true },
  });

  refreshSolutionPages(solution.slug);

  return { mediaId: media.id };
}

/**
 * Supprime un média de galerie.
 * La vérification de l'appartenance empêche de supprimer
 * un média appartenant à une autre solution.
 */
export async function deleteSolutionMedia(formData: FormData) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const solutionId = readText(formData, "solutionId");
  const mediaId = readText(formData, "mediaId");

  if (!solutionId || !mediaId) {
    throw new Error("Informations de suppression incomplètes.");
  }

  const media = await prisma.solutionMedia.findFirst({
    where: {
      id: mediaId,
      solutionId,
    },
    include: {
      solution: {
        select: { slug: true },
      },
    },
  });

  if (!media) {
    throw new Error("Média introuvable pour cette solution.");
  }

  // On retire d'abord la référence en base.
  // En cas d'échec Cloudinary, le fichier devient simplement
  // un fichier orphelin, sans casser la galerie publique.
  await prisma.solutionMedia.delete({
    where: { id: media.id },
  });

  if (media.publicId) {
    await destroyCloudinaryAsset(
      media.publicId,
      media.type === MediaType.VIDEO ? "video" : "image",
    );
  }

  refreshSolutionPages(media.solution.slug);

  return { success: true };
}

/**
 * Enregistre ou remplace le logo ou la couverture.
 */
export async function saveUploadedSolutionBrandImage(
  formData: FormData,
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

  assertCategory(category);

  if (category === "galerie") {
    throw new Error("Cette catégorie ne correspond pas à une image d'identité.");
  }

  const solution = await prisma.solution.findUnique({
    where: { id: solutionId },
    select: {
      id: true,
      slug: true,
      logoPublicId: true,
      coverPublicId: true,
    },
  });

  if (!solution) {
    throw new Error("Solution introuvable.");
  }

  await verifyCloudinaryAsset({
    solutionId,
    category,
    url,
    publicId,
    resourceType: "image",
  });

  const oldPublicId =
    category === "logo"
      ? solution.logoPublicId
      : solution.coverPublicId;

  if (oldPublicId === publicId) {
    return { url };
  }

  if (category === "logo") {
    await prisma.solution.update({
      where: { id: solutionId },
      data: {
        logoUrl: url,
        logoPublicId: publicId,
      },
    });
  } else {
    await prisma.solution.update({
      where: { id: solutionId },
      data: {
        coverImageUrl: url,
        coverPublicId: publicId,
      },
    });
  }

  // L'ancien fichier n'est supprimé qu'après la mise à jour en base.
  await destroyCloudinaryAsset(oldPublicId, "image");

  refreshSolutionPages(solution.slug);

  return { url };
}

/**
 * Retire le logo ou la couverture sans supprimer l'autre image.
 */
export async function deleteSolutionBrandImage(formData: FormData) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const solutionId = readText(formData, "solutionId");
  const category = readText(formData, "category");

  if (!solutionId) {
    throw new Error("Identifiant de solution manquant.");
  }

  if (category !== "logo" && category !== "couverture") {
    throw new Error("Type d'image non autorisé.");
  }

  const solution = await prisma.solution.findUnique({
    where: { id: solutionId },
    select: {
      id: true,
      slug: true,
      logoPublicId: true,
      coverPublicId: true,
    },
  });

  if (!solution) {
    throw new Error("Solution introuvable.");
  }

  if (category === "logo") {
    await prisma.solution.update({
      where: { id: solutionId },
      data: {
        logoUrl: null,
        logoPublicId: null,
      },
    });

    await destroyCloudinaryAsset(solution.logoPublicId, "image");
  } else {
    await prisma.solution.update({
      where: { id: solutionId },
      data: {
        coverImageUrl: null,
        coverPublicId: null,
      },
    });

    await destroyCloudinaryAsset(solution.coverPublicId, "image");
  }

  refreshSolutionPages(solution.slug);

  return { success: true };
}