import Link from "next/link";

import ProjectCard from "@/components/projects/ProjectCard";
import { getPublishedProjects } from "@/lib/data/projects";

export default async function ProjectsSection() {
  const projects = await getPublishedProjects();
  const featuredProjects = projects.slice(0, 3);

  return (
    <section className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Nos réalisations
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#102A43] sm:text-4xl lg:text-5xl">
              Le savoir-faire se démontre sur le terrain.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              Découvrez les projets publiés par notre équipe et les
              compétences mobilisées pour leur réalisation.
            </p>
          </div>

          <Link
            href="/realisations"
            className="inline-flex items-center gap-3 self-start font-bold text-[#102A43] transition hover:text-amber-600 md:self-auto"
          >
            Toutes les réalisations <span aria-hidden="true">→</span>
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-14 border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="text-xl font-bold text-[#102A43]">
              Nos réalisations arrivent bientôt
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Les projets apparaîtront ici dès qu&apos;ils auront été ajoutés
              et publiés par l&apos;équipe.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
