import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";

import { prisma } from "@/lib/prisma";

const MAX_SOLUTIONS = 3;

export default async function HomeSolutionsSection() {
  const solutions = await prisma.solution.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [
      { isFeatured: "desc" },
      { sortOrder: "asc" },
      { publishedAt: "desc" },
    ],
    take: MAX_SOLUTIONS,
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      logoUrl: true,
      coverImageUrl: true,
      isFeatured: true,
    },
  });

  if (solutions.length === 0) return null;

  return (
    <section
      id="nos-solutions"
      aria-labelledby="home-solutions-title"
      className="relative overflow-hidden border-t border-[#EAE1D7] bg-[#FBF7F1] py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-10 h-[520px] w-[520px] rounded-full border border-[#D59344]/10"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* EN-TÊTE */}
        <div className="flex flex-col gap-6 border-b border-[#EAE1D7] pb-8 sm:pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#D59344]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#BE7D32] sm:text-xs">
                L'expertise BEREM
              </p>
            </div>

            <h2
              id="home-solutions-title"
              className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#10161F] sm:text-5xl"
            >
              Des solutions pensées
              <br className="hidden sm:block" /> pour vos projets.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:max-w-md lg:flex-col lg:items-start">
            <p className="text-sm leading-7 text-[#647084] sm:text-base">
              Découvrez les solutions que BEREM développe et met à votre
              disposition pour répondre à des besoins concrets.
            </p>

            <Link
              href="/solutions"
              className="group inline-flex shrink-0 items-center gap-2 border-b border-[#D59344] pb-2 text-sm font-semibold text-[#172033] transition-colors hover:text-[#BE7D32]"
            >
              Toutes nos solutions
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* CARTES DES SOLUTIONS */}
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {solutions.map((solution, index) => {
            const image = solution.coverImageUrl || solution.logoUrl;

            return (
              <article
                key={solution.id}
                className="group flex min-w-0 flex-col border border-[#EAE1D7] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#D59344]/50 hover:shadow-[0_18px_45px_rgba(16,22,31,0.08)]"
              >
                <Link
                  href={`/solutions/${solution.slug}`}
                  aria-label={`Découvrir ${solution.name}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-[#F3E9DC]"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={
                        solution.coverImageUrl
                          ? `Présentation de ${solution.name}`
                          : `Logo de ${solution.name}`
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={
                        solution.coverImageUrl
                          ? "object-cover transition-transform duration-700 group-hover:scale-105"
                          : "object-contain bg-white p-10 transition-transform duration-500 group-hover:scale-[1.03]"
                      }
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Layers3
                        size={48}
                        strokeWidth={1}
                        className="text-[#D59344]/50"
                      />
                    </div>
                  )}

                  {solution.isFeatured && (
                    <span className="absolute left-4 top-4 border border-[#D59344]/30 bg-[#FBF7F1]/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#9B6428] backdrop-blur-sm">
                      À la une
                    </span>
                  )}

                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#10161F] text-white transition-colors duration-300 group-hover:bg-[#D59344] group-hover:text-[#10161F]">
                    <ArrowUpRight size={19} />
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tabular-nums tracking-[0.16em] text-[#BE7D32]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-7 bg-[#D59344]/60" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#647084]">
                      Solution BEREM
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold leading-snug text-[#172033] transition-colors group-hover:text-[#BE7D32] sm:text-2xl">
                    <Link href={`/solutions/${solution.slug}`}>
                      {solution.name}
                    </Link>
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#647084]">
                    {solution.summary}
                  </p>

                  <Link
                    href={`/solutions/${solution.slug}`}
                    className="mt-6 inline-flex items-center gap-2 border-t border-[#EAE1D7] pt-4 text-xs font-bold text-[#26364A] transition-colors hover:text-[#BE7D32]"
                  >
                    Découvrir la solution
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}