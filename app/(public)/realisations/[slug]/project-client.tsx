"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type GalleryImage = {
  id: string;
  url: string;
  caption?: string | null;
  alt: string;
};

/* Barre de progression qui se remplit à l’arrivée sur la page */
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
        className="h-full rounded-full bg-[#F59E0B] transition-[width] duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/* Barre flottante : apparaît quand on quitte l’en-tête */
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
      className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0B1F33]/90 backdrop-blur transition-transform duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 text-white">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</p>
        <div className="hidden w-48 items-center gap-3 sm:flex">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#F59E0B]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold tabular-nums">{progress}%</span>
        </div>
        <Link
          href="/devis"
          tabIndex={visible ? 0 : -1}
          className="rounded-full bg-[#F59E0B] px-4 py-2 text-sm font-bold text-[#0B1F33] transition hover:bg-amber-300"
        >
          Demander un devis
        </Link>
      </div>
    </div>
  );
}

/* Galerie + visionneuse plein écran (clavier : ← → Échap) */
export function Gallery({
  images,
  layout = "masonry",
}: {
  images: GalleryImage[];
  layout?: "masonry" | "grid" | "story";
}) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, next, prev]);

  const current = index === null ? null : images[index];

  return (
    <>
      <div
        className={
          layout === "masonry"
            ? "columns-1 gap-4 sm:columns-2 lg:columns-3 [&>button]:mb-4"
            : layout === "story"
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 [&>button:first-child]:col-span-2 sm:[&>button:first-child]:col-span-3"
              : "grid grid-cols-2 gap-3 sm:grid-cols-3"
        }
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative block w-full overflow-hidden rounded-xl bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F59E0B]"
            aria-label={`Agrandir : ${img.caption || img.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt}
              loading="lazy"
              className={`w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none ${
                layout === "masonry"
                  ? ""
                  : layout === "story" && i === 0
                    ? "aspect-[16/9]"
                    : "aspect-[4/3]"
              }`}
            />
            {img.caption && layout === "masonry" && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-left text-sm text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse photo"
          className="fixed inset-0 z-50 flex flex-col bg-[#06131F]/95 backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex items-center justify-between p-4 text-white">
            <p className="text-sm tabular-nums text-slate-300">
              {(index ?? 0) + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={close}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
            >
              Fermer
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Photo précédente"
                className="absolute left-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
              >
                ‹
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.alt}
              className="max-h-[78vh] max-w-full rounded-lg object-contain"
            />
            {images.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Photo suivante"
                className="absolute right-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
              >
                ›
              </button>
            )}
          </div>

          <p className="min-h-16 p-5 text-center text-sm text-slate-300">
            {current.caption}
          </p>
        </div>
      )}
    </>
  );
}