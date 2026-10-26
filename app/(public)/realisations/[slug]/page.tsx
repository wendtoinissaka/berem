import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getPublishedProjectBySlug } from "@/lib/data/projects";
import {
  AnimatedBar,
  Gallery,
  StickyProjectBar,
  type GalleryImage,
} from "./project-client";

export const instant = false;

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
});
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date, short = false) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: short ? "medium" : "long",
  }).format(date);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Terminé";
    case "IN_PROGRESS":
      return "En cours";
    case "PLANNED":
      return "Planifié";
    default:
      return "En pause";
  }
}

function clampProgress(progress: number) {
  return Math.round(Math.min(100, Math.max(0, progress)));
}

const isFile = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) return { title: "Projet introuvable | BEREM" };

  return {
    title: `${project.title} | BEREM`,
    description: project.description.slice(0, 160),
  };
}

export default async function RealisationDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className={`${display.variable} ${body.variable} font-[family-name:var(--font-body)]`}>
      <Suspense fallback={<RealisationLoading />}>
        <RealisationContent slug={slug} />
      </Suspense>
    </div>
  );
}

function RealisationLoading() {
  return (
    <main className="min-h-screen bg-[#0B1F33]">
      <div className="mx-auto max-w-6xl animate-pulse px-5 pt-40">
        <div className="h-12 w-2/3 rounded bg-white/10" />
        <div className="mt-6 h-4 w-1/2 rounded bg-white/10" />
        <div className="mt-24 h-24 rounded-2xl bg-white/10" />
      </div>
    </main>
  );
}

async function RealisationContent({ slug }: { slug: string }) {
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const isDone = project.status === "COMPLETED";
  const isLive = project.status === "IN_PROGRESS" || isDone;
  const progress = isDone ? 100 : clampProgress(project.progress);

  const images = project.media.filter((m) => m.type === "IMAGE");
  const videos = project.media.filter((m) => m.type === "VIDEO");
  const latest = project.updates[0];

  const cover =
    images[0]?.url ??
    project.updates
      .flatMap((u) => u.media)
      .find((m) => m.type === "IMAGE")?.url;

  const galleryImages: GalleryImage[] = images.map((img) => ({
    id: img.id,
    url: img.url,
    caption: img.caption,
    alt: img.caption || project.title,
  }));

  const dot = isDone
    ? "bg-emerald-400"
    : project.status === "IN_PROGRESS"
      ? "bg-[#F59E0B]"
      : "bg-slate-400";

  return (
    <>
      <StickyProjectBar title={project.title} progress={progress} />

      {/* ───────── HERO immersif ───────── */}
      <header className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-[#0B1F33] text-white">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0B1F33] via-[#0B1F33]/70 to-[#0B1F33]/20" />

        <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-32 sm:px-8 lg:pb-14">
          <Link
            href="/realisations"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20"
          >
            <span aria-hidden>←</span> Toutes les réalisations
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 font-semibold backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                {project.status === "IN_PROGRESS" && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E0B] opacity-70 motion-reduce:hidden" />
                )}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`} />
              </span>
              {getStatusLabel(project.status)}
            </span>
            <span className="text-slate-300">{project.location}</span>
          </div>

          <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            {project.description}
          </p>

          {/* Tableau de bord du chantier */}
          <div className="mt-10 grid gap-6 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:p-7">
            {isLive ? (
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-6xl font-extrabold tabular-nums">
                  {progress}
                </span>
                <span className="text-2xl font-bold text-[#F59E0B]">%</span>
                <span className="ml-1 text-sm text-slate-300">
                  {isDone ? "livré" : "réalisé"}
                </span>
              </div>
            ) : (
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
                Démarrage à venir
              </p>
            )}

            <div>
              {isLive && (
                <AnimatedBar
                  value={progress}
                  label="Avancement du chantier"
                  className="h-3"
                />
              )}
              <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-2 text-sm">
                <div>
                  <dt className="text-slate-300">Démarrage</dt>
                  <dd className="font-semibold">
                    {project.startDate
                      ? formatDate(project.startDate)
                      : "Non renseigné"}
                  </dd>
                </div>
                {latest && (
                  <div>
                    <dt className="text-slate-300">Dernière mise à jour</dt>
                    <dd className="font-semibold">
                      {formatDate(latest.publishedAt ?? latest.eventDate)}
                    </dd>
                  </div>
                )}
                {latest?.stage?.name && (
                  <div>
                    <dt className="text-slate-300">Étape actuelle</dt>
                    <dd className="font-semibold">{latest.stage.name}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-[#F6F4EF] text-[#0B1F33]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          {/* ───────── JOURNAL DU CHANTIER (chronologie) ───────── */}
          {project.updates.length > 0 && (
            <section aria-labelledby="journal">
              <h2
                id="journal"
                className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-5xl"
              >
                Suivez le chantier, étape par étape
              </h2>
              <p className="mt-4 max-w-xl text-slate-600">
                Chaque rapport publié par l’équipe, du plus récent au plus
                ancien. Ouvrez un rapport pour voir le détail et les photos.
              </p>

              <ol className="relative mt-14 space-y-6 border-l-2 border-slate-300 pl-6 sm:pl-10">
                {project.updates.map((update, i) => {
                  const imgs: GalleryImage[] = update.media
                    .filter((m) => m.type === "IMAGE")
                    .map((m) => ({
                      id: m.id,
                      url: m.url,
                      caption: m.caption,
                      alt: m.caption || update.title,
                    }));
                  const vids = update.media.filter((m) => m.type === "VIDEO");
                  const pct = clampProgress(update.progress);

                  return (
                    <li key={update.id} className="relative">
                      <span
                        aria-hidden
                        className={`absolute -left-[33px] top-6 grid h-4 w-4 place-items-center rounded-full ring-4 ring-[#F6F4EF] sm:-left-[49px] ${
                          i === 0 ? "bg-[#F59E0B]" : "bg-[#0B1F33]"
                        }`}
                      />

                      <details
                        open={i === 0}
                        className="group overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(11,31,51,.06),0_12px_32px_-16px_rgba(11,31,51,.25)]"
                      >
                        <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                          <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-center gap-x-3 text-sm text-slate-500">
                              <time>
                                {formatDate(
                                  update.publishedAt ?? update.eventDate,
                                  true
                                )}
                              </time>
                              {update.stage?.name && (
                                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                  {update.stage.name}
                                </span>
                              )}
                              {i === 0 && (
                                <span className="rounded-full bg-[#0B1F33] px-2.5 py-0.5 text-xs font-semibold text-white">
                                  Nouveau
                                </span>
                              )}
                            </p>
                            <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-bold sm:text-2xl">
                              {update.title}
                            </h3>
                          </div>

                          <div className="hidden w-32 shrink-0 sm:block">
                            <p className="text-right text-sm font-bold tabular-nums">
                              {pct}%
                            </p>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-[#F59E0B]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          <span
                            aria-hidden
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-lg transition group-open:rotate-45 motion-reduce:transition-none"
                          >
                            +
                          </span>
                        </summary>

                        <div className="border-t border-slate-100 p-5 sm:p-6">
                          <p className="max-w-2xl whitespace-pre-line leading-8 text-slate-700">
                            {update.description}
                          </p>

                          {imgs.length > 0 && (
                            <div className="mt-6">
                              <Gallery images={imgs} layout="grid" />
                            </div>
                          )}

                          {vids.length > 0 && (
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                              {vids.map((v) =>
                                isFile(v.url) ? (
                                  <video
                                    key={v.id}
                                    src={v.url}
                                    controls
                                    preload="metadata"
                                    className="w-full rounded-xl bg-black"
                                  />
                                ) : (
                                  <a
                                    key={v.id}
                                    href={v.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl bg-slate-100 p-4 font-semibold transition hover:bg-amber-100"
                                  >
                                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0B1F33] text-white">
                                      ▶
                                    </span>
                                    {v.caption || "Regarder la vidéo"}
                                  </a>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {/* ───────── GALERIE ───────── */}
          <section
            aria-labelledby="galerie"
            className={project.updates.length > 0 ? "mt-24 lg:mt-32" : ""}
          >
            <h2
              id="galerie"
              className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-5xl"
            >
              Le projet en images
            </h2>

            {galleryImages.length > 0 ? (
              <div className="mt-10">
                <Gallery images={galleryImages} layout="masonry" />
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-white p-6 text-slate-600">
                Les photos de ce projet seront ajoutées prochainement.
              </p>
            )}

            {videos.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {videos.map((v) =>
                  isFile(v.url) ? (
                    <video
                      key={v.id}
                      src={v.url}
                      controls
                      preload="metadata"
                      className="w-full rounded-xl bg-black"
                    />
                  ) : (
                    <a
                      key={v.id}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white p-4 font-semibold transition hover:bg-amber-100"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0B1F33] text-white">
                        ▶
                      </span>
                      {v.caption || "Regarder la vidéo du projet"}
                    </a>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        {/* ───────── APPEL À L’ACTION ───────── */}
        <section className="bg-[#0B1F33] px-5 py-20 text-white sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="max-w-xl font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight sm:text-4xl">
                Un projet comme celui-ci ? Parlons-en.
              </h2>
              <p className="mt-3 max-w-lg text-slate-300">
                Décrivez votre besoin : notre équipe vous répond avec une
                première estimation.
              </p>
            </div>
            <Link
              href="/devis"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F59E0B] px-8 py-4 text-lg font-bold text-[#0B1F33] transition hover:bg-amber-300"
            >
              Demander un devis
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}