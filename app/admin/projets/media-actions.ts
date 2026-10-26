"use server";

import { revalidatePath } from "next/cache";
import { MediaType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function createMediaUploadSignature(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const updateId = readText(formData, "updateId");

  const update = await prisma.projectUpdate.findFirst({
    where: {
      id: updateId,
      projectId,
      project: { archivedAt: null },
    },
    select: {
      id: true,
      projectId: true,
    },
  });

  if (!update) {
    throw new Error("Compte rendu introuvable ou chantier archivé.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `berem/chantiers/${projectId}/${updateId}`;

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret!
  );

  return {
    cloudName: cloudinary.config().cloud_name!,
    apiKey: cloudinary.config().api_key!,
    timestamp,
    folder,
    signature,
  };
}

export async function saveUploadedProjectMedia(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const updateId = readText(formData, "updateId");
  const url = readText(formData, "url");
  const publicId = readText(formData, "publicId");
  const resourceType = readText(formData, "resourceType");
  const caption = readText(formData, "caption");

  if (!projectId || !updateId || !url || !publicId) {
    throw new Error("Informations du média incomplètes.");
  }

  if (!["image", "video"].includes(resourceType)) {
    throw new Error("Type de média non autorisé.");
  }

  const expectedPrefix = `berem/chantiers/${projectId}/${updateId}/`;

  if (!publicId.startsWith(expectedPrefix)) {
    throw new Error("Le média ne correspond pas à ce compte rendu.");
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

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      archivedAt: null,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!project) {
    throw new Error("Chantier introuvable ou archivé.");
  }

  const update = await prisma.projectUpdate.findFirst({
    where: {
      id: updateId,
      projectId,
    },
    select: {
      id: true,
    },
  });

  if (!update) {
    throw new Error("Compte rendu introuvable.");
  }

  // Vérifie auprès de Cloudinary que le fichier existe
  // et correspond bien à l'identifiant fourni.
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

  const lastMedia = await prisma.projectUpdateMedia.findFirst({
    where: { projectUpdateId: updateId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.projectUpdateMedia.create({
    data: {
      projectUpdateId: updateId,
      url,
      type: resourceType === "video" ? MediaType.VIDEO : MediaType.IMAGE,
      caption: caption || null,
      sortOrder: (lastMedia?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/projets/${projectId}/suivi`);
  revalidatePath(`/realisations/${project.slug}`);
  revalidatePath("/realisations");
  revalidatePath("/");
}

/**
 * Génère une signature Cloudinary pour les médias de la galerie principale
 * d'un chantier.
 */
export async function createProjectMediaUploadSignature(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");

  if (!projectId) {
    throw new Error("Identifiant du chantier manquant.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw new Error("Chantier introuvable ou archivé.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `berem/chantiers/${projectId}/galerie`;

  const paramsToSign = {
    timestamp,
    folder,
  };

  const config = cloudinary.config();

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error("La configuration Cloudinary est incomplète.");
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
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
 * Vérifie et enregistre un média dans la galerie principale du chantier.
 */
export async function saveUploadedProjectLevelMedia(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const url = readText(formData, "url");
  const publicId = readText(formData, "publicId");
  const resourceType = readText(formData, "resourceType");
  const caption = readText(formData, "caption");

  if (!projectId || !url || !publicId) {
    throw new Error("Informations du média incomplètes.");
  }

  if (!["image", "video"].includes(resourceType)) {
    throw new Error("Type de média non autorisé.");
  }

  const expectedPrefix = `berem/chantiers/${projectId}/galerie/`;

  if (!publicId.startsWith(expectedPrefix)) {
    throw new Error("Le média ne correspond pas à la galerie de ce chantier.");
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

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      archivedAt: null,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!project) {
    throw new Error("Chantier introuvable ou archivé.");
  }

  // Vérifier que le fichier existe réellement sur Cloudinary.
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

  // Calculer la position du prochain média dans la galerie.
  const lastMedia = await prisma.projectMedia.findFirst({
    where: {
      projectId,
    },
    orderBy: {
      sortOrder: "desc",
    },
    select: {
      sortOrder: true,
    },
  });

  await prisma.projectMedia.create({
    data: {
      projectId,
      url,
      type: resourceType === "video" ? MediaType.VIDEO : MediaType.IMAGE,
      caption: caption || null,
      sortOrder: (lastMedia?.sortOrder ?? -1) + 1,
    },
  });

  // Actualiser les pages concernées.
  revalidatePath("/admin/projets");
  revalidatePath(`/admin/projets/${projectId}/modifier`);
  revalidatePath("/realisations");
  revalidatePath(`/realisations/${project.slug}`);
  revalidatePath("/");
}
