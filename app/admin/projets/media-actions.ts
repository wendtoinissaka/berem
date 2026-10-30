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
    publicId,
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
  publicId,
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



/**
 * Réorganise les médias de la galerie principale d'un chantier.
 * Le premier média de type IMAGE détermine la couverture publique.
 */
export async function moveProjectMedia(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const mediaId = readText(formData, "mediaId");
  const direction = readText(formData, "direction");

  if (
    !projectId ||
    !mediaId ||
    !["up", "down", "cover"].includes(direction)
  ) {
    throw new Error("Paramètres de réorganisation invalides.");
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

  const mediaList = await prisma.projectMedia.findMany({
    where: { projectId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const currentIndex = mediaList.findIndex((media) => media.id === mediaId);

  if (currentIndex === -1) {
    throw new Error("Média introuvable dans cette galerie.");
  }

  if (direction === "cover") {
    if (mediaList[currentIndex].type !== "IMAGE") {
      throw new Error("Seules les photos peuvent servir de couverture.");
    }

    // La photo choisie passe avant les autres médias.
    const selected = mediaList.splice(currentIndex, 1)[0];
    mediaList.unshift(selected);
  } else {
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= mediaList.length) {
      return;
    }

    [mediaList[currentIndex], mediaList[targetIndex]] = [
      mediaList[targetIndex],
      mediaList[currentIndex],
    ];
  }

  // Réattribuer des positions continues afin d'éviter les doublons.
  await prisma.$transaction(
    mediaList.map((media, index) =>
      prisma.projectMedia.update({
        where: { id: media.id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath(`/admin/projets/${projectId}/modifier`);
  revalidatePath("/admin/projets");
  revalidatePath("/realisations");
  revalidatePath(`/realisations/${project.slug}`);
  revalidatePath("/");
}

/**
 * Supprime un média de la galerie principale d'un chantier.
 */
export async function deleteProjectMedia(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const mediaId = readText(formData, "mediaId");

  if (!projectId || !mediaId) {
    throw new Error("Informations de suppression incomplètes.");
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

  const media = await prisma.projectMedia.findFirst({
    where: {
      id: mediaId,
      projectId,
    },
  });

  if (!media) {
    throw new Error("Média introuvable dans cette galerie.");
  }

  // On supprime d'abord le fichier Cloudinary si son publicId est connu.
  if (media.publicId) {
    const expectedPrefix = `berem/chantiers/${projectId}/galerie/`;

    if (!media.publicId.startsWith(expectedPrefix)) {
      throw new Error("Le média ne correspond pas au dossier Cloudinary du chantier.");
    }

    const resourceType = media.type === "VIDEO" ? "video" : "image";

    const result = await cloudinary.uploader.destroy(media.publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("La suppression du fichier Cloudinary a échoué.");
    }
  }

  // Supprimer l'enregistrement uniquement après le traitement Cloudinary.
  await prisma.projectMedia.delete({
    where: { id: media.id },
  });

  const remainingMedia = await prisma.projectMedia.findMany({
    where: { projectId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });

  await prisma.$transaction(
    remainingMedia.map((item, index) =>
      prisma.projectMedia.update({
        where: { id: item.id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath(`/admin/projets/${projectId}/modifier`);
  revalidatePath("/admin/projets");
  revalidatePath("/realisations");
  revalidatePath(`/realisations/${project.slug}`);
  revalidatePath("/");
}


/**
 * Supprime un média associé à un compte rendu de chantier.
 */
export async function deleteProjectUpdateMedia(formData: FormData) {
  await requireAdmin();

  const projectId = readText(formData, "projectId");
  const updateId = readText(formData, "updateId");
  const mediaId = readText(formData, "mediaId");

  if (!projectId || !updateId || !mediaId) {
    throw new Error("Informations de suppression incomplètes.");
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

  const media = await prisma.projectUpdateMedia.findFirst({
    where: {
      id: mediaId,
      projectUpdateId: updateId,
    },
  });

  if (!media) {
    throw new Error("Média introuvable dans ce compte rendu.");
  }

  // Les anciens médias sans publicId ne peuvent pas être supprimés
  // de Cloudinary de manière suffisamment sûre.
  if (!media.publicId) {
    throw new Error(
      "Ce média ancien ne possède pas d'identifiant Cloudinary. " +
      "Il faut retrouver son identifiant avant de pouvoir le supprimer."
    );
  }

  const expectedPrefix =
    `berem/chantiers/${projectId}/${updateId}/`;

  if (!media.publicId.startsWith(expectedPrefix)) {
    throw new Error(
      "Le média ne correspond pas au dossier Cloudinary de ce compte rendu."
    );
  }

  const resourceType = media.type === "VIDEO" ? "video" : "image";

  // Supprimer le fichier Cloudinary avant de supprimer sa référence en base.
  const result = await cloudinary.uploader.destroy(media.publicId, {
    resource_type: resourceType,
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("La suppression du fichier Cloudinary a échoué.");
  }

  await prisma.projectUpdateMedia.delete({
    where: {
      id: media.id,
    },
  });

  // Réorganiser les médias restants.
  const remainingMedia = await prisma.projectUpdateMedia.findMany({
    where: {
      projectUpdateId: updateId,
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
    },
  });

  await prisma.$transaction(
    remainingMedia.map((item, index) =>
      prisma.projectUpdateMedia.update({
        where: {
          id: item.id,
        },
        data: {
          sortOrder: index,
        },
      })
    )
  );

  revalidatePath(`/admin/projets/${projectId}/suivi`);
  revalidatePath(`/realisations/${project.slug}`);
  revalidatePath("/realisations");
  revalidatePath("/");
}