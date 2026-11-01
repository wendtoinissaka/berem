import Link from "next/link";
import {
  ArrowUpRight,
  Construction,
  HardHat,
  MoveRight,
} from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getOngoingProjects } from "@/lib/data/projects";

export default async function ChantiersSection() {
  const projects = await getOngoingProjects();
  const featuredProjects = projects.slice(0, 3);

  return (
    <section
      id="chantiers"
      className="relative overflow-hidden bg-[#F3E9DC] py-20 text-[#172033] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* EN-TÊTE */}
        <ScrollReveal>
          <div className="flex flex-col gap-8 border-b border-[#172033]/15 pb-9 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-[2px] w-9 bg-[#D59344]" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                  Nos chantiers
                </p>
              </div>

              <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
                Le terrain,
                <br className="hidden sm:block" />
                <span className="text-[#BE7D32]">
                  preuve de notre engagement.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#647084]">
                Découvrez les projets actuellement réalisés par BEREM et
                suivez concrètement l'évolution de nos travaux.
              </p>
            </div>

            <Link
              href="/chantiers"
              className="group inline-flex min-h-12 shrink-0 items-center gap-4 border border-[#172033]/25 px-5 text-sm font-bold text-[#172033] transition-all duration-300 hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F]"
            >
              Tous nos chantiers
              <ArrowUpRight
                size={18}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </ScrollReveal>

        {/* LISTE DES CHANTIERS */}
        {featuredProjects.length > 0 ? (
          <>
            <div className="mb-7 mt-9 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Construction size={19} className="text-[#BE7D32]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#172033]">
                  En cours de réalisation
                </h3>
              </div>

              <span className="text-xs font-semibold text-[#647084]">
                {String(featuredProjects.length).padStart(2, "0")} projet
                {featuredProjects.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 120}>
                  <div className="h-full transition-transform duration-500 hover:-translate-y-1.5">
                    <ProjectCard project={project} />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* PIED DE SECTION */}
            <ScrollReveal delay={150}>
              <div className="mt-10 flex flex-col gap-4 border-t border-[#172033]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#647084]">
                  Chaque projet reflète notre engagement sur le terrain.
                </p>

                <Link
                  href="/chantiers"
                  className="group inline-flex items-center gap-3 text-sm font-bold text-[#172033] transition-colors hover:text-[#BE7D32]"
                >
                  Découvrir tous les projets
                  <MoveRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </ScrollReveal>
          </>
        ) : (
          /* ÉTAT VIDE */
          <ScrollReveal>
            <div className="mt-10 flex flex-col items-center border border-[#172033]/10 bg-white/50 px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center border border-[#D59344]/40 bg-[#D59344]/10 text-[#BE7D32]">
                <HardHat size={27} strokeWidth={1.6} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#172033]">
                De nouveaux chantiers bientôt présentés.
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#647084]">
                Les projets apparaîtront ici dès leur publication par notre
                équipe.
              </p>

              <Link
                href="/chantiers"
                className="group mt-6 inline-flex items-center gap-3 text-sm font-bold text-[#BE7D32] transition-colors hover:text-[#172033]"
              >
                Consulter l'espace chantiers
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
}

// import Link from "next/link";

// import ProjectCard from "@/components/projects/ProjectCard";
// import { getOngoingProjects } from "@/lib/data/projects";

// export default async function ChantiersSection() {
//   const projects = await getOngoingProjects();
//   const featuredProjects = projects.slice(0, 3);

//   return (
//     <section className="bg-white py-24 sm:py-28">
//       <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
//         <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
//           <div className="max-w-2xl">
//             <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
//               Sur le terrain
//             </p>

//             <h2 className="mt-4 text-3xl font-black tracking-tight text-[#102A43] sm:text-4xl lg:text-5xl">
//               Nos chantiers prennent forme.
//             </h2>

//             <p className="mt-5 max-w-xl leading-8 text-slate-600">
//               Suivez nos travaux en cours, découvrez les dernières photos
//               publiées et consultez l'évolution de nos chantiers.
//             </p>
//           </div>

//           <Link
//             href="/chantiers"
//             className="inline-flex items-center gap-3 self-start font-bold text-[#102A43] transition hover:text-amber-600 md:self-auto"
//           >
//             Tous les chantiers
//             <span aria-hidden="true">→</span>
//           </Link>
//         </div>

//         {featuredProjects.length > 0 ? (
//           <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
//             {featuredProjects.map((project) => (
//               <ProjectCard key={project.id} project={project} />
//             ))}
//           </div>
//         ) : (
//           <div className="mt-14 border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
//             <h3 className="text-xl font-bold text-[#102A43]">
//               Aucun chantier en cours à présenter
//             </h3>

//             <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
//               Les chantiers apparaîtront ici dès qu'ils seront publiés comme
//               étant en cours par notre équipe.
//             </p>

//             <Link
//               href="/chantiers"
//               className="mt-6 inline-flex items-center gap-2 font-bold text-[#102A43] transition hover:text-amber-600"
//             >
//               Consulter nos chantiers
//               <span aria-hidden="true">→</span>
//             </Link>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }