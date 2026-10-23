import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notre entreprise | BEREM",
  description:
    "Découvrez BEREM, son approche, ses engagements et sa vision dans le domaine du bâtiment et des travaux.",
};

const values = [
  {
    number: "01",
    title: "Qualité",
    description:
      "Nous accordons une attention particulière à la qualité des travaux, aux finitions et au respect des exigences de chaque projet.",
  },
  {
    number: "02",
    title: "Engagement",
    description:
      "Nous nous engageons à accompagner nos clients avec sérieux, transparence et professionnalisme.",
  },
  {
    number: "03",
    title: "Rigueur",
    description:
      "Nous privilégions une organisation méthodique, un suivi rigoureux et une gestion attentive des projets.",
  },
  {
    number: "04",
    title: "Confiance",
    description:
      "Nous construisons des relations durables avec nos clients et partenaires grâce à une communication claire.",
  },
];

export default function EntreprisePage() {
  return (
    <main className="bg-white text-slate-900">
      {/* En-tête */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white md:py-32">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            À propos de BEREM
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Construire avec rigueur,
            <span className="block text-orange-400">
              avancer avec confiance.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Découvrez notre vision, notre approche et les principes qui
            orientent notre engagement dans la réalisation de vos projets.
          </p>

          <div className="mt-10">
            <Link
              href="/realisations"
              className="inline-flex items-center rounded-md bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Découvrir nos réalisations
              <span className="ml-3" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Qui sommes-nous ?
            </p>

            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              Une approche professionnelle au service de vos projets.
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              BEREM accompagne ses clients dans leurs projets de construction
              et de travaux. Notre approche repose sur l'écoute des besoins,
              la préparation des interventions et le suivi attentif de chaque
              réalisation.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Nous cherchons à proposer des solutions adaptées aux objectifs,
              aux contraintes et aux attentes de nos clients, avec une attention
              constante portée à la qualité et au sérieux de l'exécution.
            </p>
          </div>

          <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-10">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500 text-3xl font-black text-white">
                B
              </div>

              <h3 className="mt-6 text-2xl font-bold">BEREM</h3>

              <p className="mt-3 leading-7 text-slate-600">
                Une ambition : réaliser des projets avec méthode, exigence et
                professionnalisme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission et vision */}
      <section className="bg-slate-50 px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Notre mission
            </p>

            <h2 className="mt-4 text-2xl font-bold">
              Donner vie aux projets.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Comprendre les besoins de nos clients et contribuer à la
              réalisation de leurs projets grâce à une organisation rigoureuse,
              un accompagnement sérieux et une attention portée à la qualité.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Notre vision
            </p>

            <h2 className="mt-4 text-2xl font-bold">
              Bâtir une confiance durable.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Développer des relations durables avec nos clients et partenaires
              en faisant de la qualité, de la transparence et du
              professionnalisme les fondements de notre travail.
            </p>
          </article>
        </div>
      </section>

      {/* Valeurs */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Nos principes
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Les valeurs qui guident notre travail.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Ces principes constituent la base de notre approche et de la
              relation que nous souhaitons construire avec chaque client.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.number}
                className="rounded-xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <span className="text-sm font-bold text-orange-600">
                  {value.number}
                </span>

                <h3 className="mt-5 text-xl font-bold">{value.title}</h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="bg-orange-500 px-6 py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Parlons de votre projet.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-orange-50">
              Vous avez un projet de construction ou de travaux ? Présentez-nous
              votre besoin pour que nous puissions en discuter.
            </p>
          </div>

          <Link
            href="/devis"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-slate-950 px-7 py-4 font-semibold text-white transition hover:bg-slate-800"
          >
            Demander un devis
            <span className="ml-3" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
