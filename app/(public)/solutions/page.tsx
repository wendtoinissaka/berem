import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import SolutionsShowcase from "@/components/solutions/SolutionsShowcase";

export const instant = false;

export const metadata: Metadata = {
  title: "Nos solutions | BEREM",
  description:
    "Découvrez les solutions proposées par BEREM pour répondre aux besoins des entreprises et accompagner leurs projets.",
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
      media: {
    where: {
      type: "IMAGE",
    },
    orderBy: {
      sortOrder: "asc",
    },
    take: 4,
    select: {
      id: true,
      url: true,
      caption: true,
    },
  },
    },
  });

  return (
    <main className="min-h-screen bg-[#FBF7F1]">

      {/* PRÉSENTATION DES SOLUTIONS */}
      {solutions.length > 0 ? (
        <SolutionsShowcase solutions={solutions} />
      ) : (
        <section className="relative overflow-hidden bg-[#FBF7F1] px-5 py-28 sm:px-8 lg:py-36">

          <div
            aria-hidden="true"
            className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-[#D59344]/15"
          />

          <div className="relative mx-auto max-w-4xl text-center">

            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
              <span className="h-px w-8 bg-[#D59344]" />
              Nos solutions
              <span className="h-px w-8 bg-[#D59344]" />
            </span>

            <h1 className="mt-8 text-3xl font-semibold leading-tight tracking-tight text-[#172033] sm:text-5xl">
              Des solutions adaptées
              <span className="block text-[#BE7D32]">
                à vos besoins.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#647084] sm:text-base">
              Notre catalogue est en cours de préparation. Découvrez
              prochainement les solutions proposées par BEREM pour
              accompagner vos projets.
            </p>

            <Link
              href="/devis"
              className="mt-9 inline-flex items-center gap-3 bg-[#10161F] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#D59344] hover:text-[#10161F]"
            >
              Échanger avec notre équipe
              <ArrowUpRight size={18} />
            </Link>

          </div>
        </section>
      )}

      {/* SECTION CONTACT */}
      <section className="relative overflow-hidden bg-[#F3E9DC] px-5 py-20 sm:px-8 lg:py-24">

        {/* Décoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border border-[#D59344]/20"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border border-[#D59344]/15"
        />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
              <MessageCircle size={16} />
              Échangeons
            </p>

            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
              Vous avez un besoin particulier ?
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-8 text-[#647084] sm:text-base">
              Chaque projet est différent. Présentez-nous votre besoin
              et échangeons ensemble pour identifier une solution
              adaptée à vos attentes.
            </p>

          </div>

          <Link
            href="/devis"
            className="group inline-flex shrink-0 items-center justify-center gap-4 self-start bg-[#10161F] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#D59344] hover:text-[#10161F] lg:self-center"
          >
            Parlons de votre projet

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

        </div>
      </section>

    </main>
  );
}