"use server";

import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createAdminSession,
  destroyAdminSession,
} from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_TOKEN_LIFETIME_MS = 20 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 12;
const MAX_BCRYPT_PASSWORD_BYTES = 72;

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function loginAdmin(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/admin/connexion?erreur=identifiants");
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  const passwordMatches = admin
    ? await bcrypt.compare(password, admin.passwordHash)
    : false;

  if (!admin || !passwordMatches) {
    redirect("/admin/connexion?erreur=identifiants");
  }

  await createAdminSession({
    id: admin.id,
    sessionVersion: admin.sessionVersion,
  });

  redirect("/admin");
}

export async function requestPasswordReset(
  formData: FormData,
): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  // La réponse reste identique, que l'adresse existe ou non.
  // Cela évite de révéler l'adresse e-mail de l'administrateur.
  if (email) {
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (admin) {
      const rawToken = randomBytes(32).toString("hex");
      const tokenHash = hashResetToken(rawToken);
      const expiresAt = new Date(Date.now() + RESET_TOKEN_LIFETIME_MS);

      await prisma.$transaction([
        prisma.passwordResetToken.deleteMany({
          where: { adminId: admin.id },
        }),
        prisma.passwordResetToken.create({
          data: {
            adminId: admin.id,
            tokenHash,
            expiresAt,
          },
        }),
      ]);

      try {
        const siteUrl = process.env.SITE_URL || "http://localhost:3000";
        if (!siteUrl) {
          throw new Error("La variable SITE_URL est manquante.");
        }

        const resetUrl = new URL(
          "/admin/reinitialiser-mot-de-passe",
          siteUrl,
        );
        resetUrl.searchParams.set("token", rawToken);

        await sendPasswordResetEmail(admin.email, resetUrl.toString());
      } catch (error) {
        console.error("[BEREM] Échec de l'envoi du lien de réinitialisation :", error);
      }
    }
  }

  redirect("/admin/mot-de-passe-oublie?sent=1");
}

export async function resetAdminPassword(
  formData: FormData,
): Promise<void> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  const passwordBytes = Buffer.byteLength(password, "utf8");
  const isPasswordValid =
    password.length >= MIN_PASSWORD_LENGTH &&
    passwordBytes <= MAX_BCRYPT_PASSWORD_BYTES;

  if (
    !/^[a-f0-9]{64}$/i.test(token) ||
    !isPasswordValid ||
    password !== confirmation
  ) {
    redirect(
      `/admin/reinitialiser-mot-de-passe?token=${encodeURIComponent(token)}&erreur=validation`,
    );
  }

  const tokenHash = hashResetToken(token);
  const now = new Date();

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    select: {
      id: true,
      adminId: true,
    },
  });

  if (!resetToken) {
    redirect("/admin/reinitialiser-mot-de-passe?erreur=invalide");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // La consommation du jeton est atomique : deux requêtes simultanées
  // ne peuvent pas utiliser le même lien de réinitialisation.
  const updated = await prisma.$transaction(async (tx) => {
    const consumed = await tx.passwordResetToken.updateMany({
      where: {
        id: resetToken.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });

    if (consumed.count !== 1) return false;

    await tx.admin.update({
      where: { id: resetToken.adminId },
      data: {
        passwordHash,
        mustChangePassword: false,
        sessionVersion: { increment: 1 },
      },
    });

    await tx.passwordResetToken.deleteMany({
      where: { adminId: resetToken.adminId },
    });

    return true;
  });

  if (!updated) {
    redirect("/admin/reinitialiser-mot-de-passe?erreur=invalide");
  }

  await destroyAdminSession();
  redirect("/admin/connexion?succes=mot-de-passe");
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/connexion");
}
