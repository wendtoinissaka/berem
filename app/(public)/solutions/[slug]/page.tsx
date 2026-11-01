import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Lightbulb,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import SolutionExperience from "@/components/solutions/SolutionExperience";

export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
};

const focusStyles =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D59344] focus-visible:ring-offset-2";

export default async function SolutionDetailPage({ params }: Props) {
  await connection();

  const { slug } = await params;

  const solution = await prisma.solution.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      features: {
        orderBy: { sortOrder: "asc" },
      },
      media: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!solution) notFound();

  const images = solution.media
    .filter((media) => media.type === "IMAGE")
    .map(({ id, url, caption }) => ({ id, url, caption }));

  const videos = solution.media
    .filter((media) => media.type === "VIDEO")
    .map(({ id, url, caption }) => ({ id, url, caption }));

  const features = solution.features.map(
    ({ id, title, description }) => ({
      id,
      title,
      description,
    }),
  );

  return (
    <main className="overflow-hidden bg-[#FBF7F1] text-[#172033]">
      {/* INTRODUCTION */}
      <section className="relative px-5 pb-16 pt-10 sm:px-8 lg:px-14 lg:pb-24 lg:pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full border border-[#D59344]/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-16 h-[350px] w-[350px] rounded-full border border-[#D59344]/10"
        />

        <div className="relative mx-auto max-w-[1400px]">
          {/* NAVIGATION */}
          <div className="flex flex-wrap items-center justify-between gap-5">
            <nav
              aria-label="Fil d'Ariane"
              className="flex flex-wrap items-center gap-2 text-xs text-[#647084]"
            >
              <Link
                href="/"
                className={`transition hover:text-[#BE7D32] ${focusStyles}`}
              >
                Accueil
              </Link>

              <ChevronRight size={13} aria-hidden="true" />

              <Link
                href="/solutions"
                className={`transition hover:text-[#BE7D32] ${focusStyles}`}
              >
                Solutions
              </Link>

              <ChevronRight size={13} aria-hidden="true" />

              <span
                aria-current="page"
                className="font-semibold text-[#10161F]"
              >
                {solution.name}
              </span>
            </nav>

            <Link
              href="/solutions"
              className={`group inline-flex items-center gap-2 text-xs font-semibold text-[#26364A] transition hover:text-[#BE7D32] ${focusStyles}`}
            >
              <ArrowLeft
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-1"
              />
              Toutes les solutions
            </Link>
          </div>

          {/* CONTENU */}
          <div className="mt-16 grid items-center gap-12 lg:mt-24 lg:grid-cols-[1fr_350px] lg:gap-20">
            <div>
              <div className="mb-7 inline-flex items-center gap-3 border border-[#EAE1D7] bg-white/70 px-4 py-2.5">
                <span className="flex h-7 w-7 items-center justify-center bg-[#F6E7D2] text-[#BE7D32]">
                  <Lightbulb size={15} aria-hidden="true" />
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#647084]">
                  Une solution BEREM
                </span>
              </div>

              <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#10161F] sm:text-6xl lg:text-[6.2rem]">
                {solution.name}
                <span className="text-[#D59344]">.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-[#647084] sm:text-lg">
                {solution.summary}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                {solution.websiteUrl && (
                  <a
                    href={solution.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-5 bg-[#10161F] px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#26364A] hover:shadow-xl ${focusStyles}`}
                  >
                    {solution.actionLabel || "Découvrir la solution"}

                    <ExternalLink
                      size={17}
                      aria-hidden="true"
                      className="text-[#D59344] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </a>
                )}

                <a
                  href="#fonctionnalites"
                  className={`group inline-flex items-center gap-3 border border-[#D8C8B7] px-6 py-4 text-sm font-semibold text-[#26364A] transition-all duration-300 hover:border-[#D59344] hover:bg-white ${focusStyles}`}
                >
                  Explorer les fonctionnalités

                  <ArrowDown
                    size={16}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-y-1"
                  />
                </a>
              </div>
            </div>

            {/* LOGO */}
            {solution.logoUrl && (
              <div className="relative mx-auto flex min-h-[210px] w-full max-w-[350px] items-center justify-center overflow-hidden border border-[#EAE1D7] bg-white p-10 shadow-[0_20px_60px_rgba(16,22,31,0.06)]">
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#F6E7D2]/70"
                />

                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full border border-[#D59344]/20"
                />

                <div className="relative z-10 h-28 w-full">
                  <Image
                    src={solution.logoUrl}
                    alt={`Logo de ${solution.name}`}
                    fill
                    sizes="300px"
                    className="object-contain"
                  />
                </div>

                <span className="absolute bottom-5 right-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#647084]">
                  BEREM / SOLUTION
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* VISUEL PRINCIPAL */}
      {solution.coverImageUrl && (
        <section className="px-3 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1600px]">
            <div className="group relative overflow-hidden bg-[#EAE1D7]">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#10161F]/55 via-transparent to-transparent" />

              <div className="relative min-h-[280px] w-full sm:min-h-[420px] lg:min-h-[620px]">
                <Image
                  src={solution.coverImageUrl}
                  alt={`Présentation de ${solution.name}`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                />
              </div>

              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 sm:bottom-10 sm:left-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D59344] text-[#10161F]">
                  <ArrowUpRight size={20} aria-hidden="true" />
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  Découvrez notre solution
                </span>
              </div>

              <div className="absolute right-6 top-6 z-20 border border-white/40 bg-[#10161F]/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md sm:right-10 sm:top-10">
                BEREM
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRÉSENTATION */}
      {solution.description && (
        <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-32">
          <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <span className="inline-flex items-center gap-3 border border-[#EAE1D7] bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#647084]">
                À propos
              </span>

              <h2 className="mt-7 max-w-md text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#10161F] sm:text-5xl">
                Une idée.
                <br />
                Une solution.
                <br />
                <span className="text-[#D59344]">
                  Des possibilités.
                </span>
              </h2>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-[2px] w-10 bg-[#D59344]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#647084]">
                  L'approche BEREM
                </span>
              </div>
            </div>

            <div className="relative border border-[#EAE1D7] bg-white p-7 shadow-[0_15px_50px_rgba(16,22,31,0.04)] sm:p-10 lg:mt-12 lg:p-14">
              <p className="whitespace-pre-line text-base leading-8 text-[#647084] sm:text-lg sm:leading-9">
                {solution.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EXPÉRIENCE INTERACTIVE */}
      <SolutionExperience
        features={features}
        images={images}
        videos={videos}
        solutionName={solution.name}
      />
    </main>
  );
}