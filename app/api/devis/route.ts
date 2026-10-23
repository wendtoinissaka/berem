import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendQuoteNotification,
  sendQuoteConfirmation,
} from "@/lib/email";

function getText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = getText(formData, "fullName");
    const email = getText(formData, "email").toLowerCase();
    const phone = getText(formData, "phone");
    const projectType = getText(formData, "projectType");
    const location = getText(formData, "location");
    const description = getText(formData, "description");
    const company = getText(formData, "company");
    const estimatedBudget = getText(formData, "estimatedBudget");
    const desiredDateValue = getText(formData, "desiredDate");

    // 1. Vérification des champs obligatoires
    if (
      !fullName ||
      !email ||
      !phone ||
      !projectType ||
      !location ||
      !description
    ) {
      return jsonError(
        "Veuillez remplir tous les champs obligatoires.",
        400
      );
    }

    // 2. Vérification des longueurs
    if (
      fullName.length > 120 ||
      email.length > 254 ||
      phone.length > 30 ||
      projectType.length > 100 ||
      location.length > 180 ||
      description.length < 10 ||
      description.length > 5000 ||
      company.length > 180 ||
      estimatedBudget.length > 100
    ) {
      return jsonError(
        "Certaines informations sont invalides.",
        400
      );
    }

    // 3. Vérification de l'adresse e-mail
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return jsonError(
        "Veuillez vérifier votre adresse e-mail.",
        400
      );
    }

    // 4. Vérification de la date souhaitée
    let desiredDate: Date | null = null;

    if (desiredDateValue) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(desiredDateValue)) {
        return jsonError(
          "La date souhaitée est invalide.",
          400
        );
      }

      const parsedDate = new Date(
        `${desiredDateValue}T12:00:00.000Z`
      );

      if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== desiredDateValue
      ) {
        return jsonError(
          "La date souhaitée est invalide.",
          400
        );
      }

      desiredDate = parsedDate;
    }

    // 5. Enregistrement de la demande dans PostgreSQL
    const quote = await prisma.quoteRequest.create({
      data: {
        fullName,
        email,
        phone,
        projectType,
        location,
        description,
        company: company || null,
        estimatedBudget: estimatedBudget || null,
        desiredDate,
      },
      select: {
        id: true,
      },
    });

    // 6. Notification à l'administrateur
    try {
    await sendQuoteNotification({
        fullName,
        email,
        phone,
        company: company || null,
        projectType,
        location,
        description,
        estimatedBudget: estimatedBudget || null,
        desiredDate,
        requestId: quote.id,
    });

    console.info(
        `Notification administrateur envoyée pour la demande ${quote.id}.`
    );
    } catch (emailError) {
    console.error(
        `Échec de la notification administrateur pour ${quote.id} :`,
        emailError
    );
    }

    // 7. Accusé de réception au client
    try {
    await sendQuoteConfirmation({
        fullName,
        email,
        phone,
        company: company || null,
        projectType,
        location,
        description,
        estimatedBudget: estimatedBudget || null,
        desiredDate,
        requestId: quote.id,
    });

    console.info(
        `Confirmation client envoyée pour la demande ${quote.id}.`
    );
    } catch (emailError) {
    console.error(
        `La demande ${quote.id} est enregistrée, mais la confirmation client a échoué :`,
        emailError
    );
    }

    // 8. Confirmation au navigateur
    return NextResponse.json({
    success: true,
    message:
        "Votre demande a bien été enregistrée. Merci de votre confiance.",
    requestId: quote.id,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la création de la demande de devis :",
      error
    );

    return jsonError(
      "Une erreur est survenue. Vos informations n'ont pas pu être enregistrées. Veuillez réessayer.",
      500
    );
  }
}