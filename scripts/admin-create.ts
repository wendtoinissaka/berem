import { hash } from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL est manquante.");
  }

  const url = new URL(databaseUrl);

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\/+/, "")),
    connectionLimit: 2,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    // Ne jamais réinitialiser un compte déjà existant.
    const existingAdmin = await prisma.admin.findFirst({
      select: { id: true, email: true },
    });

    if (existingAdmin) {
      console.log(
        `Administrateur déjà présent (${existingAdmin.email}). Aucune modification.`,
      );
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("ADMIN_EMAIL absent ou invalide.");
    }

    if (!password || password.length < 12) {
      throw new Error(
        "ADMIN_PASSWORD doit contenir au moins 12 caractères.",
      );
    }

    const passwordHash = await hash(password, 12);

    await prisma.admin.create({
      data: {
        id: "main",
        email,
        passwordHash,
        mustChangePassword: false,
      },
    });

    console.log(`Compte administrateur créé : ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Échec de création du compte administrateur :", error);
  process.exitCode = 1;
});