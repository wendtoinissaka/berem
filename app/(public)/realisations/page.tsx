export const instant = false;

import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, HardHat, Layers3 } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import { getCompletedProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description:
    "Découvrez les projets achevés par BEREM dans le domaine du génie civil et de la construction.",
};

export default async function RealisationsPage() {
  const projects = await getCompletedProjects();

  return (
    <main className="bg-[#FBF7F1]">
      
{/* HERO - NOS RÉALISATIONS */}
<section className="relative isolate overflow-hidden bg-[#10161F] text-white">
  {/* Décor discret */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/[0.06]"
  />
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-8 -top-20 h-56 w-56 rounded-full border border-[#D59344]/15"
  />

  <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-12 sm:px-8 sm:py-14 lg:flex-row lg:items-end lg:px-10 lg:py-16">

    {/* Titre et présentation */}
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-[3px] w-8 bg-[#D59344]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D59344]">
          Notre savoir-faire en action
        </p>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
        Nos réalisations<span className="text-[#D59344]">.</span>
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
        Découvrez les ouvrages réalisés par BEREM, témoins de notre
        expertise en génie civil et construction.
      </p>
    </div>

    {/* Compteur et accès aux projets */}
    <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-5 lg:min-w-[220px] lg:justify-end lg:border-l lg:border-t-0 lg:pb-1 lg:pl-7 lg:pt-0">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
          Portfolio
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-[#D59344]">
            {String(projects.length).padStart(2, "0")}
          </span>
          <span className="text-xs text-white/50">
            {projects.length > 1 ? "projets publiés" : "projet publié"}
          </span>
        </div>
      </div>

      <a
        href="#projets"
        aria-label="Découvrir les projets"
        className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-white/70 transition hover:border-[#D59344] hover:text-[#D59344]"
      >
        <ArrowDown size={17} />
      </a>
    </div>
  </div>
</section>

      {/* INTRODUCTION */}
      <section className="px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 border-b border-[#EAE1D7] pb-12 md:grid-cols-[1fr_1fr] md:items-end lg:pb-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
              Notre parcours
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-[#172033] sm:text-4xl">
              Le savoir-faire se mesure à travers les ouvrages réalisés.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-8 text-[#647084] md:justify-self-end md:text-base">
            Au-delà des plans et des études, ce sont les réalisations qui
            témoignent de notre expertise. Chaque projet achevé représente
            un engagement tenu et une contribution concrète au développement
            des infrastructures.
          </p>
        </div>
      </section>

      {/* PROJETS */}
      <section
        id="projets"
        className="scroll-mt-20 px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-8 bg-[#D59344]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BE7D32]">
                  Portfolio BEREM
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#172033] sm:text-4xl">
                Projets achevés
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#647084]">
                Découvrez quelques témoignages concrets de notre expertise.
              </p>
            </div>

            <div className="flex items-center gap-3 border-l-2 border-[#D59344] pl-4">
              <span className="text-3xl font-extrabold text-[#172033]">
                {String(projects.length).padStart(2, "0")}
              </span>
              <span className="max-w-[100px] text-xs leading-5 text-[#647084]">
                {projects.length > 1
                  ? "réalisations publiées"
                  : "réalisation publiée"}
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
            <div className="relative overflow-hidden border border-[#EAE1D7] bg-white px-6 py-20 text-center sm:px-12">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-[#D59344]"
              />

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E9DC] text-[#BE7D32]">
                <HardHat size={29} strokeWidth={1.5} />
              </div>

              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                Portfolio en préparation
              </p>

              <h3 className="mt-3 text-2xl font-extrabold text-[#172033]">
                Nos réalisations arrivent bientôt.
              </h3>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#647084]">
                Les projets achevés et publiés apparaîtront prochainement
                dans cet espace. Notre équipe reste à votre disposition
                pour vous présenter son savoir-faire.
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
// export const instant = false;

// import type { Metadata } from "next";

// import ProjectCard from "@/components/projects/ProjectCard";
// import { getPublishedProjects } from "@/lib/data/projects";

// export const metadata: Metadata = {
//   title: "Nos réalisations",
//   description:
//     "Découvrez les projets et réalisations de BEREM dans le domaine du génie civil et de la construction.",
// };

// export default async function RealisationsPage() {
//   const projects = await getPublishedProjects();

//   return (
//     <>
//       <section className="bg-[#102A43] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
//         <div className="mx-auto max-w-7xl">
//           <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
//             Notre savoir-faire
//           </p>

//           <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
//             Nos réalisations
//           </h1>

//           <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
//             Découvrez les projets présentés par notre équipe et les
//             compétences mobilisées pour répondre aux besoins de nos clients.
//           </p>
//         </div>
//       </section>

//       <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">
//                 Projets et réalisations
//               </h2>

//               <p className="mt-2 text-sm text-slate-600">
//                 Des projets sélectionnés pour illustrer notre expertise.
//               </p>
//             </div>

//             <p className="text-sm font-semibold text-slate-500">
//               {projects.length}{" "}
//               {projects.length > 1 ? "projets publiés" : "projet publié"}
//             </p>
//           </div>

//           {projects.length > 0 ? (
//             <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
//               {projects.map((project) => (
//                 <ProjectCard key={project.id} project={project} />
//               ))}
//             </div>
//           ) : (
//             <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
//               <span className="text-4xl text-[#F59E0B]" aria-hidden="true">
//                 ▥
//               </span>

//               <h3 className="mt-5 text-xl font-bold text-[#102A43]">
//                 Nos réalisations seront bientôt disponibles
//               </h3>

//               <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
//                 Cette rubrique présentera les projets publiés par notre
//                 équipe. Revenez prochainement pour découvrir nos réalisations.
//               </p>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// }


// export const instant = false;

// import type { Metadata } from "next";

// import ProjectCard from "@/components/projects/ProjectCard";
// import { getPublishedProjects } from "@/lib/data/projects";

// export const metadata: Metadata = {
//   title: "Nos réalisations",
//   description:
//     "Découvrez les projets et réalisations de BEREM dans le domaine du génie civil et de la construction.",
// };

// export default async function RealisationsPage() {
//   const projects = await getPublishedProjects();

//   return (
//     <>
//       <section className="bg-[#102A43] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
//         <div className="mx-auto max-w-7xl">
//           <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
//             Notre savoir-faire
//           </p>

//           <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
//             Nos réalisations
//           </h1>

//           <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
//             Découvrez les projets présentés par notre équipe et les
//             compétences mobilisées pour répondre aux besoins de nos clients.
//           </p>
//         </div>
//       </section>

//       <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">
//                 Projets et réalisations
//               </h2>

//               <p className="mt-2 text-sm text-slate-600">
//                 Des projets sélectionnés pour illustrer notre expertise.
//               </p>
//             </div>

//             <p className="text-sm font-semibold text-slate-500">
//               {projects.length}{" "}
//               {projects.length > 1 ? "projets publiés" : "projet publié"}
//             </p>
//           </div>

//           {projects.length > 0 ? (
//             <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
//               {projects.map((project) => (
//                 <ProjectCard key={project.id} project={project} />
//               ))}
//             </div>
//           ) : (
//             <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
//               <span className="text-4xl text-[#F59E0B]" aria-hidden="true">
//                 ▥
//               </span>

//               <h3 className="mt-5 text-xl font-bold text-[#102A43]">
//                 Nos réalisations seront bientôt disponibles
//               </h3>

//               <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
//                 Cette rubrique présentera les projets publiés par notre
//                 équipe. Revenez prochainement pour découvrir nos réalisations.
//               </p>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// }