"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Image as ImageIcon,
  Play,
  X,
  ZoomIn,
} from "lucide-react";

type Feature = {
  id: string;
  title: string;
  description: string | null;
};

type Media = {
  id: string;
  url: string;
  caption: string | null;
};

type Video = Media;

type Props = {
  features: Feature[];
  images: Media[];
  videos: Video[];
  solutionName: string;
};

export default function SolutionExperience({
  features,
  images,
  videos,
  solutionName,
}: Props) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const selectedFeature = features[activeFeature];

  const showPreviousImage = () => {
    setActiveImage((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );
  };

  const showNextImage = () => {
    setActiveImage((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  };

  useEffect(() => {
    if (activeImage === null) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
      if (event.key === "ArrowRight") showNextImage();
      if (event.key === "ArrowLeft") showPreviousImage();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage, images.length]);

  return (
    <>
      {/* FONCTIONNALITÉS */}
      {features.length > 0 && (
        <section
          id="fonctionnalites"
          className="relative overflow-hidden bg-[#F3E9DC] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#EAE1D7] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#647084]">
                  <span className="h-2 w-2 rounded-full bg-[#D59344]" />
                  Explorez les fonctionnalités
                </span>

                <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#10161F] sm:text-5xl">
                  Tout ce qu’il faut.
                  <br />
                  <span className="text-[#D59344]">Au même endroit.</span>
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-7 text-[#647084]">
                Sélectionnez une fonctionnalité pour découvrir ses
                particularités et comprendre ce qu’elle peut vous apporter.
              </p>
            </div>

            <div className="grid overflow-hidden rounded-[28px] border border-[#EAE1D7] bg-white shadow-[0_20px_70px_rgba(16,22,31,0.06)] lg:grid-cols-[0.85fr_1.15fr]">
              {/* NAVIGATION */}
              <div className="border-b border-[#EAE1D7] p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#647084]">
                    Fonctionnalités
                  </span>

                  <span className="rounded-full bg-[#F3E9DC] px-3 py-1 text-xs font-semibold text-[#26364A]">
                    {String(features.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="space-y-2">
                  {features.map((feature, index) => {
                    const isActive = activeFeature === index;

                    return (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => setActiveFeature(index)}
                        aria-pressed={isActive}
                        className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 ${
                          isActive
                            ? "bg-[#10161F] text-white shadow-lg shadow-[#10161F]/10"
                            : "text-[#26364A] hover:bg-[#F7F4EF]"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                            isActive
                              ? "bg-[#D59344] text-[#10161F]"
                              : "bg-[#F3E9DC] text-[#647084]"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">
                            {feature.title}
                          </span>
                        </span>

                        <ArrowRight
                          size={17}
                          strokeWidth={1.8}
                          className={`shrink-0 transition-all duration-300 ${
                            isActive
                              ? "translate-x-0 text-[#D59344]"
                              : "-translate-x-1 text-[#A3AAB4] group-hover:translate-x-0 group-hover:text-[#D59344]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DÉTAIL DE LA FONCTIONNALITÉ */}
              <div className="relative flex min-h-[350px] flex-col justify-between overflow-hidden bg-[#10161F] p-7 text-white sm:p-10 lg:min-h-[480px] lg:p-14">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/[0.07]" />
                <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/[0.07]" />

                {selectedFeature && (
                  <div
                    key={selectedFeature.id}
                    className="relative animate-[featureEnter_450ms_ease-out]"
                  >
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D59344]">
                      <span className="h-2 w-2 rounded-full bg-[#D59344]" />
                      Fonctionnalité{" "}
                      {String(activeFeature + 1).padStart(2, "0")}
                    </span>

                    <h3 className="mt-10 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                      {selectedFeature.title}
                      <span className="text-[#D59344]">.</span>
                    </h3>

                    <p className="mt-6 max-w-lg whitespace-pre-line text-sm leading-8 text-white/65 sm:text-base">
                      {selectedFeature.description ||
                        "Découvrez cette fonctionnalité de la solution."}
                    </p>
                  </div>
                )}

                <div className="relative mt-12 flex items-center justify-between border-t border-white/15 pt-6">
                  <span className="text-xs tabular-nums text-white/45">
                    {String(activeFeature + 1).padStart(2, "0")} /{" "}
                    {String(features.length).padStart(2, "0")}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Fonctionnalité précédente"
                      onClick={() =>
                        setActiveFeature(
                          (activeFeature - 1 + features.length) %
                            features.length,
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F]"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <button
                      type="button"
                      aria-label="Fonctionnalité suivante"
                      onClick={() =>
                        setActiveFeature((activeFeature + 1) % features.length)
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D59344] text-[#10161F] transition hover:bg-white"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GALERIE */}
      {images.length > 0 && (
        <section
          id="galerie"
          className="bg-[#FBF7F1] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#EAE1D7] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#647084]">
                  <ImageIcon size={13} className="text-[#D59344]" />
                  En images
                </span>

                <h2 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-[#10161F] sm:text-5xl">
                  Un aperçu de la solution.
                </h2>
              </div>

              <p className="max-w-xs text-sm leading-7 text-[#647084]">
                Explorez les visuels de cette solution en cliquant sur les
                images.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
              {images.map((media, index) => {
                const layout = [
                  "lg:col-span-7",
                  "lg:col-span-5",
                  "lg:col-span-5",
                  "lg:col-span-7",
                ];

                return (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Agrandir l'image ${index + 1}`}
                    className={`group relative overflow-hidden rounded-[22px] bg-[#EAE1D7] text-left ${
                      layout[index % layout.length]
                    }`}
                  >
                    <div
                      className={`overflow-hidden ${
                        index % 3 === 0 ? "aspect-[5/4]" : "aspect-[4/3]"
                      }`}
                    >
                      <img
                        src={media.url}
                        alt={
                          media.caption ||
                          `Illustration de ${solutionName}`
                        }
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-[#10161F]/75 via-[#10161F]/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="max-w-[80%] text-sm font-medium text-white">
                        {media.caption || solutionName}
                      </span>

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#10161F] transition-transform duration-300 group-hover:scale-105">
                        <ZoomIn size={18} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* VIDÉOS */}
      {videos.length > 0 && (
        <section
          id="videos"
          className="bg-[#F3E9DC] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
        >
          <div className="mx-auto max-w-[1400px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EAE1D7] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#647084]">
              <Play size={13} className="text-[#D59344]" />
              En vidéo
            </span>

            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-[#10161F] sm:text-5xl">
              Découvrez-la en action.
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {videos.map((video) => (
                <figure
                  key={video.id}
                  className="overflow-hidden rounded-[22px] border border-[#EAE1D7] bg-[#10161F] shadow-[0_15px_45px_rgba(16,22,31,0.08)]"
                >
                  <video
                    src={video.url}
                    controls
                    preload="metadata"
                    className="aspect-video w-full object-contain"
                  >
                    Votre navigateur ne prend pas en charge la lecture vidéo.
                  </video>

                  {video.caption && (
                    <figcaption className="border-t border-white/10 px-5 py-4 text-sm text-white/70">
                      {video.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VISIONNEUSE */}
      {activeImage !== null && images[activeImage] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse d'image"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080B12]/95 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setActiveImage(null)}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F]"
          >
            <X size={21} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Image précédente"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F] sm:left-8"
            >
              <ArrowLeft size={19} />
            </button>
          )}

          <figure
            className="flex max-h-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={images[activeImage].url}
              alt={images[activeImage].caption || solutionName}
              className="max-h-[78vh] max-w-full rounded-lg object-contain"
            />

            {images[activeImage].caption && (
              <figcaption className="mt-5 text-center text-sm text-white/70">
                {images[activeImage].caption}
              </figcaption>
            )}

            <span className="mt-3 text-xs tabular-nums text-white/45">
              {String(activeImage + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </span>
          </figure>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Image suivante"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F] sm:right-8"
            >
              <ArrowRight size={19} />
            </button>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes featureEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[featureEnter_450ms_ease-out\\] {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}