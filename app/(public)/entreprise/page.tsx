import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  Compass,
  Eye,
  Handshake,
  ShieldCheck,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Notre entreprise | BEREM",
  description:
    "Découvrez BEREM, son approche, sa mission, sa vision et les valeurs qui guident ses interventions dans le domaine du bâtiment et des travaux.",
};

const values = [
  {
    number: "01",
    title: "Qualité",
    description:
      "Une attention particulière portée à la qualité des travaux, aux finitions et aux exigences propres à chaque projet.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Engagement",
    description:
      "Un accompagnement fondé sur le sérieux, la transparence et le professionnalisme dans chaque collaboration.",
    icon: Handshake,
  },
  {
    number: "03",
    title: "Rigueur",
    description:
      "Une organisation méthodique, un suivi attentif et une gestion structurée des différentes étapes.",
    icon: Compass,
  },
  {
    number: "04",
    title: "Confiance",
    description:
      "Des relations professionnelles durables construites autour de l'écoute et d'une communication claire.",
    icon: Building2,
  },
];

export default function EntreprisePage() {
  return (
    <main className="overflow-hidden bg-[#FBF7F1] text-[#10161F]">

      {/* =====================================================
          HERO - IDENTITÉ DE L'ENTREPRISE
      ===================================================== */}
<section className="relative isolate overflow-hidden bg-[#10161F] text-white">

  {/* Trame architecturale */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.06]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
      backgroundSize: "72px 72px",
    }}
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full border border-white/[0.08]"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-20 top-20 h-[400px] w-[400px] rounded-full border border-[#D59344]/20"
  />

  <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-14 sm:pt-12 lg:px-10 lg:pb-16 lg:pt-14">

    {/* Fil d'Ariane */}
    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
      <Link href="/" className="transition-colors hover:text-[#D59344]">
        Accueil
      </Link>

      <span className="h-1 w-1 rounded-full bg-[#D59344]" />

      <span className="text-[#D59344]">L'entreprise</span>
    </div>

    <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_0.55fr] lg:items-center lg:gap-16">

      {/* Titre */}
      <div>
        <div className="flex items-center gap-4">
          <span className="h-[2px] w-9 bg-[#D59344]" />

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D59344]">
            À propos de BEREM
          </span>
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-6xl xl:text-[68px]">
          Construire avec
          <br />
          <span className="text-[#D59344]">rigueur.</span>
          <br className="hidden sm:block" />
          <span className="sm:whitespace-nowrap">
            Avancer avec confiance.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
          BEREM accompagne ses clients dans leurs projets de construction
          et de travaux, avec une approche fondée sur l'écoute,
          l'organisation et le suivi.
        </p>
      </div>

      {/* Bloc latéral */}
      <div className="relative border-l border-white/15 pl-6 lg:mb-0 lg:pl-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
          Notre philosophie
        </span>

        <p className="mt-4 max-w-sm text-xl font-semibold leading-snug sm:text-2xl">
          La qualité d'un projet commence par la qualité de son
          accompagnement.
        </p>

        <Link
          href="#presentation"
          className="group mt-6 inline-flex items-center gap-3 text-sm font-bold text-[#D59344] transition-colors hover:text-white"
        >
          Découvrir BEREM

          <ArrowDown
            size={16}
            className="transition-transform duration-300 group-hover:translate-y-1"
          />
        </Link>
      </div>
    </div>

    {/* Signature */}
    <div className="mt-12 flex items-center justify-between border-t border-white/15 pt-5 sm:mt-14">
      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35 sm:text-[10px]">
        BEREM - Bâtiment & ingénierie
      </span>

      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35 sm:text-[10px]">
        Notre entreprise
      </span>
    </div>
  </div>
</section>


      {/* =====================================================
          PRÉSENTATION - QUI SOMMES-NOUS ?
      ===================================================== */}
      <section
        id="presentation"
        className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.85fr_1fr] lg:gap-24">

          {/* Colonne gauche */}
          <div>
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-9 bg-[#D59344]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                Qui sommes-nous ?
              </p>
            </div>

            <h2 className="mt-7 max-w-xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
              Une approche
              <br />
              <span className="text-[#D59344]">
                pensée pour durer.
              </span>
            </h2>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D59344]/40 text-[#BE7D32]">
                <Building2 size={25} strokeWidth={1.4} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#10161F]">
                  BEREM
                </p>

                <p className="mt-1 text-xs text-[#647084]">
                  Bâtiment & ingénierie
                </p>
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="lg:pt-10">
            <p className="text-lg font-medium leading-9 text-[#10161F] sm:text-xl sm:leading-10">
              Chaque projet de construction ou de travaux répond à des besoins,
              des objectifs et des contraintes qui lui sont propres.
            </p>

            <p className="mt-7 text-base leading-8 text-[#647084]">
              BEREM accompagne ses clients dans leurs projets en accordant
              une importance particulière à la compréhension de leurs besoins,
              à la préparation des interventions et au suivi des réalisations.
            </p>

            <p className="mt-5 text-base leading-8 text-[#647084]">
              Notre démarche consiste à rechercher des solutions adaptées
              aux attentes de chaque client, tout en veillant à l'organisation
              du travail, à la qualité de l'exécution et au sérieux de
              l'accompagnement.
            </p>

            <div className="mt-10 border-l-2 border-[#D59344] py-2 pl-6">
              <p className="text-base font-semibold leading-7 text-[#10161F]">
                Comprendre le besoin. Organiser les interventions. Suivre
                chaque réalisation.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          MISSION & VISION
      ===================================================== */}
      <section className="bg-[#F3E9DC] px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-9 bg-[#D59344]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                Notre raison d'être
              </p>
            </div>

            <h2 className="mt-7 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
              Ce qui donne
              <br />
              <span className="text-[#BE7D32]">du sens à notre action.</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-0 border-t border-[#10161F]/15 md:grid-cols-2">

            {/* Mission */}
            <article className="border-b border-[#10161F]/15 py-12 md:border-b-0 md:border-r md:pr-14 lg:py-16">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BE7D32]">
                  Notre mission
                </span>

                <Target
                  size={27}
                  strokeWidth={1.4}
                  className="text-[#BE7D32]"
                />
              </div>

              <h3 className="mt-9 max-w-md text-3xl font-black leading-tight sm:text-4xl">
                Donner vie aux projets.
              </h3>

              <p className="mt-7 max-w-lg text-base leading-8 text-[#647084]">
                Comprendre les besoins de nos clients et contribuer à la
                réalisation de leurs projets grâce à une organisation
                rigoureuse, un accompagnement sérieux et une attention
                constante portée à la qualité.
              </p>
            </article>

            {/* Vision */}
            <article className="py-12 md:pl-14 lg:py-16">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BE7D32]">
                  Notre vision
                </span>

                <Eye
                  size={27}
                  strokeWidth={1.4}
                  className="text-[#BE7D32]"
                />
              </div>

              <h3 className="mt-9 max-w-md text-3xl font-black leading-tight sm:text-4xl">
                Bâtir une confiance durable.
              </h3>

              <p className="mt-7 max-w-lg text-base leading-8 text-[#647084]">
                Développer des relations durables avec nos clients et
                partenaires en faisant de la qualité, de la transparence
                et du professionnalisme les fondements de notre travail.
              </p>
            </article>
          </div>
        </div>
      </section>


      {/* =====================================================
          VALEURS - NOS PRINCIPES
      ===================================================== */}
      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-9 bg-[#D59344]" />

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                  Nos principes
                </p>
              </div>

              <h2 className="mt-7 max-w-xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
                Les valeurs qui
                <br />
                <span className="text-[#D59344]">
                  guident notre travail.
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-base leading-8 text-[#647084] lg:justify-self-end">
              Nos valeurs traduisent notre manière de travailler et la relation
              que nous souhaitons construire avec chaque client et partenaire.
            </p>
          </div>

          <div className="mt-16 border-t border-[#EAE1D7]">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.number}
                  className="group grid gap-6 border-b border-[#EAE1D7] py-9 transition-colors duration-300 hover:bg-white/60 sm:grid-cols-[80px_1fr_1fr] sm:items-center sm:gap-10 sm:py-11"
                >
                  <span className="text-3xl font-black tracking-tight text-[#D59344]">
                    {value.number}
                  </span>

                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D59344]/30 text-[#BE7D32] transition-all duration-300 group-hover:border-[#D59344] group-hover:bg-[#D59344] group-hover:text-[#10161F]">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-2xl font-black text-[#10161F] transition-colors group-hover:text-[#BE7D32]">
                      {value.title}
                    </h3>
                  </div>

                  <p className="max-w-lg text-sm leading-7 text-[#647084] sm:text-base">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>


      {/* =====================================================
          CONCLUSION - RÉALISATIONS
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#10161F] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-10">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.08]"
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-9 bg-[#D59344]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D59344]">
                BEREM en action
              </p>
            </div>

            <h2 className="mt-7 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Découvrez comment notre approche
              <span className="text-[#D59344]"> prend forme sur le terrain.</span>
            </h2>
          </div>

          <Link
            href="/realisations"
            className="group inline-flex w-fit items-center gap-5 border border-white/25 px-7 py-5 text-sm font-bold text-white transition-all duration-300 hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F]"
          >
            Découvrir nos réalisations

            <ArrowUpRight
              size={19}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

    </main>
  );
}