export const instant = false;

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Compass,
  Eye,
  Handshake,
  HardHat,
  House,
  Layers3,
  MapPin,
  MonitorPlay,
  ShieldCheck,
  Target,
  Wallet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Notre entreprise | BEREM",
  description:
    "Fondée en 2019 au Burkina Faso, BEREM accompagne les particuliers et investisseurs dans leurs projets de construction, génie civil, design intérieur et aménagement.",
};

const expertise = [
  {
    number: "01",
    title: "Études techniques et architecturales",
    description:
      "Préparer chaque projet avec une réflexion technique et architecturale adaptée à ses objectifs et à ses contraintes.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Construction clé en main",
    description:
      "Accompagner la réalisation des projets de construction, de la préparation des travaux jusqu'à la livraison.",
    icon: Building2,
  },
  {
    number: "03",
    title: "Suivi de chantier",
    description:
      "Assurer un suivi attentif de l'évolution des travaux et permettre aux clients de rester informés.",
    icon: HardHat,
  },
  {
    number: "04",
    title: "Design et aménagement intérieur",
    description:
      "Concevoir et aménager des espaces fonctionnels, harmonieux et adaptés aux usages de leurs occupants.",
    icon: Layers3,
  },
  {
    number: "05",
    title: "Vente de villas",
    description:
      "Proposer des opportunités immobilières aux particuliers et investisseurs à la recherche de biens adaptés à leurs besoins.",
    icon: House,
  },
];

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
          HERO
      ===================================================== */}
      <section className="relative isolate overflow-hidden bg-[#10161F] text-white">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
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

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24">

          {/* Fil d'Ariane */}
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            <Link href="/" className="transition-colors hover:text-[#D59344]">
              Accueil
            </Link>

            <span className="h-1 w-1 rounded-full bg-[#D59344]" />

            <span className="text-[#D59344]">L'entreprise</span>
          </div>

          <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_0.55fr] lg:items-end lg:gap-16">

            <div>
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-9 bg-[#D59344]" />

                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D59344]">
                  BEREM · Depuis 2019
                </span>
              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-6xl xl:text-[72px]">
                Concevoir.
                <br />
                <span className="text-[#D59344]">Construire.</span>
                <br />
                Faire durer.
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-8 text-white/60 sm:text-base">
                Depuis 2019, BEREM accompagne les particuliers et les
                investisseurs dans leurs projets immobiliers et de
                construction au Burkina Faso.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="#presentation"
                  className="group inline-flex items-center gap-3 bg-[#D59344] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#BE7D32]"
                >
                  Découvrir BEREM
                  <ArrowDown
                    size={17}
                    className="transition-transform group-hover:translate-y-1"
                  />
                </Link>

                <Link
                  href="/realisations"
                  className="inline-flex items-center gap-3 border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:border-white/60"
                >
                  Nos réalisations
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            {/* Bloc latéral */}
            <div className="relative border-l border-white/15 pl-7 lg:mb-2 lg:pl-9">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                Notre identité
              </span>

              <p className="mt-5 text-xl font-semibold leading-snug sm:text-2xl">
                Une entreprise qui réunit les compétences nécessaires pour
                donner vie à vos projets immobiliers.
              </p>

              <div className="mt-9 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D59344]/30 text-[#D59344]">
                  <Building2 size={22} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-sm font-bold">BEREM</p>
                  <p className="mt-1 text-xs text-white/45">
                    Bâtiment & ingénierie
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Signature */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35 sm:text-[10px]">
              Bâtiment · Génie civil · Immobilier
            </span>

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35 sm:text-[10px]">
              Burkina Faso
            </span>
          </div>
        </div>
      </section>


      {/* =====================================================
          PRÉSENTATION
      ===================================================== */}
      <section
        id="presentation"
        className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-24">

          {/* Colonne gauche */}
          <div>
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-9 bg-[#D59344]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                Qui sommes-nous ?
              </p>
            </div>

            <h2 className="mt-7 max-w-xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
              Bâtir des espaces
              <br />
              <span className="text-[#D59344]">qui ont du sens.</span>
            </h2>

            <div className="mt-10 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D59344]/40 text-[#BE7D32]">
                <Building2 size={27} strokeWidth={1.4} />
              </div>

              <div>
                <p className="text-3xl font-black tracking-tight text-[#10161F]">
                  2019
                </p>

                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#647084]">
                  Année de fondation
                </p>
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="lg:pt-2">
            <p className="text-lg font-medium leading-9 text-[#10161F] sm:text-xl sm:leading-10">
              BEREM est une entreprise spécialisée dans la construction,
              le génie civil, le design intérieur et l'aménagement d'espaces
              au Burkina Faso.
            </p>

            <p className="mt-6 text-base leading-8 text-[#647084]">
              Fondée en 2019, elle accompagne les particuliers et les
              investisseurs dans la réalisation de projets immobiliers
              adaptés à leurs besoins, à leur budget et aux réalités locales.
            </p>

            <p className="mt-5 text-base leading-8 text-[#647084]">
              De la conception à la livraison, BEREM propose un accompagnement
              couvrant les études techniques et architecturales, le suivi de
              chantier, la construction clé en main, l'aménagement intérieur
              et la vente de villas.
            </p>

            <p className="mt-5 text-base leading-8 text-[#647084]">
              Chaque projet est pensé pour conjuguer fonctionnalité,
              esthétique et durabilité, avec une attention particulière
              accordée à la qualité d'exécution.
            </p>

            <div className="mt-9 border-l-2 border-[#D59344] py-2 pl-6">
              <p className="text-base font-semibold leading-7 text-[#10161F]">
                De la première réflexion jusqu'à la concrétisation, nous
                faisons de chaque projet un engagement.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          DOMAINES D'EXPERTISE
      ===================================================== */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-9 bg-[#D59344]" />

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                  Nos domaines d'intervention
                </p>
              </div>

              <h2 className="mt-7 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
                Des compétences
                <br />
                <span className="text-[#D59344]">à chaque étape.</span>
              </h2>
            </div>

            <p className="max-w-xl text-base leading-8 text-[#647084] lg:justify-self-end">
              BEREM rassemble plusieurs domaines de compétences pour
              accompagner ses clients dans les différentes dimensions
              de leurs projets immobiliers.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden border border-[#EAE1D7] bg-[#EAE1D7] sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  className="group flex min-h-[260px] flex-col bg-white p-7 transition-colors duration-300 hover:bg-[#FBF7F1] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#BE7D32]">
                      {item.number}
                    </span>

                    <Icon
                      size={23}
                      strokeWidth={1.5}
                      className="text-[#BE7D32] transition-transform duration-300 group-hover:-translate-y-1"
                    />
                  </div>

                  <h3 className="mt-9 max-w-xs text-xl font-bold leading-snug text-[#172033]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#78818E]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

        </div>
      </section>


      {/* =====================================================
          MZAKA - SUIVI À DISTANCE
      ===================================================== */}
      <section className="relative isolate overflow-hidden bg-[#10161F] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-white/[0.06]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-10 h-[400px] w-[400px] rounded-full border border-[#D59344]/15"
        />

        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-20">

          {/* Texte */}
          <div>
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-9 bg-[#D59344]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D59344]">
                Une autre façon de suivre son chantier
              </p>
            </div>

            <h2 className="mt-7 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
              Votre chantier.
              <br />
              <span className="text-[#D59344]">Où que vous soyez.</span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/60">
              Pour permettre à ses clients de suivre leurs travaux à distance,
              BEREM intègre MZAKA, une solution qui facilite l'accès aux
              informations relatives à l'avancement du chantier.
            </p>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
              Les clients peuvent consulter les photos, les vidéos et
              l'historique d'avancement des travaux. Un moyen de rester
              informé de l'évolution de son projet, même à des milliers
              de kilomètres.
            </p>

            <div className="mt-8 border-l-2 border-[#D59344] py-2 pl-6">
              <p className="text-base font-semibold leading-7 text-white">
                Une solution particulièrement utile pour les membres de
                la diaspora qui souhaitent construire au Burkina Faso.
              </p>
            </div>

            <Link
              href="/chantiers"
              className="group mt-9 inline-flex items-center gap-3 bg-[#D59344] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#BE7D32]"
            >
              Découvrir le suivi de chantier
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Bloc de présentation MZAKA */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#172331] p-6 sm:p-8">

              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D59344]">
                    Suivi de chantier
                  </p>

                  <h3 className="mt-2 text-2xl font-black tracking-tight">
                    MZAKA
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D59344]/25 bg-[#D59344]/10 text-[#D59344]">
                  <MonitorPlay size={23} strokeWidth={1.5} />
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-white/55">
                Les informations essentielles de votre chantier accessibles
                à distance.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  {
                    title: "Photos du chantier",
                    description: "Consulter les images des travaux réalisés.",
                    icon: Eye,
                  },
                  {
                    title: "Vidéos",
                    description: "Visualiser l'évolution des interventions.",
                    icon: MonitorPlay,
                  },
                  {
                    title: "Historique d'avancement",
                    description: "Retrouver les différentes étapes du projet.",
                    icon: ClipboardListIcon,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.035] p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D59344]/10 text-[#D59344]">
                        <Icon size={19} strokeWidth={1.6} />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-xs leading-6 text-white/45">
                          {item.description}
                        </p>
                      </div>

                      <CheckCircle2
                        size={16}
                        className="ml-auto mt-1 shrink-0 text-[#D59344]"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                  BEREM · MZAKA
                </span>

                <span className="flex items-center gap-2 text-xs font-semibold text-[#D59344]">
                  Suivi à distance
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 -z-10 h-32 w-32 rounded-full bg-[#D59344]/10 blur-3xl"
            />
          </div>

        </div>
      </section>


      {/* =====================================================
          MISSION & VISION
      ===================================================== */}
      <section className="bg-[#F3E9DC] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
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
                Accompagner les particuliers et les investisseurs dans
                la réalisation de leurs projets immobiliers en proposant
                des solutions adaptées à leurs besoins, à leur budget
                et aux réalités locales.
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
                Contribuer à la construction d'espaces modernes, durables
                et accessibles, tout en développant des relations de
                confiance avec nos clients et partenaires.
              </p>
            </article>

          </div>
        </div>
      </section>


      {/* =====================================================
          VALEURS
      ===================================================== */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
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
              Nos valeurs traduisent notre manière de travailler et la
              relation que nous souhaitons construire avec chaque client
              et partenaire.
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
          AMBITION
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#10161F] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.08]"
        />

        <div className="relative mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">

            <div>
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-9 bg-[#D59344]" />

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D59344]">
                  Notre ambition
                </p>
              </div>

              <h2 className="mt-7 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Bâtir des espaces modernes, durables et accessibles.
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/55">
                Offrir aux familles et aux investisseurs un accompagnement
                de proximité à chaque étape de leur projet, de la conception
                à la livraison.
              </p>
            </div>

            <div className="border-l border-white/15 pl-7 lg:pl-9">
              <div className="flex items-center gap-3 text-[#D59344]">
                <MapPin size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Notre engagement
                </span>
              </div>

              <p className="mt-5 text-xl font-semibold leading-snug sm:text-2xl">
                Être un partenaire de confiance pour concrétiser vos projets
                au Burkina Faso.
              </p>

              <Link
                href="/devis"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#D59344] transition-colors hover:text-white"
              >
                Parlons de votre projet
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

          </div>

          <div className="mt-16 border-t border-white/15 pt-7">
            <div className="grid gap-6 sm:grid-cols-3">

              <div className="flex items-center gap-3">
                <Wallet size={19} className="text-[#D59344]" />
                <span className="text-xs font-medium text-white/55">
                  Des projets adaptés aux budgets
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={19} className="text-[#D59344]" />
                <span className="text-xs font-medium text-white/55">
                  Une attention portée à la qualité
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Handshake size={19} className="text-[#D59344]" />
                <span className="text-xs font-medium text-white/55">
                  Un accompagnement de proximité
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          RÉALISATIONS
      ===================================================== */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

          <div>
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-9 bg-[#D59344]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                BEREM en action
              </p>
            </div>

            <h2 className="mt-7 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Nos projets prennent forme
              <span className="text-[#D59344]"> sur le terrain.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#647084] sm:text-base">
              Découvrez quelques réalisations et interventions qui illustrent
              notre savoir-faire dans les domaines du bâtiment et de la
              construction.
            </p>
          </div>

          <Link
            href="/realisations"
            className="group inline-flex w-fit items-center gap-5 border border-[#10161F]/20 px-7 py-5 text-sm font-bold text-[#10161F] transition-all duration-300 hover:border-[#D59344] hover:bg-[#D59344] hover:text-white"
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

function ClipboardListIcon(props: React.ComponentProps<typeof MonitorPlay>) {
  return <MonitorPlay {...props} />;
}