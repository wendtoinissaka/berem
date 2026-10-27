import Link from "next/link";

import ProjectCard from "@/components/projects/ProjectCard";
import { getOngoingProjects } from "@/lib/data/projects";

export default async function ChantiersSection() {
  const projects = await getOngoingProjects();
  const featuredProjects = projects.slice(0, 3);

  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Sur le terrain
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#102A43] sm:text-4xl lg:text-5xl">
              Nos chantiers prennent forme.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              Suivez nos travaux en cours, découvrez les dernières photos
              publiées et consultez l'évolution de nos chantiers.
            </p>
          </div>

          <Link
            href="/chantiers"
            className="inline-flex items-center gap-3 self-start font-bold text-[#102A43] transition hover:text-amber-600 md:self-auto"
          >
            Tous les chantiers
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-14 border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <h3 className="text-xl font-bold text-[#102A43]">
              Aucun chantier en cours à présenter
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Les chantiers apparaîtront ici dès qu'ils seront publiés comme
              étant en cours par notre équipe.
            </p>

            <Link
              href="/chantiers"
              className="mt-6 inline-flex items-center gap-2 font-bold text-[#102A43] transition hover:text-amber-600"
            >
              Consulter nos chantiers
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}