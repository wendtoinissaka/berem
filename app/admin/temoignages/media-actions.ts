"use server";

import { requireAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

/**
 * Génère une signature sécurisée pour téléverser
 * une photo de témoignage vers Cloudinary.
 */
export async function createTestimonialPhotoUploadSignature(
  
  formData: FormData
) {
  await requireAdmin();
  const cloudinary = getCloudinary();

  const testimonialId = readText(formData, "testimonialId");

  const config = cloudinary.config();

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error("La configuration Cloudinary est incomplète.");
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Les nouvelles photos et les photos modifiées sont rangées
  // dans le dossier dédié aux témoignages.
  const folder = testimonialId
    ? `berem/temoignages/${testimonialId}`
    : "berem/temoignages";

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
 * Vérifie qu'une photo existe bien sur Cloudinary
 * avant de retourner son URL.
 */
export async function verifyTestimonialPhoto(formData: FormData) {
  await requireAdmin();
  const cloudinary = getCloudinary();
  const url = readText(formData, "url");
  const publicId = readText(formData, "publicId");

  if (!url || !publicId) {
    throw new Error("Informations de la photo incomplètes.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("URL de la photo invalide.");
  }

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.hostname !== "res.cloudinary.com"
  ) {
    throw new Error("Domaine de la photo non autorisé.");
  }

  if (!publicId.startsWith("berem/temoignages/")) {
    throw new Error("Cette photo ne se trouve pas dans le dossier autorisé.");
  }

  const asset = await cloudinary.api.resource(publicId, {
    resource_type: "image",
  });

  if (
    asset.secure_url !== url ||
    asset.public_id !== publicId ||
    asset.resource_type !== "image"
  ) {
    throw new Error("La photo Cloudinary n'a pas pu être vérifiée.");
  }

  return { url, publicId };
}