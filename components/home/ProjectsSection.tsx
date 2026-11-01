import Link from "next/link";
import { ArrowUpRight, MoveRight } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getCompletedProjects } from "@/lib/data/projects";

export default async function ProjectsSection() {
  const projects = await getCompletedProjects();
  const featuredProjects = projects.slice(0, 3);

  return (
    <section
      id="realisations"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#D59344]/[0.035] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-8 border-b border-[#EAE1D7] pb-10 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-10 bg-[#D59344]" />
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#BE7D32]">
                  Notre savoir-faire en images
                </p>
              </div>

              <h2 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-[#10161F] sm:text-5xl lg:text-6xl">
                Des idées qui prennent forme.
                <br />
                <span className="text-[#D59344]">Des ouvrages qui durent.</span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-[#647084]">
                Chaque réalisation traduit notre engagement pour la qualité,
                la maîtrise technique et le respect des exigences de nos clients.
              </p>
            </div>

            <Link
              href="/realisations"
              className="group inline-flex shrink-0 items-center gap-3 self-start border-b border-[#D59344] pb-2 text-sm font-bold text-[#10161F] transition-colors hover:text-[#BE7D32] md:self-auto"
            >
              Toutes nos réalisations
              <ArrowUpRight
                size={19}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </ScrollReveal>

        {featuredProjects.length > 0 ? (
          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 130}>
                <div className="h-full transition-transform duration-500 hover:-translate-y-2">
                  <ProjectCard project={project} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <div className="mt-12 border border-dashed border-[#D9D0C5] bg-[#FBF7F1] px-6 py-20 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#BE7D32]">
                Nos réalisations
              </p>

              <h3 className="mt-4 text-2xl font-black text-[#10161F]">
                Nos réalisations arrivent bientôt.
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#647084]">
                Les projets terminés apparaîtront ici dès leur publication
                par notre équipe.
              </p>

              <Link
                href="/realisations"
                className="group mt-7 inline-flex items-center gap-3 font-bold text-[#10161F] transition-colors hover:text-[#BE7D32]"
              >
                Explorer les réalisations
                <MoveRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}