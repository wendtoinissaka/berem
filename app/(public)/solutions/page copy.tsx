import Link from "next/link";
import { connection } from "next/server";

import { prisma } from "@/lib/prisma";

export const instant = false;

export const metadata = {
  title: "Nos solutions | BEREM",
  description:
    "Découvrez les solutions numériques et les outils proposés par BEREM.",
};

export default async function SolutionsPage() {
  await connection();

  const solutions = await prisma.solution.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      { isFeatured: "desc" },
      { sortOrder: "asc" },
      { publishedAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      logoUrl: true,
      coverImageUrl: true,
      isFeatured: true,
      actionLabel: true,
    },
  });

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#102A43] px-5 py-20 text-white sm:px-8 lg:py-28">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F59E0B]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#F59E0B]">
            Nos solutions
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Des solutions pensées pour vos projets.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Découvrez les solutions développées ou proposées par BEREM pour
            répondre aux besoins des entreprises et accompagner leur évolution.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
                Catalogue
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#102A43]">
                Explorez nos solutions
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              {solutions.length} solution{solutions.length > 1 ? "s" : ""}{" "}
              disponible{solutions.length > 1 ? "s" : ""}
            </p>
          </div>

          {solutions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <h3 className="text-xl font-bold text-[#102A43]">
                Nos solutions arrivent bientôt
              </h3>

              <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
                Notre catalogue est en cours de préparation. Revenez bientôt
                pour découvrir les solutions proposées par BEREM.
              </p>

              <Link
                href="/devis"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#F59E0B] px-6 py-3 font-bold text-[#102A43] transition hover:bg-amber-400"
              >
                Parlons de votre projet
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
                          alt={`Image de présentation de ${solution.name}`}
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

                      {solution.isFeatured && (
                        <span className="absolute left-4 top-4 rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-bold text-[#102A43]">
                          À découvrir
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      {solution.logoUrl && solution.coverImageUrl && (
                        <img
                          src={solution.logoUrl}
                          alt=""
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
          )}
        </div>
      </section>
    </main>
  );
}