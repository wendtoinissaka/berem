import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité | BEREM Ingénierie",
  description:
    "Découvrez comment BEREM Ingénierie collecte, utilise, protège et conserve les données personnelles des utilisateurs de son site.",
};

const sections = [
  {
    title: "1. Responsable du traitement",
    content: (
      <p>
        BEREM Ingénierie, située au secteur 51 (nouveau), Ouagadougou, Burkina
        Faso, est responsable du traitement des données personnelles
        collectées sur le site www.berem.bf.
      </p>
    ),
  },
  {
    title: "2. Données collectées",
    content: (
      <>
        <p>
          Dans le cadre des formulaires de contact et de demande de devis,
          BEREM peut collecter les informations suivantes :
        </p>
        <ul>
          <li>Nom et prénom</li>
          <li>Numéro de téléphone</li>
          <li>Adresse e-mail</li>
          <li>
            Informations relatives au projet de construction ou de rénovation
          </li>
          <li>Messages et documents transmis volontairement</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Utilisation des données",
    content: (
      <p>
        Les informations collectées sont utilisées exclusivement pour répondre
        aux demandes, établir des devis, communiquer avec les clients et
        assurer le suivi des projets.
      </p>
    ),
  },
  {
    title: "4. Confidentialité et sécurité",
    content: (
      <>
        <p>
          BEREM Ingénierie s'engage à ne pas vendre les données personnelles
          de ses utilisateurs.
        </p>
        <p>
          Les informations peuvent être accessibles aux prestataires
          techniques intervenant dans le fonctionnement du site, notamment
          l'hébergeur ECODEV, dans la limite de leurs missions.
        </p>
        <p>
          Des mesures de sécurité appropriées sont mises en œuvre afin de
          protéger les données contre les accès non autorisés.
        </p>
      </>
    ),
  },
  {
    title: "5. Conservation des données",
    content: (
      <p>
        Les données personnelles sont conservées uniquement pendant la durée
        nécessaire au traitement des demandes et au respect des obligations
        légales applicables.
      </p>
    ),
  },
  {
    title: "6. Droits des utilisateurs",
    content: (
      <>
        <p>
          Conformément à la réglementation burkinabè relative à la protection
          des données personnelles, notamment la loi n°001-2021/AN, les
          utilisateurs peuvent exercer leurs droits d'accès, de rectification
          et de suppression de leurs données, dans les conditions prévues par
          la loi.
        </p>
        <p>
          Pour exercer ces droits, contactez BEREM Ingénierie au{" "}
          <a href="tel:+22661910041">+226 61 91 00 41</a>.
        </p>
      </>
    ),
  },
  {
    title: "7. Cookies",
    content: (
      <p>
        Le site peut utiliser des cookies nécessaires à son bon fonctionnement.
        Les éventuels cookies non essentiels sont soumis aux règles applicables
        en matière d'information et de consentement.
      </p>
    ),
  },
  {
    title: "8. Modification de la politique",
    content: (
      <p>
        BEREM Ingénierie se réserve le droit de modifier la présente politique
        afin de tenir compte des évolutions du site ou de la réglementation
        applicable.
      </p>
    ),
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      description="La protection de vos données personnelles est importante pour BEREM Ingénierie. Cette page présente les modalités de collecte, d'utilisation et de protection de vos informations."
      updatedAt="18 novembre 2026"
      type="privacy"
    >
      {sections.map((section) => (
        <section key={section.title} className="legal-section">
          <h2>{section.title}</h2>
          {section.content}
        </section>
      ))}
    </LegalPageLayout>
  );
}