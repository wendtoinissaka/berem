"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { StatisticSource } from "@/generated/prisma/client";

function readStatisticForm(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const sourceValue = String(formData.get("source") ?? "MANUAL");
  const manualValue =
    String(formData.get("manualValue") ?? "").trim() || null;
  const suffix = String(formData.get("suffix") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isVisible = formData.get("isVisible") === "on";

  if (!label) {
    throw new Error("Le libellé de la statistique est obligatoire.");
  }

  if (label.length > 100) {
    throw new Error("Le libellé ne doit pas dépasser 100 caractères.");
  }

  if (
    !Object.values(StatisticSource).includes(
      sourceValue as StatisticSource,
    )
  ) {
    throw new Error("La source sélectionnée est invalide.");
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("L'ordre doit être un entier positif ou nul.");
  }

  if (sourceValue === "MANUAL" && !manualValue) {
    throw new Error(
      "Renseignez une valeur pour une statistique manuelle.",
    );
  }

  return {
    label,
    description,
    source: sourceValue as StatisticSource,
    manualValue: sourceValue === "MANUAL" ? manualValue : null,
    suffix,
    sortOrder,
    isVisible,
  };
}

function refreshStatisticPages() {
  revalidatePath("/admin/statistiques");
  revalidatePath("/");
}

export async function createStatistic(formData: FormData) {
  await requireAdmin();

  const data = readStatisticForm(formData);

  await prisma.homeStatistic.create({
    data,
  });

  refreshStatisticPages();
  redirect("/admin/statistiques");
}

export async function updateStatistic(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Identifiant de la statistique manquant.");
  }

  const existing = await prisma.homeStatistic.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("Cette statistique n'existe pas.");
  }

  const data = readStatisticForm(formData);

  await prisma.homeStatistic.update({
    where: { id },
    data,
  });

  refreshStatisticPages();
  redirect("/admin/statistiques");
}

export async function deleteStatistic(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Identifiant de la statistique manquant.");
  }

  const existing = await prisma.homeStatistic.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("Cette statistique n'existe pas.");
  }

  await prisma.homeStatistic.delete({
    where: { id },
  });

  refreshStatisticPages();
  redirect("/admin/statistiques");
}