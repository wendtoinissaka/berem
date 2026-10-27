import Link from "next/link";
import { connection } from "next/server";

import { prisma } from "@/lib/prisma";

export default async function SolutionsSection() {
  await connection();

  const solutions = await prisma.solution.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
    },
    orderBy: [
      { sortOrder: "asc" },
      { publishedAt: "desc" },
    ],
    take: 3,
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      logoUrl: true,
      coverImageUrl: true,
      actionLabel: true,
    },
  });

  if (solutions.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#F59E0B]">
              Nos solutions
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-[#102A43] sm:text-4xl">
              Des solutions adaptées à vos ambitions
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Découvrez les solutions proposées par BEREM pour répondre à vos
              besoins et accompagner vos projets.
            </p>
          </div>

          <Link
            href="/solutions"
            className="inline-flex w-fit items-center gap-2 font-bold text-[#102A43] transition hover:text-[#F59E0B]"
          >
            Toutes nos solutions
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Cartes des solutions */}
        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link
                href={`/solutions/${solution.slug}`}
                className="block"
                aria-label={`Découvrir ${solution.name}`}
              >
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-100">
                  {solution.coverImageUrl ? (
                    <img
                      src={solution.coverImageUrl}
                      alt={`Présentation de ${solution.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : solution.logoUrl ? (
                    <img
                      src={solution.logoUrl}
                      alt={`Logo de ${solution.name}`}
                      className="max-h-32 max-w-[70%] object-contain"
                    />
                  ) : (
                    <span className="text-5xl font-black text-[#102A43]">
                      {solution.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  {solution.logoUrl && solution.coverImageUrl && (
                    <img
                      src={solution.logoUrl}
                      alt=""
                      loading="lazy"
                      className="mb-4 h-10 max-w-28 object-contain object-left"
                    />
                  )}

                  <h3 className="text-xl font-black text-[#102A43] transition group-hover:text-[#F59E0B]">
                    {solution.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                    {solution.summary}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#102A43]">
                    {solution.actionLabel || "Découvrir la solution"}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}