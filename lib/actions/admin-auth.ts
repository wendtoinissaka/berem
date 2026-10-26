"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import {
  createAdminSession,
  destroyAdminSession,
} from "@/lib/auth";

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  console.log("[DIAGNOSTIC AUTH]", {
  emailPresent: email.length > 0,
  passwordFieldPresent: formData.has("password"),
  passwordLength: password.length,
  hashPresent: Boolean(passwordHash),
//   hashLength: passwordHash?.length ?? 0,
//   hashPrefix: passwordHash?.slice(0, 7),
    hashLength: passwordHash?.length ?? 0,
    hashFormat: /^\$2[aby]\$\d{2}\$.{53}$/.test(passwordHash ?? ""),
});
  if (!configuredEmail || !passwordHash) {
    console.error("[Admin Auth] Configuration manquante.");
    redirect("/admin/connexion?erreur=config");
  }

  const emailMatches = email === configuredEmail;

  let passwordMatches = false;

  try {
    passwordMatches = await bcrypt.compare(password, passwordHash);
  } catch (error) {
    console.error("[Admin Auth] Erreur de vérification du hash.", error);
    redirect("/admin/connexion?erreur=config");
  }

  if (!emailMatches || !passwordMatches) {
    console.warn("[Admin Auth] Identifiants incorrects.", {
      emailMatches,
      passwordMatches,
    });

    redirect("/admin/connexion?erreur=identifiants");
  }

  try {
    await createAdminSession(configuredEmail);
  } catch (error) {
    console.error("[Admin Auth] Impossible de créer la session.", error);
    redirect("/admin/connexion?erreur=config");
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  await destroyAdminSession();
  redirect("/admin/connexion");
}