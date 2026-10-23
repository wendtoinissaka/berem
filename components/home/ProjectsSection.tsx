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

// import Link from "next/link";

// const projects = [
//   {
//     title: "Projet de construction",
//     category: "Construction",
//     location: "Localisation à préciser",
//     image:
//       "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
//   },
//   {
//     title: "Infrastructure en développement",
//     category: "Génie civil",
//     location: "Localisation à préciser",
//     image:
//       "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=85",
//   },
//   {
//     title: "Projet d'aménagement",
//     category: "Travaux publics",
//     location: "Localisation à préciser",
//     image:
//       "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=85",
//   },
// ];

// export default function ProjectsSection() {
//   return (
//     <section className="bg-slate-50 py-24 sm:py-28">
//       <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
//         <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
//           <div className="max-w-2xl">
//             <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
//               Nos réalisations
//             </p>

//             <h2 className="mt-4 text-3xl font-black tracking-tight text-[#102A43] sm:text-4xl lg:text-5xl">
//               Le savoir-faire se démontre sur le terrain.
//             </h2>

//             <p className="mt-5 max-w-xl leading-8 text-slate-600">
//               Une sélection de projets illustrant les domaines
//               d&apos;intervention et les compétences de l&apos;entreprise.
//             </p>
//           </div>

//           <Link
//             href="/realisations"
//             className="inline-flex items-center gap-3 self-start font-bold text-[#102A43] hover:text-amber-600 md:self-auto"
//           >
//             Voir les réalisations <span aria-hidden="true">→</span>
//           </Link>
//         </div>

//         <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
//           {projects.map((project, index) => (
//             <article
//               key={project.title}
//               className="group overflow-hidden border border-slate-200 bg-white"
//             >
//               <div className="relative h-64 overflow-hidden bg-slate-200">
//                 {/* Images de démonstration ; à remplacer par les vrais projets. */}
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img
//                   src={project.image}
//                   alt={`Illustration de démonstration : ${project.category}`}
//                   className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
//                   loading="lazy"
//                 />

//                 <span className="absolute left-5 top-5 bg-[#F59E0B] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#102A43]">
//                   {project.category}
//                 </span>
//               </div>

//               <div className="p-6">
//                 <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//                   {project.location}
//                 </p>

//                 <h3 className="mt-3 text-xl font-extrabold text-[#102A43]">
//                   {project.title}
//                 </h3>

//                 <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
//                   <span className="text-sm text-slate-500">
//                     Présentation du projet
//                   </span>

//                   <span
//                     className="text-xl text-amber-600"
//                     aria-hidden="true"
//                   >
//                     ↗
//                   </span>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>

//         <div className="mt-8 border-l-4 border-amber-500 bg-white px-5 py-4 text-sm leading-6 text-slate-600">
//           Ces cartes sont des exemples visuels, pas des références réelles de
//           BEREM. Elles ne doivent pas être présentées comme des réalisations
//           effectivement exécutées par l&apos;entreprise.
//         </div>
//       </div>
//     </section>
//   );
// }