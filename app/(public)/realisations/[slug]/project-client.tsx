"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";

export type GalleryImage = {
  id: string;
  url: string;
  caption?: string | null;
  alt: string;
};

const SLIDE_DURATION = 6000;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 17;

/* =========================================================
   BARRE DE PROGRESSION
========================================================= */

export function AnimatedBar({
  value,
  label,
  className = "h-3",
}: {
  value: number;
  label: string;
  className?: string;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={`overflow-hidden rounded-full bg-white/15 ${className}`}
    >
      <div
        className="h-full rounded-full bg-berem-sand transition-[width] duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/* =========================================================
   BARRE FIXE DU PROJET
========================================================= */

export function StickyProjectBar({
  title,
  progress,
}: {
  title: string;
  progress: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-berem-primary/95 backdrop-blur transition-transform duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 text-white">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">
          {title}
        </p>

        <div className="hidden w-48 items-center gap-3 sm:flex">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-berem-sand"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-sm font-bold tabular-nums">
            {progress}%
          </span>
        </div>

        <Link
          href="/devis"
          tabIndex={visible ? 0 : -1}
          className="rounded-full bg-berem-sand px-4 py-2 text-sm font-bold text-berem-primary transition hover:bg-berem-sand/80"
        >
          Demander un devis
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   GALERIE / CARROUSEL
========================================================= */

export function Gallery({
  images,
  layout = "masonry",
}: {
  images: GalleryImage[];
  layout?: "masonry" | "grid" | "story";
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  const hasMultipleImages = images.length > 1;

  const nextSlide = useCallback(() => {
    setActiveSlide((current) => (current + 1) % images.length);
  }, [images.length]);

  const previousSlide = useCallback(() => {
    setActiveSlide(
      (current) => (current - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveSlide(index);
      elapsedRef.current = 0;
      startTimeRef.current = null;
      setTimerProgress(0);
    },
    [],
  );

  const handleNextSlide = useCallback(() => {
    goToSlide((activeSlide + 1) % images.length);
  }, [activeSlide, images.length, goToSlide]);

  const handlePreviousSlide = useCallback(() => {
    goToSlide((activeSlide - 1 + images.length) % images.length);
  }, [activeSlide, images.length, goToSlide]);

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsPlaying(false);
  };

  const closeViewer = useCallback(() => {
    setViewerIndex(null);
  }, []);

  const nextViewerImage = useCallback(() => {
    setViewerIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  }, [images.length]);

  const previousViewerImage = useCallback(() => {
    setViewerIndex((current) =>
      current === null
        ? null
        : (current - 1 + images.length) % images.length,
    );
  }, [images.length]);

  // Lecture automatique avec compte à rebours circulaire.
  useEffect(() => {
    if (
      layout !== "masonry" ||
      !hasMultipleImages ||
      !isPlaying
    ) {
      startTimeRef.current = null;
      return;
    }

    let animationFrame = 0;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed =
        elapsedRef.current + (timestamp - startTimeRef.current);

      const progress = Math.min(elapsed / SLIDE_DURATION, 1);

      setTimerProgress(progress);

      if (progress >= 1) {
        elapsedRef.current = 0;
        startTimeRef.current = timestamp;
        setTimerProgress(0);
        nextSlide();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);

      if (startTimeRef.current !== null) {
        elapsedRef.current += performance.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
    };
  }, [layout, hasMultipleImages, isPlaying, nextSlide]);

  // Respect de la préférence de réduction des animations.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsPlaying(false);
    }
  }, []);

  // Éviter les erreurs d'index si les images changent.
  useEffect(() => {
    if (activeSlide >= images.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, images.length]);

  if (images.length === 0) return null;

  const activeImage = images[activeSlide];

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <div
          className="relative overflow-hidden rounded-xl bg-berem-primary"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null || !hasMultipleImages) return;

            const delta =
              (event.changedTouches[0]?.clientX ?? touchStartX.current) -
              touchStartX.current;

            if (Math.abs(delta) > 45) {
              delta < 0 ? handleNextSlide() : handlePreviousSlide();
            }

            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            onClick={() => openViewer(activeSlide)}
            aria-label={`Agrandir : ${activeImage.caption || activeImage.alt}`}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-berem-primary text-left sm:aspect-[16/9]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeImage.id}
              src={activeImage.url}
              alt={activeImage.alt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
            />

            <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition group-hover:bg-black/55">
              <Expand size={17} />
            </span>

            {activeImage.caption && (
              <span className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white sm:bottom-7 sm:left-7">
                {activeImage.caption}
              </span>
            )}
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={handlePreviousSlide}
                aria-label="Photo précédente"
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5 sm:h-11 sm:w-11"
              >
                <ChevronLeft size={23} />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Photo suivante"
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5 sm:h-11 sm:w-11"
              >
                <ChevronRight size={23} />
              </button>
            </>
          )}

          <div className="flex min-h-14 items-center justify-between gap-4 bg-berem-primary px-4 py-3 text-white sm:px-6">
            <p className="text-xs tabular-nums text-white/60">
              <span className="font-bold text-white">
                {String(activeSlide + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(images.length).padStart(2, "0")}
            </p>

            <div className="flex items-center gap-3">
              {hasMultipleImages && (
                <div className="flex items-center gap-1.5">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => goToSlide(index)}
                      aria-label={`Afficher la photo ${index + 1}`}
                      aria-current={activeSlide === index ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlide === index
                          ? "w-6 bg-berem-sand"
                          : "w-1.5 bg-white/35 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}

              {layout === "masonry" && hasMultipleImages && (
                <button
                  type="button"
                  onClick={() => setIsPlaying((value) => !value)}
                  aria-label={
                    isPlaying
                      ? "Mettre le carrousel en pause"
                      : "Activer le défilement automatique"
                  }
                  aria-pressed={isPlaying}
                  className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <svg
                    viewBox="0 0 40 40"
                    className="absolute inset-0 h-full w-full -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-white/20"
                    />

                    <circle
                      cx="20"
                      cy="20"
                      r="17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={CIRCLE_CIRCUMFERENCE}
                      strokeDashoffset={
                        CIRCLE_CIRCUMFERENCE * (1 - timerProgress)
                      }
                      className="text-berem-sand"
                    />
                  </svg>

                  <span className="relative">
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-berem-muted">
          Sélectionnez une image pour l'agrandir.
        </p>
      </div>

      {viewerIndex !== null && (
        <ImageViewer
          images={images}
          index={viewerIndex}
          onClose={closeViewer}
          onNext={nextViewerImage}
          onPrevious={previousViewerImage}
        />
      )}
    </>
  );
}

/* =========================================================
   COMPARAISON AVANT / APRÈS
========================================================= */

export function ImageComparison({
  before,
  after,
}: {
  before: GalleryImage;
  after: GalleryImage;
}) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const images = [before, after];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setViewerIndex(index)}
            className="group relative overflow-hidden rounded-xl bg-berem-primary text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berem-orange"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
              />

              <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur">
                <Expand size={16} />
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-berem-primary px-4 py-3 text-white">
              <span className="text-sm font-semibold">
                {image.caption}
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-berem-sand"
              />
            </div>
          </button>
        ))}
      </div>

      {viewerIndex !== null && (
        <ImageViewer
          images={images}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNext={() =>
            setViewerIndex((index) =>
              index === null ? 0 : (index + 1) % 2,
            )
          }
          onPrevious={() =>
            setViewerIndex((index) =>
              index === null ? 0 : (index - 1 + 2) % 2,
            )
          }
        />
      )}
    </>
  );
}

/* =========================================================
   VISIONNEUSE AVEC ZOOM
========================================================= */

function ImageViewer({
  images,
  index,
  onClose,
  onNext,
  onPrevious,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const current = images[index];

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);

  const dragRef = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);

  const pinchRef = useRef<{
    distance: number;
    zoom: number;
  } | null>(null);

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(
    new Map(),
  );

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const changeZoom = useCallback((amount: number) => {
    setZoom((currentZoom) => {
      const next = Math.min(4, Math.max(1, currentZoom + amount));

      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }

      return next;
    });
  }, []);

  const clampPosition = useCallback(
    (x: number, y: number, scale = zoom) => {
      const image = imageRef.current;

      if (!image || scale <= 1) return { x: 0, y: 0 };

      const width = image.offsetWidth;
      const height = image.offsetHeight;

      const maxX = (width * (scale - 1)) / 2;
      const maxY = (height * (scale - 1)) / 2;

      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      };
    },
    [zoom],
  );

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.deltaY < 0) {
      changeZoom(0.25);
    } else {
      changeZoom(-0.25);
    }
  };

  // Navigation clavier et blocage du défilement.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (event.key === "ArrowRight" && zoom === 1) onNext();

      if (event.key === "ArrowLeft" && zoom === 1) onPrevious();

      if (event.key === "+" || event.key === "=") {
        setZoom((value) => Math.min(4, value + 0.25));
      }

      if (event.key === "-") {
        setZoom((value) => Math.max(1, value - 0.25));
      }

      if (event.key === "0") resetZoom();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onNext, onPrevious, resetZoom, zoom]);

  // Réinitialiser le zoom lors d'un changement d'image.
  useEffect(() => {
    resetZoom();
  }, [index, resetZoom]);

  const distanceBetween = (
    first: { x: number; y: number },
    second: { x: number; y: number },
  ) => Math.hypot(second.x - first.x, second.y - first.y);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointersRef.current.size === 2) {
      const points = [...pointersRef.current.values()];

      pinchRef.current = {
        distance: distanceBetween(points[0], points[1]),
        zoom,
      };

      dragRef.current = null;
      return;
    }

    if (zoom > 1) {
      dragRef.current = {
        x: event.clientX,
        y: event.clientY,
        startX: position.x,
        startY: position.y,
      };
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;

    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const points = [...pointersRef.current.values()];
      const distance = distanceBetween(points[0], points[1]);

      const nextZoom = Math.min(
        4,
        Math.max(
          1,
          pinchRef.current.zoom *
            (distance / pinchRef.current.distance),
        ),
      );

      setZoom(nextZoom);

      if (nextZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }

      return;
    }

    if (dragRef.current && zoom > 1) {
      const drag = dragRef.current;

      const x = drag.startX + event.clientX - drag.x;
      const y = drag.startY + event.clientY - drag.y;

      setPosition(clampPosition(x, y));
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);

    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
    }

    if (pointersRef.current.size === 0) {
      dragRef.current = null;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse de photos"
      className="fixed inset-0 z-[100] flex flex-col bg-[#07111B]/95 text-white backdrop-blur-md"
      onClick={onClose}
    >
      {/* Barre supérieure */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs text-white/50">
            Photographie {index + 1} sur {images.length}
          </p>

          <p className="mt-1 truncate text-sm font-medium">
            {current.caption || current.alt}
          </p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label="Fermer la visionneuse"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Zone image : le fond reste cliquable pour fermer */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 py-4 sm:px-12"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(event) => {
          event.stopPropagation();
          if (zoom > 1) {
            resetZoom();
          } else {
            setZoom(2);
          }
        }}
        style={{
          touchAction: zoom > 1 ? "none" : "pan-y",
        }}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPrevious();
            }}
            aria-label="Photo précédente"
            className="absolute left-2 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white transition hover:bg-white/15 sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={25} />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={current.url}
          alt={current.alt}
          draggable={false}
          onClick={(event) => event.stopPropagation()}
          className={`max-h-full max-w-full select-none object-contain ${
            zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: dragRef.current ? "none" : "transform 120ms ease-out",
          }}
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            aria-label="Photo suivante"
            className="absolute right-2 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white transition hover:bg-white/15 sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight size={25} />
          </button>
        )}
      </div>

      {/* Barre de commandes */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 px-4 py-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => changeZoom(-0.25)}
          disabled={zoom <= 1}
          aria-label="Dézoomer"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus size={18} />
        </button>

        <span className="min-w-14 text-center text-sm font-semibold tabular-nums">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={() => changeZoom(0.25)}
          disabled={zoom >= 4}
          aria-label="Zoomer"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={18} />
        </button>

        <button
          type="button"
          onClick={resetZoom}
          disabled={zoom === 1}
          aria-label="Réinitialiser le zoom"
          className="ml-2 inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-xs font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <RotateCcw size={14} />
          Réinitialiser
        </button>
      </div>

      <p className="pb-3 text-center text-[11px] text-white/40">
        Molette pour zoomer · Double-clic pour agrandir · Échap pour fermer
      </p>
    </div>
  );
}