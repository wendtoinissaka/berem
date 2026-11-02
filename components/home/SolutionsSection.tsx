"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  DraftingCompass,
  HardHat,
  ChevronLeft,
  ChevronRight,
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<number[]>([]);

  const [slidePositions, setSlidePositions] = useState<number[]>([0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const maxIndex = slidePositions.length - 1;

  // Détecter la préférence de réduction des animations.
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updatePreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  // Calculer les positions réelles de navigation.
  const updateCarousel = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const cards = Array.from(
      carousel.querySelectorAll<HTMLElement>("[data-solution-card]"),
    );

    if (!cards.length) return;

    const maxScroll = Math.max(
      0,
      carousel.scrollWidth - carousel.clientWidth,
    );

    const firstCardLeft =
      cards[0].getBoundingClientRect().left -
      carousel.getBoundingClientRect().left +
      carousel.scrollLeft;

    const positions = cards
      .map((card) => {
        const position =
          card.getBoundingClientRect().left -
          carousel.getBoundingClientRect().left +
          carousel.scrollLeft -
          firstCardLeft;

        return Math.min(position, maxScroll);
      })
      .filter((position, index, array) => {
        return (
          position >= 0 &&
          array.findIndex(
            (other) => Math.abs(other - position) < 2,
          ) === index
        );
      });

    // Ajouter la dernière position si nécessaire.
    if (
      maxScroll > 2 &&
      !positions.some((position) => Math.abs(position - maxScroll) < 2)
    ) {
      positions.push(maxScroll);
    }

    const uniquePositions = positions.sort((a, b) => a - b);

    positionsRef.current = uniquePositions;

    setSlidePositions(uniquePositions);

    // Conserver une position valide après un redimensionnement.
    const currentPosition = carousel.scrollLeft;

    let closestIndex = 0;
    let closestDistance = Infinity;

    uniquePositions.forEach((position, index) => {
      const distance = Math.abs(position - currentPosition);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  // Observer les changements de dimensions.
  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const observer = new ResizeObserver(() => {
      updateCarousel();
    });

    observer.observe(carousel);

    Array.from(carousel.children).forEach((child) => {
      observer.observe(child);
    });

    updateCarousel();

    return () => observer.disconnect();
  }, [updateCarousel]);

  // Navigation vers une position précise.
  const goToSlide = useCallback(
    (index: number) => {
      const carousel = carouselRef.current;
      const positions = positionsRef.current;

      if (!carousel || !positions.length) return;

      const targetIndex = Math.max(
        0,
        Math.min(index, positions.length - 1),
      );

      carousel.scrollTo({
        left: positions[targetIndex],
        behavior: reducedMotion ? "auto" : "smooth",
      });

      setActiveIndex(targetIndex);
    },
    [reducedMotion],
  );

  // Navigation précédente avec retour à la dernière position.
  const prevSlide = useCallback(() => {
    if (maxIndex <= 0) return;

    const nextIndex = activeIndex <= 0 ? maxIndex : activeIndex - 1;

    goToSlide(nextIndex);
  }, [activeIndex, maxIndex, goToSlide]);

  // Navigation suivante avec retour à la première position.
  const nextSlide = useCallback(() => {
    if (maxIndex <= 0) return;

    const nextIndex = activeIndex >= maxIndex ? 0 : activeIndex + 1;

    goToSlide(nextIndex);
  }, [activeIndex, maxIndex, goToSlide]);

  // Synchroniser la pagination avec le défilement manuel.
  const handleScroll = useCallback(() => {
    const carousel = carouselRef.current;
    const positions = positionsRef.current;

    if (!carousel || !positions.length) return;

    let closestIndex = 0;
    let closestDistance = Infinity;

    positions.forEach((position, index) => {
      const distance = Math.abs(carousel.scrollLeft - position);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  return (
    <section
      id="approche"
      className="relative isolate overflow-hidden bg-[#10161F] py-14 text-white sm:py-20 lg:py-24"
    >
      {/* DÉCORATION */}
      <div className="pointer-events-none absolute -right-40 top-0 -z-10 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

      <div className="pointer-events-none absolute -right-20 top-20 -z-10 h-[340px] w-[340px] rounded-full border border-white/[0.06]" />

      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-1/2 w-1/2 bg-gradient-to-tr from-[#D59344]/[0.07] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* EN-TÊTE */}
        <ScrollReveal>
          <div className="grid gap-6 border-b border-white/15 pb-8 sm:gap-8 sm:pb-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">

            <div>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="h-[2px] w-8 bg-[#D59344] sm:w-10" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D59344] sm:text-xs sm:tracking-[0.25em]">
                  Notre méthode de travail
                </p>
              </div>

              <h2 className="mt-5 text-3xl font-black leading-[1.08] tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
                De la vision
                <br />
                <span className="text-[#D59344]">
                  à la réalisation.
                </span>
              </h2>
            </div>

            <div className="lg:pb-2">
              <p className="max-w-lg text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                Chaque projet est différent. Notre approche consiste à
                comprendre vos besoins, préparer les interventions et
                accompagner la réalisation avec méthode et exigence.
              </p>

              <Link
                href="/solutions"
                className="group mt-5 inline-flex items-center gap-3 border-b border-[#D59344]/60 pb-2 text-sm font-bold text-white transition-colors hover:text-[#D59344] sm:mt-6"
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

        {/* CARROUSEL */}
        <ScrollReveal delay={120}>
          <div className="relative mt-8 sm:mt-12">

            {/* FLÈCHE GAUCHE */}
            <button
              type="button"
              onClick={prevSlide}
              disabled={maxIndex === 0}
              aria-label="Étapes précédentes"
              className="absolute -left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#10161F] text-white shadow-[0_5px_20px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F] disabled:cursor-not-allowed disabled:opacity-30 sm:-left-5 sm:h-12 sm:w-12 lg:-left-6"
            >
              <ChevronLeft size={23} strokeWidth={1.8} />
            </button>

            {/* CARTES */}
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="berem-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-5 sm:gap-5"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              aria-label="Carrousel des étapes de notre méthode"
            >
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    data-solution-card
                    className="group relative flex min-h-[300px] w-[88%] shrink-0 snap-start flex-col overflow-hidden border border-white/10 bg-white/[0.035] p-5 transition-all duration-500 hover:border-[#D59344]/50 hover:bg-white/[0.07] sm:min-h-[330px] sm:w-[calc((100%-20px)/2)] sm:p-7 lg:min-h-[350px] lg:w-[calc((100%-40px)/3)] lg:p-8"
                  >
                    {/* NUMÉRO */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -top-4 text-[85px] font-black leading-none tracking-tighter text-white/[0.035] transition-colors duration-500 group-hover:text-[#D59344]/[0.09]"
                    >
                      {step.number}
                    </span>

                    {/* EN-TÊTE DE CARTE */}
                    <div className="relative flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.2em] text-[#D59344] sm:text-sm">
                        ÉTAPE {step.number}
                      </span>

                      <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.04] text-[#D59344] transition-all duration-500 group-hover:rotate-6 group-hover:border-[#D59344]/40 group-hover:bg-[#D59344] group-hover:text-[#10161F] sm:h-12 sm:w-12">
                        <Icon size={22} strokeWidth={1.6} />
                      </div>
                    </div>

                    {/* CONTENU */}
                    <p className="relative mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 sm:mt-9 sm:text-xs">
                      {step.subtitle}
                    </p>

                    <h3 className="relative mt-3 text-2xl font-black tracking-tight transition-colors duration-300 group-hover:text-[#D59344] sm:text-3xl">
                      {step.title}
                    </h3>

                    <p className="relative mt-4 text-sm leading-7 text-white/60">
                      {step.description}
                    </p>

                    {/* DÉTAILS */}
                    <div className="relative mt-6 flex flex-wrap gap-2">
                      {step.details.map((detail) => (
                        <span
                          key={detail}
                          className="border border-white/10 px-3 py-2 text-[10px] font-medium text-white/60 transition-colors duration-300 group-hover:border-white/20 sm:text-[11px]"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>

                    {/* FOOTER */}
                    <div className="relative mt-auto flex items-center justify-between border-t border-white/10 pt-5 mt-7">
                      <span className="text-[10px] font-medium text-white/35 sm:text-xs">
                        BEREM - Notre approche
                      </span>

                      <ArrowRight
                        size={18}
                        className="text-[#D59344] transition-transform duration-300 group-hover:translate-x-2"
                      />
                    </div>

                    {/* BARRE INFÉRIEURE */}
                    <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#D59344] transition-all duration-500 group-hover:w-full" />
                  </article>
                );
              })}
            </div>

            {/* FLÈCHE DROITE */}
            <button
              type="button"
              onClick={nextSlide}
              disabled={maxIndex === 0}
              aria-label="Étapes suivantes"
              className="absolute -right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#10161F] text-white shadow-[0_5px_20px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F] disabled:cursor-not-allowed disabled:opacity-30 sm:-right-5 sm:h-12 sm:w-12 lg:-right-6"
            >
              <ChevronRight size={23} strokeWidth={1.8} />
            </button>

            {/* PAGINATION */}
            <div className="mt-3 flex items-center justify-center">
              <div className="flex items-center gap-3">
                {slidePositions.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Afficher la position ${index + 1}`}
                    aria-current={
                      activeIndex === index ? "true" : undefined
                    }
                    className={`h-[7px] rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-7 bg-[#D59344]"
                        : "w-[7px] bg-white/25 hover:bg-[#D59344]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}