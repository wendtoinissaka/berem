import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  Construction,
  DraftingCompass,
  HardHat,
  MoveUpRight,
  Ruler,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Nos services | BEREM",
  description:
    "Découvrez les domaines d'intervention de BEREM : construction, travaux de bâtiment, rénovation et réhabilitation, suivi de projets.",
};

const services = [
  {
    number: "01",
    reference: "CONSTRUCTION",
    title: "Construire avec méthode. Bâtir pour durer.",
    name: "Construction",
    description:
      "Chaque projet de construction commence par une bonne compréhension des besoins. BEREM vous accompagne de la préparation à la réalisation, en tenant compte des contraintes techniques et des objectifs définis.",
    details: [
      "Étude des besoins",
      "Préparation du projet",
      "Suivi de la réalisation",
    ],
    icon: Building2,
    accent: "01 / 04",
  },
  {
    number: "02",
    reference: "TRAVAUX DE BÂTIMENT",
    title: "De la conception à la qualité d'exécution.",
    name: "Travaux de bâtiment",
    description:
      "Nous intervenons dans la réalisation et l'accompagnement des travaux de bâtiment. Notre approche repose sur une organisation rigoureuse, une coordination des interventions et une attention particulière à l'exécution.",
    details: [
      "Organisation des travaux",
      "Coordination des interventions",
      "Contrôle de l'exécution",
    ],
    icon: Construction,
    accent: "02 / 04",
  },
  {
    number: "03",
    reference: "RÉNOVATION & RÉHABILITATION",
    title: "Donner une nouvelle perspective à l'existant.",
    name: "Rénovation et réhabilitation",
    description:
      "Un bâtiment existant peut nécessiter une transformation, une remise en état ou une adaptation. BEREM accompagne ces interventions en fonction de l'état des ouvrages et des besoins identifiés.",
    details: [
      "Évaluation des besoins",
      "Planification des interventions",
      "Suivi des travaux",
    ],
    icon: DraftingCompass,
    accent: "03 / 04",
  },
  {
    number: "04",
    reference: "GESTION & COORDINATION",
    title: "Garder la maîtrise de chaque étape.",
    name: "Suivi de projets",
    description:
      "La réussite d'un projet repose aussi sur la qualité de son organisation. Nous accompagnons le suivi des différentes étapes pour faciliter la coordination et assurer une meilleure visibilité sur l'avancement.",
    details: [
      "Suivi de l'avancement",
      "Coordination des étapes",
      "Communication sur le projet",
    ],
    icon: ClipboardCheck,
    accent: "04 / 04",
  },
];

const commitments = [
  {
    icon: Ruler,
    title: "Approche technique",
    description:
      "Des interventions pensées en fonction des exigences et des contraintes de chaque projet.",
  },
  {
    icon: ShieldCheck,
    title: "Exigence de qualité",
    description:
      "Une attention portée à l'organisation, à l'exécution et au suivi des travaux.",
  },
  {
    icon: HardHat,
    title: "Accompagnement",
    description:
      "Un interlocuteur pour vous accompagner dans les différentes étapes de votre projet.",
  },
];

export default function ServicesPage() {
  return (
    <main className="overflow-hidden bg-[#FBF7F1] text-[#10161F]">

      {/* =====================================================
          HERO — INTRODUCTION
      ===================================================== */}
<section className="relative isolate overflow-hidden bg-[#10161F] text-white">

  {/* Décor architectural */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.07]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }}
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full border border-white/[0.08]"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-20 top-24 h-[300px] w-[300px] rounded-full border border-[#D59344]/20"
  />

  <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-14 sm:pt-12 lg:px-10 lg:pb-16 lg:pt-14">

    {/* Fil d'Ariane */}
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
      <Link
        href="/"
        className="transition-colors hover:text-[#D59344]"
      >
        Accueil
      </Link>

      <span className="h-1 w-1 rounded-full bg-[#D59344]" />

      <span className="text-[#D59344]">Nos services</span>
    </div>

    <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1fr_0.55fr] lg:items-end lg:gap-12">

      {/* Titre principal */}
      <div>
        <div className="flex items-center gap-4">
          <span className="h-[2px] w-10 bg-[#D59344]" />

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D59344]">
            Nos domaines d'intervention
          </span>
        </div>

        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl xl:text-[68px]">
          L'ingénierie
          <br />
          <span className="text-[#D59344]">au cœur</span>
          <br />
          de vos projets.
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
          De la construction à la réhabilitation, BEREM vous accompagne
          dans vos projets de bâtiment avec une approche fondée sur
          l'organisation, la technique et le suivi.
        </p>
      </div>

      {/* Bloc latéral */}
      <div className="relative border-l border-white/15 pl-6 lg:mb-2 lg:pl-7">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/40">
          Notre champ d'action
        </span>

        <p className="mt-3 text-xl font-semibold leading-snug text-white sm:text-2xl">
          Des besoins concrets.
          <br />
          <span className="text-[#D59344]">
            Des réponses adaptées.
          </span>
        </p>

        <Link
          href="#expertises"
          className="group mt-6 inline-flex items-center gap-3 text-sm font-bold text-white transition-colors hover:text-[#D59344]"
        >
          Découvrir nos expertises

          <ArrowDown
            size={17}
            className="transition-transform duration-300 group-hover:translate-y-1"
          />
        </Link>
      </div>
    </div>

    {/* Bas du Hero */}
    <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-5 sm:mt-12">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
        BEREM — Bâtiment & ingénierie
      </span>

      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
        Nos prestations / 2026
      </span>
    </div>
  </div>
</section>


      {/* =====================================================
          INTRODUCTION AUX SERVICES
      ===================================================== */}
      <section
        id="expertises"
        className="relative px-5 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-28 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">

          <div>
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-9 bg-[#D59344]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                Ce que nous faisons
              </p>
            </div>

            <h2 className="mt-6 max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-[#10161F] sm:text-5xl">
              Une expertise
              <br />
              <span className="text-[#D59344]">
                à chaque étape.
              </span>
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-8 text-[#647084]">
              Chaque projet possède ses propres exigences. C'est pourquoi
              nous adaptons notre accompagnement à la nature des travaux,
              aux contraintes identifiées et aux objectifs du client.
            </p>
          </div>
        </div>
      </section>


      {/* =====================================================
          SERVICES — PRÉSENTATION ÉDITORIALE
      ===================================================== */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="border-t border-[#EAE1D7]">

            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  className="group relative grid gap-8 border-b border-[#EAE1D7] py-12 transition-colors duration-500 hover:bg-white/60 sm:py-16 lg:grid-cols-[100px_1fr_0.85fr] lg:gap-12 lg:py-20"
                >

                  {/* NUMÉRO */}
                  <div className="flex items-start justify-between lg:block">
                    <span className="text-4xl font-black tracking-tighter text-[#D59344] sm:text-5xl">
                      {service.number}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9AA1AA] lg:hidden">
                      {service.accent}
                    </span>
                  </div>

                  {/* TITRE ET ICÔNE */}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-7 bg-[#D59344]" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BE7D32]">
                        {service.reference}
                      </span>
                    </div>

                    <h3 className="mt-6 max-w-xl text-3xl font-black leading-[1.12] tracking-tight text-[#10161F] transition-colors duration-300 group-hover:text-[#BE7D32] sm:text-4xl lg:text-[42px]">
                      {service.title}
                    </h3>

                    <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-[#D59344]/30 bg-white text-[#BE7D32] transition-all duration-500 group-hover:rotate-6 group-hover:border-[#D59344] group-hover:bg-[#D59344] group-hover:text-[#10161F]">
                      <Icon size={23} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* DESCRIPTION ET DÉTAILS */}
                  <div className="lg:pt-7">
                    <p className="text-sm leading-8 text-[#647084] sm:text-base">
                      {service.description}
                    </p>

                    <div className="mt-7">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#10161F]">
                        Nos interventions
                      </p>

                      <ul className="mt-5 space-y-4">
                        {service.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-center gap-3 text-sm text-[#647084]"
                          >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D59344]" />

                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href="/devis"
                      className="group/link mt-9 inline-flex items-center gap-3 text-sm font-bold text-[#10161F] transition-colors hover:text-[#BE7D32]"
                    >
                      Discuter de ce service

                      <ArrowUpRight
                        size={17}
                        className="transition-transform duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>

                  {/* REPÈRE LATÉRAL */}
                  <span className="pointer-events-none absolute right-0 top-12 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0A7AF] lg:block">
                    {service.accent}
                  </span>

                  {/* Ligne décorative */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D59344] transition-all duration-700 group-hover:w-full" />

                </article>
              );
            })}

          </div>
        </div>
      </section>


      {/* =====================================================
          NOS ENGAGEMENTS
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#F3E9DC] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border border-[#10161F]/[0.06]"
        />

        <div className="relative mx-auto max-w-7xl">

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">

            <div>
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-9 bg-[#D59344]" />

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                  Notre approche
                </p>
              </div>

              <h2 className="mt-6 max-w-lg text-4xl font-black leading-[1.08] tracking-tight text-[#10161F] sm:text-5xl">
                Plus qu'une prestation,
                <br />
                <span className="text-[#BE7D32]">
                  un accompagnement.
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-base leading-8 text-[#647084] lg:justify-self-end">
              Au-delà de la réalisation des travaux, nous accordons une
              importance particulière à la compréhension du besoin, à
              l'organisation des interventions et au suivi du projet.
            </p>

          </div>

          {/* Engagements */}
          <div className="mt-16 grid gap-10 border-t border-[#10161F]/10 pt-10 md:grid-cols-3">

            {commitments.map((commitment, index) => {
              const Icon = commitment.icon;

              return (
                <div key={commitment.title} className="group">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D59344]/40 bg-white/60 text-[#BE7D32] transition-all duration-300 group-hover:bg-[#D59344] group-hover:text-[#10161F]">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <span className="text-xs font-bold text-[#10161F]/30">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-black text-[#10161F]">
                    {commitment.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-[#647084]">
                    {commitment.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>


      {/* =====================================================
          CTA — PARLONS DE VOTRE PROJET
      ===================================================== */}

    </main>
  );
}