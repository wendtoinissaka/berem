"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { QuoteStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const STATUS_LABELS: Record<QuoteStatus, string> = {
  NEW: "Nouvelle",
  IN_REVIEW: "En cours d'examen",
  ADDITIONAL_INFO_REQUIRED: "Informations complémentaires requises",
  QUOTE_SENT: "Devis envoyé",
  CLOSED: "Clôturée",
};

export async function updateQuoteStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const statusValue = String(formData.get("status") ?? "").trim();

  if (!id) {
    throw new Error("Identifiant de la demande manquant.");
  }

  const allowedStatuses = Object.values(QuoteStatus);

  if (!allowedStatuses.includes(statusValue as QuoteStatus)) {
    throw new Error("Le statut sélectionné est invalide.");
  }

  const newStatus = statusValue as QuoteStatus;

  const existingQuote = await prisma.quoteRequest.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existingQuote) {
    throw new Error("Cette demande de devis n'existe pas.");
  }

  if (existingQuote.status !== newStatus) {
    await prisma.$transaction([
      prisma.quoteRequest.update({
        where: { id },
        data: { status: newStatus },
      }),
      prisma.quoteActivity.create({
        data: {
          quoteRequestId: id,
          type: "STATUS_CHANGE",
          message: `Statut modifié : ${STATUS_LABELS[existingQuote.status]} → ${STATUS_LABELS[newStatus]}.`,
          oldStatus: existingQuote.status,
          newStatus,
        },
      }),
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/devis");
  revalidatePath(`/admin/devis/${id}`);

  redirect(`/admin/devis/${id}?updated=1`);
}

export async function addQuoteNote(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!id) {
    throw new Error("Identifiant de la demande manquant.");
  }

  if (!message) {
    throw new Error("La note ne peut pas être vide.");
  }

  if (message.length > 5000) {
    throw new Error("La note ne doit pas dépasser 5 000 caractères.");
  }

  const existingQuote = await prisma.quoteRequest.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingQuote) {
    throw new Error("Cette demande de devis n'existe pas.");
  }

  await prisma.quoteActivity.create({
    data: {
      quoteRequestId: id,
      type: "NOTE",
      message,
    },
  });

  revalidatePath(`/admin/devis/${id}`);

  redirect(`/admin/devis/${id}?noteAdded=1`);
}