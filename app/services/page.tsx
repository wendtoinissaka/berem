    import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nos services | BEREM",
  description:
    "Découvrez les services et prestations proposés par BEREM dans le domaine du bâtiment et des travaux.",
};

const services = [
  {
    number: "01",
    title: "Construction",
    description:
      "Accompagnement dans les projets de construction, de la préparation à la réalisation, selon les besoins et les contraintes du projet.",
    details: [
      "Étude des besoins",
      "Préparation du projet",
      "Suivi de la réalisation",
    ],
  },
  {
    number: "02",
    title: "Travaux de bâtiment",
    description:
      "Réalisation et accompagnement de travaux de bâtiment en tenant compte des exigences techniques et des objectifs du client.",
    details: [
      "Organisation des travaux",
      "Coordination des interventions",
      "Contrôle de l'exécution",
    ],
  },
  {
    number: "03",
    title: "Rénovation et réhabilitation",
    description:
      "Interventions visant à améliorer, remettre en état ou adapter des bâtiments existants en fonction des besoins identifiés.",
    details: [
      "Évaluation des besoins",
      "Planification des interventions",
      "Suivi des travaux",
    ],
  },
  {
    number: "04",
    title: "Suivi de projets",
    description:
      "Accompagnement dans l'organisation et le suivi des différentes étapes d'un projet afin de faciliter sa réalisation.",
    details: [
      "Suivi de l'avancement",
      "Coordination des étapes",
      "Communication sur le projet",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="bg-slate-950 px-6 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Nos prestations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Des solutions adaptées à vos projets.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Découvrez nos domaines d'intervention et échangeons sur les
            solutions adaptées à vos besoins.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.number}
                className="rounded-2xl border border-slate-200 p-7 transition hover:border-orange-300 hover:shadow-lg md:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-700">
                    {service.number}
                  </span>

                  <span className="text-2xl text-orange-500" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <h2 className="mt-7 text-2xl font-bold">{service.title}</h2>

                <p className="mt-4 leading-7 text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-3 text-slate-700"
                    >
                      <span className="font-bold text-orange-600" aria-hidden="true">
                        ✓
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/devis"
                  className="mt-8 inline-flex items-center font-semibold text-slate-900 transition hover:text-orange-600"
                >
                  Demander un devis
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl rounded-2xl bg-orange-500 px-7 py-10 text-white md:flex md:items-center md:justify-between md:gap-10 md:px-12 md:py-12">
          <div>
            <h2 className="text-3xl font-bold">
              Vous avez un projet en tête ?
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-orange-50">
              Contactez-nous pour nous présenter votre besoin et discuter de
              votre projet.
            </p>
          </div>

          <Link
            href="/devis"
            className="mt-7 inline-flex shrink-0 items-center rounded-md bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 md:mt-0"
          >
            Présenter mon projet
            <span className="ml-3" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}