import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "berem_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET doit contenir au moins 32 caractères.");
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSession(admin: {
  id: string;
  sessionVersion: number;
}): Promise<void> {
  const token = await new SignJWT({
    adminId: admin.id,
    sessionVersion: admin.sessionVersion,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("berem")
    .setAudience("berem-admin")
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getAdminSession(): Promise<{
  adminId: string;
  sessionVersion: number;
} | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
      issuer: "berem",
      audience: "berem-admin",
    });

    if (
      typeof payload.adminId !== "string" ||
      typeof payload.sessionVersion !== "number"
    ) {
      return null;
    }

    return {
      adminId: payload.adminId,
      sessionVersion: payload.sessionVersion,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/connexion");

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      email: true,
      sessionVersion: true,
    },
  });

  // Ne pas supprimer le cookie ici : requireAdmin peut être exécuté
  // dans un Server Component, où la modification des cookies est interdite.
  if (!admin || admin.sessionVersion !== session.sessionVersion) {
    redirect("/admin/connexion");
  }

  return admin;
}

// À appeler depuis une Server Action ou une Route Handler uniquement.
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
