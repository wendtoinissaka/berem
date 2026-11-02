"use client";

import { useEffect, useRef, useState } from "react";

import { Gallery, type GalleryImage } from "./project-client";

export type StoryVideo = {
  id: string;
  url: string;
  caption: string | null;
  isFile: boolean;
};

export type StoryEntry = {
  id: string;
  title: string;
  description: string;
  progress: number;
  date: string;
  dateTime: string;
  stage: string | null;
  images: GalleryImage[];
  videos: StoryVideo[];
};

/* ─── Règle de chantier : l’avancement se lit comme un mètre ruban ─── */
export function Ruler({
  value,
  label = "Avancement du chantier",
}: {
  value: number;
  label?: string;
}) {
  const [w, setW] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setW(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const move =
    "transition-[width,left] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="relative h-14 select-none"
    >
      <div className="absolute inset-x-0 top-0 h-4 rounded-sm bg-white/15" />
      <div
        className={`absolute left-0 top-0 h-4 rounded-sm bg-berem-sand ${move}`}
        style={{ width: `${w}%` }}
      />
      {Array.from({ length: 21 }, (_, i) => (
        <span key={i}>
          <span
            aria-hidden="true"
            className={`absolute top-4 w-px bg-white/50 ${i % 2 === 0 ? "h-3" : "h-1.5"}`}
            style={{ left: `${i * 5}%` }}
          />
          {i % 5 === 0 && (
            <span
              aria-hidden="true"
              className={`absolute top-8 text-[11px] tabular-nums text-white/60 ${
                i === 0 ? "" : i === 20 ? "-translate-x-full" : "-translate-x-1/2"
              }`}
              style={{ left: `${i * 5}%` }}
            >
              {i * 5}
            </span>
          )}
        </span>
      ))}
      <div
        aria-hidden="true"
        className={`absolute -top-1.5 h-7 w-0.5 bg-white ${move}`}
        style={{ left: `${w}%` }}
      />
    </div>
  );
}

export function VideoItem({
  video,
  label,
}: {
  video: StoryVideo;
  label: string;
}) {
  const text = video.caption || label;

  return video.isFile ? (
    <video
      src={video.url}
      controls
      preload="metadata"
      aria-label={text}
      className="w-full rounded-xl border border-berem-border bg-black"
    />
  ) : (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-berem-border bg-berem-surface p-4 font-semibold text-berem-primary transition hover:border-berem-olive hover:bg-berem-olive-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berem-olive"
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-berem-primary text-white"
      >
        ▶
      </span>
      {text}
    </a>
  );
}

/* ─── Avant / maintenant : glisser (ou flèches du clavier) ─── */
export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  alt,
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const chip =
    "absolute bottom-4 rounded-full bg-berem-primary/80 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur";

  return (
    <div className="relative aspect-[4/3] select-none overflow-hidden rounded-2xl bg-berem-primary sm:aspect-[16/9]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={`${alt} - état actuel`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={`${alt} - début du chantier`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <span className={`${chip} left-4`}>{beforeLabel}</span>
      <span className={`${chip} right-4`}>{afterLabel}</span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.15)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-berem-primary shadow-lg">
          ↔
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparer le début du chantier et son état actuel"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

/* ─── Le chantier jour après jour : l’avancement suit le défilement ─── */
export function ChantierStory({ entries }: { entries: StoryEntry[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (list) => {
        for (const e of list) {
          if (e.isIntersecting) {
            setActive(Number(e.target.getAttribute("data-i")));
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [entries.length]);

  const current = entries[active] ?? entries[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
      <aside className="sticky top-0 z-20 -mx-5 self-start sm:-mx-8 lg:top-24 lg:mx-0">
        <div className="bg-berem-primary p-4 text-white shadow-xl sm:px-8 lg:rounded-2xl lg:p-6">
          <div className="flex items-end justify-between gap-4 lg:block">
            <p className="font-semibold text-4xl font-extrabold tabular-nums lg:text-7xl">
              {current.progress}
              <span className="ml-1 text-2xl text-berem-sand lg:text-4xl">%</span>
            </p>
            <p className="text-right text-sm leading-6 text-white/70 lg:mt-2 lg:text-left">
              {current.date}
              {current.stage && (
                <>
                  <br className="hidden lg:block" />
                  <span className="lg:block"> · {current.stage}</span>
                </>
              )}
            </p>
          </div>

          <div className="mt-3 lg:mt-6">
            <Ruler value={current.progress} label="Avancement à cette date" />
          </div>

          {entries.length > 1 && (
            <button
              type="button"
              onClick={() =>
                refs.current[entries.length - 1]?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="mt-2 hidden text-sm font-semibold text-berem-sand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:block"
            >
              Aller à la dernière mise à jour ↓
            </button>
          )}
        </div>
      </aside>

      <ol className="space-y-20">
        {entries.map((entry, i) => (
          <li
            key={entry.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-i={i}
            className={`scroll-mt-28 transition-opacity duration-500 motion-reduce:transition-none ${
              i === active ? "opacity-100" : "opacity-70"
            }`}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-berem-muted">
              <span className="font-mono text-berem-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <time dateTime={entry.dateTime}>{entry.date}</time>
              {entry.stage && (
                <span className="rounded-full bg-berem-sand-soft px-2.5 py-1 text-xs font-semibold text-berem-primary">
                  {entry.stage}
                </span>
              )}
            </div>

            <h3 className="mt-3 font-semibold text-2xl font-bold leading-tight text-berem-primary sm:text-4xl">
              {entry.title}
            </h3>

            <p className="mt-4 max-w-2xl whitespace-pre-line leading-8 text-berem-muted">
              {entry.description}
            </p>

            {entry.images.length > 0 && (
              <div className="mt-7">
                <Gallery images={entry.images} layout="story" />
              </div>
            )}

            {entry.videos.length > 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {entry.videos.map((v) => (
                  <VideoItem key={v.id} video={v} label="Regarder la vidéo" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}