"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyTestimonialPhoto } from "@/app/admin/temoignages/media-actions";

function refreshTestimonialPages() {
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

function readTestimonialForm(formData: FormData) {
  const clientName = String(formData.get("clientName") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const projectName = String(formData.get("projectName") ?? "").trim();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim();
  const photoPublicId = String(formData.get("photoPublicId") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";
  const removePhoto = String(formData.get("removePhoto") ?? "") === "true";

  if (!clientName || !content) {
    throw new Error(
      "Le nom du client et le contenu du témoignage sont obligatoires."
    );
  }

  if (clientName.length > 150) {
    throw new Error("Le nom du client ne doit pas dépasser 150 caractères.");
  }

  if (content.length > 10000) {
    throw new Error("Le témoignage est trop long.");
  }

  // Si l'utilisateur demande explicitement de retirer la photo,
  // les champs photo sont ignorés.
  if (removePhoto) {
    return {
      clientName,
      company: company || null,
      role: role || null,
      content,
      projectName: projectName || null,
      photoUrl: null,
      photoPublicId: "",
      isPublished,
      removePhoto: true,
    };
  }

  // Une URL sans identifiant public peut correspondre à l'ancienne
  // photo du témoignage. La vérification Cloudinary sera effectuée
  // uniquement si une nouvelle photo est réellement envoyée.
  if (photoUrl && !photoPublicId) {
    return {
      clientName,
      company: company || null,
      role: role || null,
      content,
      projectName: projectName || null,
      photoUrl,
      photoPublicId: "",
      isPublished,
      removePhoto: false,
    };
  }

  if (!photoUrl && photoPublicId) {
    throw new Error("Les informations de la photo sont incohérentes.");
  }

  return {
    clientName,
    company: company || null,
    role: role || null,
    content,
    projectName: projectName || null,
    photoUrl: photoUrl || null,
    photoPublicId,
    isPublished,
    removePhoto: false,
  };
}

async function validateTestimonialPhoto(
  photoUrl: string | null,
  photoPublicId: string
) {
  if (!photoUrl || !photoPublicId) return null;

  const verificationForm = new FormData();
  verificationForm.set("url", photoUrl);
  verificationForm.set("publicId", photoPublicId);

  const verified = await verifyTestimonialPhoto(verificationForm);

  return verified.url;
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();

  const data = readTestimonialForm(formData);
  const id = String(formData.get("id") ?? "").trim();

  if (id) {
    const existing = await prisma.testimonial.findUnique({
      where: { id },
      select: {
        id: true,
        photoUrl: true,
      },
    });

    if (!existing) {
      throw new Error("Ce témoignage est introuvable.");
    }

    let finalPhotoUrl: string | null;

    if (data.removePhoto) {
      finalPhotoUrl = null;
    } else if (data.photoUrl && data.photoPublicId) {
      // Une nouvelle photo a été téléversée :
      // vérifier son existence et son identité sur Cloudinary.
      finalPhotoUrl = await validateTestimonialPhoto(
        data.photoUrl,
        data.photoPublicId
      );
    } else if (data.photoUrl) {
      // URL existante sans nouvel identifiant :
      // conserver la photo si elle correspond à celle déjà enregistrée.
      if (data.photoUrl !== existing.photoUrl) {
        throw new Error(
          "Pour remplacer la photo, utilise le bouton de téléversement."
        );
      }

      finalPhotoUrl = existing.photoUrl;
    } else {
      // Aucun changement de photo : conserver la photo existante.
      finalPhotoUrl = existing.photoUrl;
    }

    await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: data.clientName,
        company: data.company,
        role: data.role,
        content: data.content,
        projectName: data.projectName,
        photoUrl: finalPhotoUrl,
        isPublished: data.isPublished,
      },
    });
  } else {
    // Lors d'une création, une photo doit être téléversée
    // et accompagnée de son identifiant Cloudinary.
    if (data.photoUrl && !data.photoPublicId) {
      throw new Error(
        "Pour ajouter une photo, utilise le bouton de téléversement."
      );
    }

    const finalPhotoUrl = await validateTestimonialPhoto(
      data.photoUrl,
      data.photoPublicId
    );

    await prisma.testimonial.create({
      data: {
        clientName: data.clientName,
        company: data.company,
        role: data.role,
        content: data.content,
        projectName: data.projectName,
        photoUrl: finalPhotoUrl,
        isPublished: data.isPublished,
      },
    });
  }

  refreshTestimonialPages();
  redirect("/admin/temoignages");
}

export async function toggleTestimonialPublication(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Identifiant du témoignage manquant.");
  }

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    select: {
      id: true,
      isPublished: true,
    },
  });

  if (!testimonial) {
    throw new Error("Ce témoignage est introuvable.");
  }

  await prisma.testimonial.update({
    where: { id },
    data: {
      isPublished: !testimonial.isPublished,
    },
  });

  refreshTestimonialPages();
  redirect("/admin/temoignages");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!id || confirmation !== "SUPPRIMER") {
    throw new Error("Confirmation de suppression invalide.");
  }

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!testimonial) {
    throw new Error("Ce témoignage est introuvable.");
  }

  await prisma.testimonial.delete({
    where: { id },
  });

  refreshTestimonialPages();
  redirect("/admin/temoignages");
}