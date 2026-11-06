"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

import {
  DraftingCompass,
  Building2,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Génie civil",
    description:
      "Des solutions d’ingénierie adaptées à vos ouvrages, aux contraintes du terrain et aux exigences de votre projet.",
    detail: "Expertise & ingénierie",
    icon: DraftingCompass,
  },
  {
    number: "02",
    title: "Construction",
    description:
      "Des solutions d’ingénierie adaptées à vos ouvrages, aux contraintes du terrain et aux exigences de votre projet.",
    detail: "Bâtiment & ouvrages",
    icon: Building2,
  },
  {
    number: "03",
    title: "Études techniques",
    description:
      "Faisabilité, dimensionnement et plans d’exécution : nous préparons les bases techniques de votre projet pour guider sa réalisation.",
    detail: "Analyse & conception",
    icon: Ruler,
  },
    {
    number: "04",
    title: "Rénovation, si proposée comme service distinct",
    description:
      "Nous réhabilitons et transformons vos bâtiments pour améliorer leur confort, leur fonctionnalité et leur durabilité.",
    detail: "Analyse & conception",
    icon: Ruler,
  },
    {
    number: "05",
    title: "Suivi de chantier",
    description:
      "Un accompagnement sur le terrain et des comptes rendus pour vous aider à suivre l’exécution et l’évolution de vos travaux.",
    detail: "Analyse & conception",
    icon: Ruler,
  },
  
];

export default function ServicesSection() {
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
      carousel.querySelectorAll<HTMLElement>("[data-service-card]"),
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

  // Navigation précédente.
  const prevSlide = useCallback(() => {
    if (maxIndex <= 0) return;

    const nextIndex =
      activeIndex <= 0 ? maxIndex : activeIndex - 1;

    goToSlide(nextIndex);
  }, [activeIndex, maxIndex, goToSlide]);

  // Navigation suivante.
  const nextSlide = useCallback(() => {
    if (maxIndex <= 0) return;

    const nextIndex =
      activeIndex >= maxIndex ? 0 : activeIndex + 1;

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
      id="berem-intro"
      className="relative overflow-hidden border-y border-[#EAE1D7] bg-[#FBF7F1] py-24 sm:py-28"
    >
      {/* MASQUER LA BARRE DE DÉFILEMENT */}
      <style>{`
        .berem-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* DÉCORATION */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full border border-[#26364A]/[0.06]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-36 h-[290px] w-[290px] rounded-full border border-[#26364A]/[0.06]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* EN-TÊTE */}
        <ScrollReveal>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-10 bg-[#D59344]" />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#BE7D32] sm:text-sm">
                Nos domaines d'expertise
              </p>
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-[#10161F] sm:text-5xl lg:text-6xl">
              L'expertise technique
              <br />
              <span className="text-[#D59344]">
                au service du terrain.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-lg text-base leading-8 text-[#647084]">
              De l'ingénierie aux travaux de construction, découvrez les
              domaines dans lesquels BEREM développe son savoir-faire et
              accompagne les projets.
            </p>

            <Link
              href="/services"
              className="group mt-6 inline-flex items-center gap-3 border-b border-[#D59344]/60 pb-2 text-sm font-bold text-[#10161F] transition-colors hover:text-[#BE7D32]"
            >
              Explorer tous nos services

              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

</ScrollReveal>

        {/* CARROUSEL */}
        <ScrollReveal delay={120}>
        <div className="relative mt-12">
          {/* FLÈCHE GAUCHE */}
          <button
            type="button"
            onClick={prevSlide}
            disabled={maxIndex === 0}
            aria-label="Services précédents"
            className="absolute -left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#EAE1D7] bg-white text-[#10161F] shadow-[0_5px_20px_rgba(16,22,31,0.10)] transition-all duration-300 hover:border-[#D59344] hover:bg-[#D59344] disabled:cursor-not-allowed disabled:opacity-30 sm:-left-5 sm:h-12 sm:w-12 lg:-left-6"
          >
            <ChevronLeft size={23} strokeWidth={1.8} />
          </button>

          {/* CARTES */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="berem-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            aria-label="Carrousel des services BEREM"
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  data-service-card
                  className="group relative flex min-h-[250px] w-[88%] shrink-0 snap-start flex-col overflow-hidden rounded-sm border border-[#EAE1D7] bg-white p-5 transition-all duration-500 hover:border-[#D59344]/60 hover:shadow-[0_20px_50px_rgba(16,22,31,0.08)] sm:min-h-[260px] sm:w-[calc((100%-20px)/2)] sm:p-6 lg:w-[calc((100%-40px)/3)]"
                >
                  {/* NUMÉRO DÉCORATIF */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-4 text-[85px] font-black leading-none tracking-tighter text-[#10161F]/[0.035] transition-all duration-500 group-hover:-translate-y-1 group-hover:text-[#D59344]/[0.09]"
                  >
                    {service.number}
                  </span>

                  {/* CATÉGORIE */}
                  <div className="relative flex items-center gap-3">
                    <span className="h-[2px] w-6 bg-[#D59344]" />

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#BE7D32]">
                      {service.detail}
                    </p>
                  </div>

                  {/* CONTENU */}
                  <div className="relative mt-5 flex flex-1 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-black leading-tight tracking-tight text-[#10161F] transition-colors duration-300 group-hover:text-[#BE7D32]">
                        {service.title}
                      </h3>

                      <p className="mt-3 text-[13px] leading-[1.7] text-[#647084]">
                        {service.description}
                      </p>
                    </div>

                    {/* ICÔNE */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D59344]/30 bg-[#FBF7F1] text-[#BE7D32] transition-all duration-500 group-hover:rotate-6 group-hover:border-[#D59344] group-hover:bg-[#D59344] group-hover:text-[#10161F]">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="relative mt-5 flex items-center justify-between border-t border-[#EAE1D7] pt-3">
                    <span className="text-[11px] font-semibold tracking-wide text-[#647084]">
                      Service {service.number}
                    </span>

                    <Link
                      href="/services"
                      aria-label={`Découvrir le service ${service.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10161F] text-white transition-all duration-300 hover:bg-[#D59344] hover:text-[#10161F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D59344]"
                    >
                      <ArrowUpRight size={15} />
                    </Link>
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
            aria-label="Services suivants"
            className="absolute -right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#EAE1D7] bg-white text-[#10161F] shadow-[0_5px_20px_rgba(16,22,31,0.10)] transition-all duration-300 hover:border-[#D59344] hover:bg-[#D59344] disabled:cursor-not-allowed disabled:opacity-30 sm:-right-5 sm:h-12 sm:w-12 lg:-right-6"
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
                      : "w-[7px] bg-[#10161F]/25 hover:bg-[#D59344]"
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