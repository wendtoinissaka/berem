export const instant = false;

import type { Metadata } from "next";
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
    <>
      <section className="bg-[#102A43] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
            Notre savoir-faire
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Nos réalisations
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Découvrez les ouvrages achevés par BEREM et les compétences
            mobilisées pour concrétiser les projets de nos clients.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">
                Projets achevés
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Des réalisations qui témoignent de notre expertise.
              </p>
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {projects.length}{" "}
              {projects.length > 1
                ? "réalisations publiées"
                : "réalisation publiée"}
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
                Nos réalisations seront bientôt disponibles
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Les projets achevés et publiés apparaîtront ici. En attendant,
                contactez notre équipe pour en savoir plus sur notre savoir-faire.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
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