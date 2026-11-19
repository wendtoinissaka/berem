import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Mentions légales | BEREM Ingénierie",
  description:
    "Consultez les mentions légales du site de BEREM Ingénierie : informations sur l'éditeur, l'hébergement, la propriété intellectuelle et les responsabilités.",
};

const sections = [
  {
    title: "1. Éditeur du site",
    content: (
      <>
        <p>
          Le site www.berem.bf est édité par BEREM Ingénierie, entreprise
          établie au Burkina Faso.
        </p>

        <ul>
          <li>
            <strong>Dénomination :</strong> BEREM Ingénierie
          </li>
          <li>
            <strong>Forme juridique :</strong> Entreprise individuelle
            (personne physique)
          </li>
          <li>
            <strong>Responsable :</strong> ZONWENDREMA DERFASSI JOB KABORE
          </li>
          <li>
            <strong>Identifiant Fiscal Unique (IFU) :</strong> 00123253F
          </li>
          <li>
            <strong>RCCM :</strong> BF-OUA-2019-A-5815
          </li>
          <li>
            <strong>Date d'immatriculation :</strong> 6 août 2019
          </li>
          <li>
            <strong>Adresse :</strong> Secteur 51 (nouveau), Ouagadougou,
            Burkina Faso
          </li>
          <li>
            <strong>Téléphone :</strong> +226 61 91 00 41
          </li>
          <li>
            <strong>Site internet :</strong> www.berem.bf
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "2. Hébergement",
    content: (
      <p>
        Le site est hébergé par ECODEV, prestataire de services d'hébergement
        web et de gestion de noms de domaine au Burkina Faso.
      </p>
    ),
  },
  {
    title: "3. Propriété intellectuelle",
    content: (
      <>
        <p>
          Les textes, photographies, logos et autres éléments présents sur le
          site sont protégés par les règles applicables en matière de propriété
          intellectuelle.
        </p>
        <p>
          Toute reproduction, modification ou utilisation sans autorisation
          préalable est interdite, sauf exceptions prévues par la loi.
        </p>
      </>
    ),
  },
  {
    title: "4. Responsabilité",
    content: (
      <p>
        BEREM Ingénierie s'efforce de fournir des informations fiables et
        actualisées. Toutefois, l'entreprise ne saurait garantir l'absence
        d'erreurs ou d'interruptions du site.
      </p>
    ),
  },
  {
    title: "5. Contact",
    content: (
      <p>
        Pour toute question concernant le site, vous pouvez contacter BEREM
        Ingénierie au{" "}
        <a href="tel:+22661910041">+226 61 91 00 41</a>.
      </p>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout
      title="Mentions légales"
      description="Retrouvez les informations relatives à l'éditeur, à l'hébergement et aux conditions d'utilisation du site BEREM Ingénierie."
      type="legal"
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