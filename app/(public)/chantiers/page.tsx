export const instant = false;

import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Construction, HardHat } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import { getOngoingProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Nos chantiers en cours",
  description:
    "Suivez les chantiers en cours de BEREM, découvrez les travaux réalisés et consultez leur progression.",
};

export default async function ChantiersPage() {
  const projects = await getOngoingProjects();

  return (
    <main className="bg-[#FBF7F1]">
      {/* HERO — CHANTIERS EN COURS */}
      <section className="relative isolate overflow-hidden bg-[#10161F] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/[0.06]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-20 h-56 w-56 rounded-full border border-[#D59344]/15"
        />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-12 sm:px-8 sm:py-14 lg:flex-row lg:items-end lg:px-10 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[3px] w-8 bg-[#D59344]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D59344]">
                Sur le terrain
              </p>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Nos chantiers en cours
              <span className="text-[#D59344]">.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Suivez l'évolution de nos projets et découvrez les travaux
              réalisés par nos équipes sur le terrain.
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-5 lg:min-w-[220px] lg:justify-end lg:border-l lg:border-t-0 lg:pb-1 lg:pl-7 lg:pt-0">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                Suivi des travaux
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#D59344]">
                  {String(projects.length).padStart(2, "0")}
                </span>

                <span className="text-xs text-white/50">
                  {projects.length > 1
                    ? "chantiers publiés"
                    : "chantier publié"}
                </span>
              </div>
            </div>

            <a
              href="#chantiers"
              aria-label="Découvrir les chantiers"
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-white/70 transition hover:border-[#D59344] hover:text-[#D59344]"
            >
              <ArrowDown size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* LISTE DES CHANTIERS */}
      <section
        id="chantiers"
        className="scroll-mt-20 px-5 pb-24 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pb-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-8 bg-[#D59344]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BE7D32]">
                  Activité sur le terrain
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#172033] sm:text-4xl">
                Suivi des travaux
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#647084]">
                Consultez les projets en cours, leurs photos et les dernières
                informations concernant leur avancement.
              </p>
            </div>

            <div className="flex items-center gap-3 border-l-2 border-[#D59344] pl-4">
              <span className="text-3xl font-extrabold text-[#172033]">
                {String(projects.length).padStart(2, "0")}
              </span>

              <span className="max-w-[100px] text-xs leading-5 text-[#647084]">
                {projects.length > 1
                  ? "chantiers en cours"
                  : "chantier en cours"}
              </span>
            </div>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden border border-[#EAE1D7] bg-white px-6 py-16 text-center sm:px-12">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-[#D59344]"
              />

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E9DC] text-[#BE7D32]">
                <Construction size={29} strokeWidth={1.5} />
              </div>

              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                Suivi des chantiers
              </p>

              <h3 className="mt-3 text-2xl font-extrabold text-[#172033]">
                Aucun chantier en cours publié.
              </h3>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#647084]">
                Les chantiers actuellement suivis par nos équipes apparaîtront
                ici dès leur publication. Revenez prochainement pour découvrir
                leur évolution.
              </p>

              <a
                href="/contact"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#172033] transition hover:text-[#BE7D32]"
              >
                Contacter notre équipe
                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}