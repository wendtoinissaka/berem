"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const allowedTypes = [
  "GENERAL",
  "NEWS",
  "BLOG",
  "PROJECT",
  "CONSTRUCTION",
  "REAL_ESTATE",
  "DOMOTICS",
  "PROMOTION",
] as const;

function getFormData(formData: FormData) {
  const message = String(formData.get("message") ?? "").trim();
  const rawType = String(formData.get("type") ?? "GENERAL");

  if (!message) {
    throw new Error("Le message de l'annonce est obligatoire.");
  }

  if (!allowedTypes.includes(rawType as (typeof allowedTypes)[number])) {
    throw new Error("La catégorie sélectionnée est invalide.");
  }

  const dateValue = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? new Date(value) : null;
  };

  const integerValue = (key: string) => {
    const value = Number.parseInt(String(formData.get(key) ?? "0"), 10);
    return Number.isFinite(value) ? value : 0;
  };

  return {
    title: String(formData.get("title") ?? "").trim() || null,
    message,
    type: rawType as (typeof allowedTypes)[number],
    targetUrl: String(formData.get("targetUrl") ?? "").trim() || null,
    linkLabel: String(formData.get("linkLabel") ?? "").trim() || null,
    openInNewTab: formData.get("openInNewTab") === "on",
    isPublished: formData.get("isPublished") === "on",
    showInTicker: formData.get("showInTicker") === "on",
    sortOrder: integerValue("sortOrder"),
    priority: integerValue("priority"),
    startsAt: dateValue("startsAt"),
    endsAt: dateValue("endsAt"),
  };
}

export async function createAnnouncement(formData: FormData) {
  await requireAdmin();

  const data = getFormData(formData);

  if (data.startsAt && data.endsAt && data.endsAt < data.startsAt) {
    throw new Error("La date de fin doit être postérieure à la date de début.");
  }

  await prisma.announcement.create({ data });

  revalidatePath("/admin/annonces");
  revalidatePath("/");

  redirect("/admin/annonces");
}

export async function updateAnnouncement(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Identifiant de l'annonce manquant.");
  }

  const data = getFormData(formData);

  if (data.startsAt && data.endsAt && data.endsAt < data.startsAt) {
    throw new Error("La date de fin doit être postérieure à la date de début.");
  }

  await prisma.announcement.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/annonces");
  revalidatePath("/");

  redirect("/admin/annonces");
}

export async function toggleAnnouncementPublication(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const isPublished = formData.get("isPublished") === "true";

  if (!id) {
    throw new Error("Identifiant de l'annonce manquant.");
  }

  await prisma.announcement.update({
    where: { id },
    data: { isPublished },
  });

  revalidatePath("/admin/annonces");
  revalidatePath("/");
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Identifiant de l'annonce manquant.");
  }

  await prisma.announcement.delete({
    where: { id },
  });

  revalidatePath("/admin/annonces");
  revalidatePath("/");
}