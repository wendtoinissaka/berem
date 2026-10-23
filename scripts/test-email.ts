import "dotenv/config";
import { verifyEmailConnection } from "../lib/email";

async function main() {
  try {
    await verifyEmailConnection();
    console.log("✅ Connexion SMTP établie avec succès.");
  } catch (error) {
    console.error("❌ Échec de la connexion SMTP.");
    console.error(
      error instanceof Error ? error.message : "Erreur inconnue"
    );
    process.exitCode = 1;
  }
}

main();