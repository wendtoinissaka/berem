export const instant = false;

import type { Metadata } from "next";
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
    <>
      <section className="bg-[#102A43] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
            Sur le terrain
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Nos chantiers en cours
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Découvrez les projets actuellement réalisés par nos équipes,
            consultez les photos des travaux et suivez leur évolution.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">
                Suivi des travaux
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Consultez les chantiers actuellement en cours et leur niveau
                d'avancement.
              </p>
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {projects.length}{" "}
              {projects.length > 1
                ? "chantiers publiés"
                : "chantier publié"}
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <span
                className="text-4xl text-[#F59E0B]"
                aria-hidden="true"
              >
                ▥
              </span>

              <h3 className="mt-5 text-xl font-bold text-[#102A43]">
                Aucun chantier en cours publié
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Les chantiers en cours apparaîtront ici dès qu'ils seront
                publiés par notre équipe. Revenez prochainement pour suivre
                l'évolution de nos travaux.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}