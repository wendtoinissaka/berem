"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  MessageSquareQuote,
  Star,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ChevronUp,
} from "lucide-react";

type Testimonial = {
  id: string;
  clientName: string;
  company: string | null;
  role: string | null;
  content: string;
  projectName: string | null;
  photoUrl: string | null;
};

const INITIAL_COUNT = 3;
const LOAD_MORE_COUNT = 3;

export default function TestimonialsList({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<number[]>([]);

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [slidePositions, setSlidePositions] = useState<number[]>([0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;
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

  // Calculer les positions réelles du carrousel.
  const updateCarousel = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const cards = Array.from(
      carousel.querySelectorAll<HTMLElement>("[data-testimonial-card]"),
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

    if (
      maxScroll > 2 &&
      !positions.some((position) => Math.abs(position - maxScroll) < 2)
    ) {
      positions.push(maxScroll);
    }

    const uniquePositions = positions.sort((a, b) => a - b);

    positionsRef.current = uniquePositions;
    setSlidePositions(uniquePositions);

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

  // Observer les changements de dimensions et de contenu.
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
  }, [updateCarousel, visibleCount]);

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

    goToSlide(activeIndex <= 0 ? maxIndex : activeIndex - 1);
  }, [activeIndex, maxIndex, goToSlide]);

  // Navigation suivante.
  const nextSlide = useCallback(() => {
    if (maxIndex <= 0) return;

    goToSlide(activeIndex >= maxIndex ? 0 : activeIndex + 1);
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
    <>
      {/* CARROUSEL */}
      <style>{`
        .berem-testimonials-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="relative">
        {/* FLÈCHE GAUCHE */}
        <button
          type="button"
          onClick={prevSlide}
          disabled={maxIndex === 0}
          aria-label="Témoignages précédents"
          className="absolute -left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#EAE1D7] bg-white text-[#10161F] shadow-[0_5px_20px_rgba(16,22,31,0.10)] transition-all duration-300 hover:border-[#D59344] hover:bg-[#D59344] disabled:cursor-not-allowed disabled:opacity-30 sm:-left-5 sm:h-12 sm:w-12 lg:-left-6"
        >
          <ChevronLeft size={23} strokeWidth={1.8} />
        </button>

        {/* CARTES */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="berem-testimonials-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-5 sm:gap-5"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          aria-label="Témoignages des clients de BEREM"
        >
          {visibleTestimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              data-testimonial-card
              className="group relative flex min-h-[290px] w-[88%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-[#EAE1D7] bg-white p-5 transition-all duration-300 hover:border-[#D59344]/60 hover:shadow-[0_15px_40px_rgba(16,22,31,0.07)] sm:min-h-[310px] sm:w-[calc((100%-20px)/2)] sm:p-6 lg:w-[calc((100%-40px)/3)]"
            >
              {/* EN-TÊTE */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D59344]/10 text-[#BE7D32] transition-colors duration-300 group-hover:bg-[#D59344] group-hover:text-[#10161F]">
                  <MessageSquareQuote
                    size={20}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                {testimonial.projectName && (
                  <span className="max-w-[70%] rounded-md bg-[#FBF7F1] px-3 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-[#647084]">
                    {testimonial.projectName}
                  </span>
                )}
              </div>

              {/* AVIS */}
              <p className="mb-6 whitespace-pre-line break-words text-[13px] leading-7 text-[#647084] sm:text-sm sm:leading-7">
                {testimonial.content}
              </p>

              {/* INFORMATIONS CLIENT */}
              <div className="mt-auto flex items-center gap-3 border-t border-[#EAE1D7] pt-4">
                {testimonial.photoUrl ? (
                  <img
                    src={testimonial.photoUrl}
                    alt={`Photo de ${testimonial.clientName}`}
                    loading="lazy"
                    className="h-10 w-10 shrink-0 rounded-full border border-[#EAE1D7] object-cover sm:h-11 sm:w-11"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10161F] text-sm font-bold text-white sm:h-11 sm:w-11"
                  >
                    {testimonial.clientName.trim().charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-[#10161F]">
                    {testimonial.clientName}
                  </h3>

                  {(testimonial.role || testimonial.company) && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#647084]">
                      {[testimonial.role, testimonial.company]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              {/* DÉTAIL DÉCORATIF */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#D59344] transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>

        {/* FLÈCHE DROITE */}
        <button
          type="button"
          onClick={nextSlide}
          disabled={maxIndex === 0}
          aria-label="Témoignages suivants"
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
                aria-current={activeIndex === index ? "true" : undefined}
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

{/* EXPLORER DAVANTAGE DE TÉMOIGNAGES */}
{(hasMore || visibleCount > INITIAL_COUNT) && (
  <div className="mt-9 flex flex-col items-center gap-5 sm:mt-11">

    {hasMore && (
      <button
        type="button"
        onClick={() =>
          setVisibleCount((count) =>
            Math.min(count + LOAD_MORE_COUNT, testimonials.length),
          )
        }
        className="group flex items-center gap-3 rounded-full border border-[#EAE1D7] bg-white py-2 pl-2 pr-5 transition-all duration-300 hover:border-[#D59344] hover:shadow-[0_8px_25px_rgba(16,22,31,0.07)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D59344]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10161F] text-white transition-all duration-300 group-hover:rotate-90 group-hover:bg-[#D59344] group-hover:text-[#10161F]">
          <Plus size={18} strokeWidth={1.8} />
        </span>

        <span className="text-xs font-semibold tracking-wide text-[#26364A]">
          Plus de témoignages
        </span>
      </button>
    )}

    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold tracking-[0.12em] text-[#10161F]">
        {String(visibleCount).padStart(2, "0")}
      </span>

      <div className="h-[2px] w-12 overflow-hidden rounded-full bg-[#EAE1D7]">
        <div
          className="h-full rounded-full bg-[#D59344] transition-all duration-500"
          style={{
            width: `${(visibleCount / testimonials.length) * 100}%`,
          }}
        />
      </div>

      <span className="text-[10px] font-medium tracking-[0.12em] text-[#647084]">
        {String(testimonials.length).padStart(2, "0")}
      </span>
    </div>

    {visibleCount > INITIAL_COUNT && (
      <button
        type="button"
        onClick={() => {
          setVisibleCount(INITIAL_COUNT);
          setActiveIndex(0);
          carouselRef.current?.scrollTo({
            left: 0,
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#647084] transition-colors hover:text-[#BE7D32]"
      >
        <ChevronUp size={14} />
        Réduire
      </button>
    )}
  </div>
)}
    </>
  );
}