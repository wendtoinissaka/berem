import { NextResponse } from "next/server";
import { verifyEmailConnection } from "@/lib/email";

export async function GET() {
  // Ne pas exposer cette route en production.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, message: "Route de test désactivée." },
      { status: 404 }
    );
  }

  try {
    await verifyEmailConnection();

    return NextResponse.json({
      success: true,
      message: "Connexion SMTP établie avec succès.",
    });
  } catch (error) {
    console.error("Échec du test SMTP :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Connexion SMTP impossible. Consultez les logs du serveur.",
      },
      { status: 500 }
    );
  }
}