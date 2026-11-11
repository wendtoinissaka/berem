import "server-only";
import nodemailer from "nodemailer";

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
};

import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

/**
 * Récupère et valide la configuration SMTP uniquement
 * lorsqu'un envoi ou une vérification est demandé.
 */
function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;

  if (
    !host ||
    !Number.isInteger(port) ||
    port <= 0 ||
    !user ||
    !password
  ) {
    throw new Error("La configuration SMTP est incomplète.");
  }

  return { host, port, user, password };
}

/**
 * Initialise Nodemailer à la première utilisation.
 */
function getMailTransport() {
  const config = getSmtpConfig();

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }

  return {
    transporter,
    user: config.user,
  };
}

const BRAND = {
  name: "BEREM",
  navy: "#142B4A",
  turquoise: "#0F9D92",
  background: "#F3F6FA",
  text: "#253247",
  muted: "#64748B",
};

type QuoteEmailData = {
  fullName: string;
  email: string;
  phone: string;
  company?: string | null;
  projectType: string;
  location: string;
  description: string;
  estimatedBudget?: string | null;
  desiredDate?: Date | null;
};

export async function verifyEmailConnection() {
  const { transporter } = getMailTransport();
  await transporter.verify();
}

/**
 * Échappe les caractères HTML pour éviter d'interpréter
 * les informations saisies par le client comme du HTML.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date?: Date | null): string {
  if (!date) return "Non renseignée";

  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "UTC",
    dateStyle: "long",
  }).format(date);
}

/**
 * Enveloppe HTML commune aux e-mails BEREM.
 */
function emailLayout(content: string): string {
  return `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BEREM</title>
    </head>

    <body style="margin:0;padding:0;background-color:${BRAND.background};
      font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">

      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
        BEREM - Construisons votre projet avec confiance.
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        border="0" style="background-color:${BRAND.background};">
        <tr>
          <td align="center" style="padding:32px 12px;">

            <table role="presentation" width="600" cellspacing="0"
              cellpadding="0" border="0"
              style="width:100%;max-width:600px;background:#FFFFFF;
              border-radius:12px;overflow:hidden;">

              <tr>
                <td style="background-color:${BRAND.navy};padding:30px 32px;">
                  <div style="font-size:27px;font-weight:800;
                    letter-spacing:2px;color:#FFFFFF;">
                    ${BRAND.name}
                  </div>

                  <div style="margin-top:8px;font-size:12px;
                    letter-spacing:1.5px;color:#B8D7E8;">
                    CONFIANCE · QUALITÉ · ENGAGEMENT
                  </div>
                </td>
              </tr>

              <tr>
                <td style="height:5px;background-color:${BRAND.turquoise};
                  font-size:0;line-height:0;">&nbsp;</td>
              </tr>

              <tr>
                <td style="padding:32px;">
                  ${content}
                </td>
              </tr>

              <tr>
                <td style="padding:22px 32px;background-color:#F8FAFC;
                  border-top:1px solid #E8EDF3;">

                  <p style="margin:0;font-size:13px;line-height:21px;
                    color:${BRAND.muted};">
                    Cet e-mail a été envoyé automatiquement par le site
                    de ${BRAND.name}. Merci de votre confiance.
                  </p>

                  <p style="margin:12px 0 0;font-size:12px;
                    color:#94A3B8;">
                    © ${new Date().getFullYear()} ${BRAND.name}
                    - Tous droits réservés.
                  </p>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>`;
}

/**
 * Notification de nouvelle demande destinée à BEREM.
 */
export async function sendQuoteNotification(
  data: QuoteEmailData & { requestId: string }
) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error("La variable ADMIN_EMAIL est manquante.");
  }

  const html = emailLayout(`
    <div style="display:inline-block;padding:7px 12px;
      background:#E5F7F4;color:${BRAND.turquoise};
      border-radius:20px;font-size:12px;font-weight:bold;">
      NOUVELLE DEMANDE
    </div>

    <h1 style="margin:20px 0 12px;font-size:25px;line-height:34px;
      color:${BRAND.navy};">
      Une nouvelle demande de devis !
    </h1>

    <p style="margin:0 0 24px;font-size:15px;line-height:25px;">
      Une nouvelle demande vient d'être soumise sur le site BEREM.
      Voici les informations transmises par le prospect.
    </p>

    <table role="presentation" width="100%" cellspacing="0"
      cellpadding="0" style="border-collapse:collapse;
      background:#F8FAFC;border:1px solid #E5EAF1;">

      ${[
        ["Référence", data.requestId],
        ["Nom", data.fullName],
        ["Entreprise", data.company || "Non renseignée"],
        ["E-mail", data.email],
        ["Téléphone", data.phone],
        ["Type de projet", data.projectType],
        ["Localisation", data.location],
        ["Budget estimé", data.estimatedBudget || "Non renseigné"],
        ["Date souhaitée", formatDate(data.desiredDate)],
      ]
        .map(
          ([label, value]) => `
            <tr>
              <td style="padding:12px;border-bottom:1px solid #E5EAF1;
                font-size:13px;color:${BRAND.muted};width:38%;">
                ${escapeHtml(label)}
              </td>
              <td style="padding:12px;border-bottom:1px solid #E5EAF1;
                font-size:14px;font-weight:bold;color:${BRAND.navy};
                overflow-wrap:anywhere;">
                ${escapeHtml(value)}
              </td>
            </tr>`
        )
        .join("")}

    </table>

    <h2 style="margin:28px 0 12px;font-size:18px;color:${BRAND.navy};">
      Description du projet
    </h2>

    <div style="padding:18px;background:#F8FAFC;
      border-left:4px solid ${BRAND.turquoise};
      font-size:14px;line-height:24px;white-space:pre-wrap;
      overflow-wrap:anywhere;">
      ${escapeHtml(data.description)}
    </div>

    <p style="margin:24px 0 0;font-size:13px;line-height:22px;
      color:${BRAND.muted};">
      Pour répondre au prospect, utilise l'adresse e-mail indiquée
      dans sa demande.
    </p>
  `);
  const { transporter, user } = getMailTransport();
  await transporter.sendMail({
    from: {
      name: "BEREM",
      address: user,
    },
    to: adminEmail,
    replyTo: data.email,
    subject: `Nouvelle demande de devis - ${data.projectType}`,
    text: `
Nouvelle demande de devis BEREM

Référence : ${data.requestId}
Nom : ${data.fullName}
Entreprise : ${data.company || "Non renseignée"}
E-mail : ${data.email}
Téléphone : ${data.phone}
Type de projet : ${data.projectType}
Localisation : ${data.location}
Budget : ${data.estimatedBudget || "Non renseigné"}
Date souhaitée : ${formatDate(data.desiredDate)}

Description :
${data.description}
    `.trim(),
    html,
  });
}

/**
 * Accusé de réception destiné au client.
 */
export async function sendQuoteConfirmation(
  data: QuoteEmailData & { requestId: string }
) {
  const safeName = escapeHtml(data.fullName);
  const safeProjectType = escapeHtml(data.projectType);
  const safeRequestId = escapeHtml(data.requestId);

  const html = emailLayout(`
    <p style="margin:0 0 10px;font-size:14px;font-weight:bold;
      color:${BRAND.turquoise};">
      MERCI POUR VOTRE CONFIANCE
    </p>

    <h1 style="margin:0 0 20px;font-size:27px;line-height:36px;
      color:${BRAND.navy};">
      Bonjour ${safeName},
    </h1>

    <p style="margin:0 0 16px;font-size:15px;line-height:26px;">
      Nous vous remercions d'avoir contacté
      <strong>${BRAND.name}</strong> pour votre projet.
    </p>

    <p style="margin:0 0 24px;font-size:15px;line-height:26px;">
      Votre demande a bien été reçue. Notre équipe prendra le temps
      d'étudier vos besoins afin de vous apporter une réponse adaptée.
    </p>

    <table role="presentation" width="100%" cellspacing="0"
      cellpadding="0" style="background:#F0FAF8;border:1px solid #D5F0EB;
      border-radius:8px;">

      <tr>
        <td style="padding:20px 22px;">

          <p style="margin:0 0 14px;font-size:12px;
            letter-spacing:1px;font-weight:bold;color:${BRAND.turquoise};">
            RÉCAPITULATIF DE VOTRE DEMANDE
          </p>

          <p style="margin:0 0 10px;font-size:14px;line-height:22px;">
            <strong style="color:${BRAND.navy};">Référence :</strong>
            ${safeRequestId}
          </p>

          <p style="margin:0;font-size:14px;line-height:22px;">
            <strong style="color:${BRAND.navy};">Projet :</strong>
            ${safeProjectType}
          </p>

        </td>
      </tr>

    </table>

    <h2 style="margin:28px 0 12px;font-size:18px;color:${BRAND.navy};">
      Quelle est la prochaine étape ?
    </h2>

    <p style="margin:0 0 16px;font-size:14px;line-height:25px;">
      Notre équipe examinera les informations que vous nous avez
      transmises. Si nous avons besoin de précisions complémentaires,
      nous vous contacterons directement.
    </p>

    <p style="margin:0;font-size:14px;line-height:25px;">
      Nous vous remercions pour l'intérêt que vous portez à BEREM
      et vous disons à très bientôt.
    </p>

    <p style="margin:28px 0 0;font-size:15px;line-height:25px;
      color:${BRAND.navy};">
      Cordialement,<br>
      <strong>L'équipe BEREM</strong>
    </p>
  `);

  const { transporter, user } = getMailTransport();
  await transporter.sendMail({
    from: {
      name: "BEREM",
      address: user,
    },
    to: data.email,
    replyTo: process.env.ADMIN_EMAIL || user!,
    subject: "BEREM - Nous avons bien reçu votre demande de devis",
    text: `
Bonjour ${data.fullName},

Nous vous remercions d'avoir contacté BEREM.

Votre demande a bien été reçue et enregistrée.

Référence : ${data.requestId}
Projet : ${data.projectType}

Notre équipe étudiera vos besoins. Si des précisions complémentaires
sont nécessaires, nous vous contacterons directement.

Merci pour votre confiance.

Cordialement,
L'équipe BEREM
    `.trim(),
    html,
  });
}


// import "server-only";
// import nodemailer from "nodemailer";

// const host = process.env.SMTP_HOST;
// const port = Number(process.env.SMTP_PORT);
// const user = process.env.SMTP_USER;
// const password = process.env.SMTP_PASSWORD;

// if (!host || !port || !user || !password) {
//   throw new Error(
//     "La configuration SMTP est incomplète. Vérifiez les variables SMTP dans .env."
//   );
// }

// const transporter = nodemailer.createTransport({
//   host,
//   port,
//   secure: port === 465,
//   auth: {
//     user,
//     pass: password,
//   },
// });

// export async function verifyEmailConnection() {
//   await transporter.verify();
// }

// export async function sendQuoteNotification(data: {
//   fullName: string;
//   email: string;
//   phone: string;
//   company?: string | null;
//   projectType: string;
//   location: string;
//   description: string;
//   estimatedBudget?: string | null;
//   desiredDate?: Date | null;
// }) {
//   const adminEmail = process.env.ADMIN_EMAIL;

//   if (!adminEmail) {
//     throw new Error("La variable ADMIN_EMAIL est manquante.");
//   }

//   const date = data.desiredDate
//     ? data.desiredDate.toLocaleDateString("fr-FR", {
//         timeZone: "UTC",
//       })
//     : "Non renseignée";

//   await transporter.sendMail({
//     from: {
//       name: "BEREM",
//       address: user,
//     },
//     to: adminEmail,
//     replyTo: data.email,
//     subject: `Nouvelle demande de devis - ${data.projectType}`,
//     text: `
// Nouvelle demande de devis reçue sur le site BEREM.

// Nom : ${data.fullName}
// Entreprise : ${data.company || "Non renseignée"}
// E-mail : ${data.email}
// Téléphone : ${data.phone}
// Type de projet : ${data.projectType}
// Localisation : ${data.location}
// Budget estimé : ${data.estimatedBudget || "Non renseigné"}
// Date souhaitée : ${date}

// Description du projet :
// ${data.description}
//     `.trim(),
//   });
// }