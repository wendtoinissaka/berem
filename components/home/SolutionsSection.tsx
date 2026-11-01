import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  DraftingCompass,
  HardHat,
} from "lucide-react";

import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Étudier",
    subtitle: "Comprendre avant d'agir",
    description:
      "Analyser les besoins, les contraintes et les objectifs afin d'orienter le projet vers des choix techniques adaptés.",
    details: ["Analyse des besoins", "Études techniques", "Conseil"],
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Concevoir",
    subtitle: "Donner forme aux idées",
    description:
      "Préparer les solutions et organiser les interventions pour construire une démarche cohérente avec les exigences du projet.",
    details: ["Conception", "Préparation", "Organisation"],
    icon: DraftingCompass,
  },
  {
    number: "03",
    title: "Réaliser",
    subtitle: "Passer de l'idée au terrain",
    description:
      "Accompagner l'exécution des travaux avec une attention particulière portée à la qualité et au suivi du projet.",
    details: ["Exécution", "Suivi", "Qualité"],
    icon: HardHat,
  },
];

export default function SolutionsSection() {
  return (
    <section
      id="approche"
      className="relative isolate overflow-hidden bg-[#10161F] py-24 text-white sm:py-32"
    >
      <div className="pointer-events-none absolute -right-40 top-0 -z-10 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute -right-20 top-20 -z-10 h-[340px] w-[340px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-1/2 w-1/2 bg-gradient-to-tr from-[#D59344]/[0.07] to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-10 bg-[#D59344]" />
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D59344] sm:text-sm">
                  Notre méthode de travail
                </p>
              </div>

              <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                De la vision
                <br />
                <span className="text-[#D59344]">à la réalisation.</span>
              </h2>
            </div>

            <div className="lg:pb-2">
              <p className="max-w-lg text-base leading-8 text-white/65">
                Chaque projet est différent. Notre approche consiste à
                comprendre vos besoins, préparer les interventions et
                accompagner la réalisation avec méthode et exigence.
              </p>

              <Link
                href="/solutions"
                className="group mt-6 inline-flex items-center gap-3 border-b border-[#D59344]/60 pb-2 text-sm font-bold text-white transition-colors hover:text-[#D59344]"
              >
                Découvrir nos solutions
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <ScrollReveal key={step.number} delay={index * 140}>
                <article className="group relative h-full overflow-hidden border border-white/10 bg-white/[0.035] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#D59344]/50 hover:bg-white/[0.07] sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-[0.2em] text-[#D59344]">
                      ÉTAPE {step.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/[0.04] text-[#D59344] transition-all duration-500 group-hover:rotate-6 group-hover:border-[#D59344]/40 group-hover:bg-[#D59344] group-hover:text-[#10161F]">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                  </div>

                  <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                    {step.subtitle}
                  </p>

                  <h3 className="mt-3 text-3xl font-black tracking-tight transition-colors duration-300 group-hover:text-[#D59344]">
                    {step.title}
                  </h3>

                  <p className="mt-5 min-h-[105px] text-sm leading-7 text-white/60">
                    {step.description}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {step.details.map((detail) => (
                      <span
                        key={detail}
                        className="border border-white/10 px-3 py-2 text-[11px] font-medium text-white/60 transition-colors duration-300 group-hover:border-white/20"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-xs font-medium text-white/35">
                      BEREM — Notre approche
                    </span>

                    <ArrowRight
                      size={18}
                      className="text-[#D59344] transition-transform duration-300 group-hover:translate-x-2"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#D59344] transition-all duration-500 group-hover:w-full" />
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// import Link from "next/link";
// import { connection } from "next/server";

// import { prisma } from "@/lib/prisma";

// export default async function SolutionsSection() {
//   await connection();

//   const solutions = await prisma.solution.findMany({
//     where: {
//       status: "PUBLISHED",
//       isFeatured: true,
//     },
//     orderBy: [
//       { sortOrder: "asc" },
//       { publishedAt: "desc" },
//     ],
//     take: 3,
//     select: {
//       id: true,
//       name: true,
//       slug: true,
//       summary: true,
//       logoUrl: true,
//       coverImageUrl: true,
//       actionLabel: true,
//     },
//   });

//   if (solutions.length === 0) {
//     return null;
//   }

//   return (
//     <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
//       <div className="mx-auto max-w-7xl">
//         {/* En-tête */}
//         <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
//           <div className="max-w-2xl">
//             <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#F59E0B]">
//               Nos solutions
//             </p>

//             <h2 className="mt-3 text-3xl font-black leading-tight text-[#102A43] sm:text-4xl">
//               Des solutions adaptées à vos ambitions
//             </h2>

//             <p className="mt-5 leading-8 text-slate-600">
//               Découvrez les solutions proposées par BEREM pour répondre à vos
//               besoins et accompagner vos projets.
//             </p>
//           </div>

//           <Link
//             href="/solutions"
//             className="inline-flex w-fit items-center gap-2 font-bold text-[#102A43] transition hover:text-[#F59E0B]"
//           >
//             Toutes nos solutions
//             <span aria-hidden="true">→</span>
//           </Link>
//         </div>

//         {/* Cartes des solutions */}
//         <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
//           {solutions.map((solution) => (
//             <article
//               key={solution.id}
//               className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
//             >
//               <Link
//                 href={`/solutions/${solution.slug}`}
//                 className="block"
//                 aria-label={`Découvrir ${solution.name}`}
//               >
//                 <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-100">
//                   {solution.coverImageUrl ? (
//                     <img
//                       src={solution.coverImageUrl}
//                       alt={`Présentation de ${solution.name}`}
//                       loading="lazy"
//                       className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//                     />
//                   ) : solution.logoUrl ? (
//                     <img
//                       src={solution.logoUrl}
//                       alt={`Logo de ${solution.name}`}
//                       className="max-h-32 max-w-[70%] object-contain"
//                     />
//                   ) : (
//                     <span className="text-5xl font-black text-[#102A43]">
//                       {solution.name.charAt(0).toUpperCase()}
//                     </span>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   {solution.logoUrl && solution.coverImageUrl && (
//                     <img
//                       src={solution.logoUrl}
//                       alt=""
//                       loading="lazy"
//                       className="mb-4 h-10 max-w-28 object-contain object-left"
//                     />
//                   )}

//                   <h3 className="text-xl font-black text-[#102A43] transition group-hover:text-[#F59E0B]">
//                     {solution.name}
//                   </h3>

//                   <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
//                     {solution.summary}
//                   </p>

//                   <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#102A43]">
//                     {solution.actionLabel || "Découvrir la solution"}
//                     <span
//                       aria-hidden="true"
//                       className="transition-transform group-hover:translate-x-1"
//                     >
//                       →
//                     </span>
//                   </span>
//                 </div>
//               </Link>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }