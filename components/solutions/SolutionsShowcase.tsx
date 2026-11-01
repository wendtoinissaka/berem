"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Images,
} from "lucide-react";

type Solution = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  isFeatured: boolean;
  actionLabel: string | null;
  media: {
    id: string;
    url: string;
    caption: string | null;
  }[];
};

type SolutionsShowcaseProps = {
  solutions: Solution[];
};

const AUTOPLAY_DELAY = 6000;
// const CIRCLE_CIRCUMFERENCE = 131.95;

export default function SolutionsShowcase({
  solutions,
}: SolutionsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = solutions.length;
  const activeSolution = solutions[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (total <= 1) return;
      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const previous = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Défilement automatique toutes les 6 secondes.
  useEffect(() => {
    if (total <= 1) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, total]);

  if (!activeSolution) return null;

  const solutionUrl = `/solutions/${activeSolution.slug}`;

  const galleryImages = activeSolution.media
    .filter((item) => item.url)
    .slice(0, 4);

  return (
    <section
      aria-label="Présentation de nos solutions"
      className="relative overflow-hidden bg-[#FBF7F1]"
    >
      {/* PRÉSENTATION PRINCIPALE */}
      <div className="relative mx-auto flex min-h-[650px] max-w-[1600px] items-center px-5 py-16 sm:px-10 lg:min-h-[700px] lg:px-20 xl:px-28">
        {/* Décoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 h-[580px] w-[580px] -translate-y-1/2 rounded-full border border-[#D59344]/15"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-[#D59344]/15"
        />

        <div className="relative grid w-full items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* INFORMATIONS */}
          <div className="relative z-10 order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#D59344]" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE7D32]">
                L'univers BEREM
              </span>
            </div>

            {/* NUMÉRO DE LA SOLUTION */}
            <div className="mt-8 flex items-center gap-3">
              <span className="text-sm font-semibold tabular-nums text-[#BE7D32]">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>

              <span className="h-px w-8 bg-[#EAE1D7]" />

              <span className="text-xs uppercase tracking-[0.16em] text-[#647084]">
                {total} solution{total > 1 ? "s" : ""}
              </span>
            </div>

            {/* CONTENU DYNAMIQUE */}
            <div
              key={activeSolution.id}
              className="solution-content-enter"
            >
              {activeSolution.isFeatured && (
                <span className="mt-7 inline-flex border border-[#D59344]/40 bg-[#F3E9DC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#BE7D32]">
                  Solution à la une
                </span>
              )}

              {/* NOM CLIQUABLE */}
              <Link
                href={solutionUrl}
                className="group block w-fit"
                aria-label={`Découvrir ${activeSolution.name}`}
              >
                <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-[#172033] transition-colors duration-300 group-hover:text-[#BE7D32] sm:text-5xl xl:text-6xl">
                  {activeSolution.name}
                </h1>
              </Link>

              <p className="mt-7 max-w-lg text-sm leading-8 text-[#647084] sm:text-base">
                {activeSolution.summary}
              </p>

              <Link
                href={solutionUrl}
                className="group mt-9 inline-flex items-center gap-5 bg-[#10161F] px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#D59344] hover:text-[#10161F]"
              >
                {activeSolution.actionLabel || "Découvrir la solution"}

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>

            {/* APERÇUS DE LA GALERIE */}
            {galleryImages.length > 0 && (
              <div className="mt-9 max-w-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#647084]">
                    <Images size={14} />
                    Aperçu de la galerie
                  </span>

                  <Link
                    href={solutionUrl}
                    className="text-[11px] font-semibold text-[#BE7D32] transition hover:text-[#172033]"
                  >
                    Tout voir
                  </Link>
                </div>

                <div className="flex gap-2">
                  {galleryImages.map((media, index) => (
                    <Link
                      key={media.id}
                      href={solutionUrl}
                      aria-label={`Voir la galerie de ${activeSolution.name}, image ${index + 1}`}
                      className="group relative h-[65px] w-[76px] shrink-0 overflow-hidden rounded-md border border-[#EAE1D7] bg-white"
                    >
                      <Image
                        src={media.url}
                        alt={
                          media.caption ||
                          `Image ${index + 1} de ${activeSolution.name}`
                        }
                        fill
                        sizes="76px"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VISUEL PRINCIPAL */}
          <div className="relative order-1 flex min-w-0 items-center justify-center lg:order-2">
            {/* CERCLES DÉCORATIFS */}
            <div
              aria-hidden="true"
              className="absolute h-[340px] w-[340px] rounded-full border border-[#D59344]/20 sm:h-[470px] sm:w-[470px] lg:h-[570px] lg:w-[570px]"
            />

            <div
              aria-hidden="true"
              className="absolute h-[280px] w-[280px] rounded-full bg-[#F3E9DC] sm:h-[390px] sm:w-[390px] lg:h-[470px] lg:w-[470px]"
            />

            {/* IMAGE CLIQUABLE */}
            <Link
              key={activeSolution.id}
              href={solutionUrl}
              aria-label={`Découvrir la solution ${activeSolution.name}`}
              className="solution-visual-enter group relative z-10 block h-[330px] w-[min(100%,430px)] overflow-hidden rounded-xl border border-[#EAE1D7] bg-white shadow-[0_18px_55px_rgba(16,22,31,0.13)] sm:h-[420px] lg:h-[490px] lg:w-[430px]"
            >
              {activeSolution.coverImageUrl ? (
                <Image
                  src={activeSolution.coverImageUrl}
                  alt={`Présentation de ${activeSolution.name}`}
                  fill
                  priority={activeIndex === 0}
                  sizes="(max-width: 1024px) 90vw, 430px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F3E9DC] to-white p-10">
                  {activeSolution.logoUrl ? (
                    <div className="relative h-36 w-full">
                      <Image
                        src={activeSolution.logoUrl}
                        alt={`Logo ${activeSolution.name}`}
                        fill
                        sizes="300px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-8xl font-semibold text-[#D59344]/30">
                      {activeSolution.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              )}

              {/* LOGO DE LA SOLUTION */}
              {activeSolution.logoUrl && activeSolution.coverImageUrl && (
                <div className="absolute bottom-5 left-5 flex h-14 max-w-[150px] items-center rounded-lg border border-[#EAE1D7] bg-white/95 px-4 shadow-lg backdrop-blur-sm">
                  <div className="relative h-9 w-28">
                    <Image
                      src={activeSolution.logoUrl}
                      alt={`Logo ${activeSolution.name}`}
                      fill
                      sizes="112px"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {/* INDICATION AU SURVOL */}
              <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-[#10161F]/90 px-5 py-4 text-white transition-transform duration-300 group-hover:translate-y-0">
                <span className="text-xs font-semibold">
                  Découvrir cette solution
                </span>
                <ArrowUpRight size={18} />
              </div>
            </Link>

            {/* FLÈCHE PRÉCÉDENTE */}
            <button
              type="button"
              onClick={previous}
              disabled={total <= 1}
              aria-label="Solution précédente"
              className="group absolute left-1 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#10161F] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#26364A] disabled:cursor-not-allowed disabled:opacity-40 sm:left-0 lg:-left-5"            >
              <ArrowLeft size={18} />
            </button>

{/* FLÈCHE SUIVANTE AVEC COMPTE À REBOURS CIRCULAIRE */}
<button
  type="button"
  onClick={next}
  disabled={total <= 1}
  aria-label="Solution suivante"
  className="group absolute right-1 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#10161F] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#26364A] disabled:cursor-not-allowed disabled:opacity-40 sm:right-0 lg:-right-5"
>
  <svg
    viewBox="0 0 48 48"
    className="pointer-events-none absolute inset-0 h-full w-full"
    aria-hidden="true"
  >
    {/* Cercle de fond */}
    <circle
      cx="24"
      cy="24"
      r="21"
      fill="none"
      stroke="#D59344"
      strokeOpacity="0.20"
      strokeWidth="2.5"
    />

    {/* Progression circulaire */}
    <circle
      key={activeIndex}
      cx="24"
      cy="24"
      r="21"
      fill="none"
      stroke="#D59344"
      strokeWidth="2.8"
      strokeLinecap="round"
      className="berem-carousel-ring"
    />
  </svg>

  <ArrowRight
    size={19}
    className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
  />
</button>
          </div>
        </div>
      </div>

      {/* NAVIGATION INFÉRIEURE */}
      {total > 1 && (
        <div className="border-t border-[#EAE1D7] bg-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between gap-5 overflow-x-auto">
              {solutions.map((solution, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={solution.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Afficher ${solution.name}`}
                    aria-pressed={isActive}
                    className={`group relative flex min-w-max flex-1 items-center gap-3 border-b-2 py-6 text-left transition ${
                      isActive
                        ? "border-[#D59344]"
                        : "border-transparent hover:border-[#EAE1D7]"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        isActive
                          ? "text-[#BE7D32]"
                          : "text-[#647084]/60"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`text-xs font-semibold transition sm:text-sm ${
                        isActive
                          ? "text-[#172033]"
                          : "text-[#647084] group-hover:text-[#26364A]"
                      }`}
                    >
                      {solution.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ANIMATIONS */}
<style jsx>{`
  /* ========================================
     CERCLE DE PROGRESSION — 360°
     ======================================== */

  .solution-next-ring {
    transform: rotate(-90deg);
    pointer-events: none;
    overflow: visible;
  }

  .solution-next-ring__progress {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: carousel-progress ${AUTOPLAY_DELAY}ms linear forwards;
  }

  @keyframes carousel-progress {
    from {
      stroke-dashoffset: 100;
    }

    to {
      stroke-dashoffset: 0;
    }
  }

  /* ========================================
     ANIMATIONS DU CONTENU
     ======================================== */

  .solution-content-enter {
    animation: content-enter 450ms ease both;
  }

  .solution-visual-enter {
    animation: visual-enter 550ms ease both;
  }

  @keyframes content-enter {
    from {
      opacity: 0;
      transform: translateY(12px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes visual-enter {
    from {
      opacity: 0;
      transform: translateX(15px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* ACCESSIBILITÉ */
  @media (prefers-reduced-motion: reduce) {
    .solution-next-ring__progress,
    .solution-content-enter,
    .solution-visual-enter {
      animation: none !important;
    }

    .solution-next-ring__progress {
      stroke-dashoffset: 0;
    }
  }
`}</style>
    </section>
  );
}