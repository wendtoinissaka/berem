import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis pour initialiser l'administration.");
  }

  const passwordBytes = Buffer.byteLength(password, "utf8");
  if (password.length < 12 || passwordBytes > 72) {
    throw new Error("ADMIN_PASSWORD doit contenir au moins 12 caractères et 72 octets maximum.");
  }

  const existingAdminCount = await prisma.admin.count();

  if (existingAdminCount > 0) {
    console.log("[BEREM] Un compte administrateur existe déjà : aucune modification effectuée.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.create({
    data: {
      id: "main",
      email,
      passwordHash,
      mustChangePassword: false,
      sessionVersion: 0,
    },
  });

  console.log(`[BEREM] Compte administrateur initial créé pour ${email}.`);
}

main()
  .catch((error) => {
    console.error("[BEREM] Échec de l'initialisation de l'administrateur :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
