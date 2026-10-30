import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getPublishedProjectBySlug } from "@/lib/data/projects";
import { Gallery, type GalleryImage } from "./project-client";
import {
  BeforeAfter,
  ChantierStory,
  Ruler,
  VideoItem,
  type StoryEntry,
} from "./story-client";

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

const statusLabels: Record<string, string> = {
  PLANNED: "Planifié",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  ON_HOLD: "En pause",
};

const statusDots: Record<string, string> = {
  COMPLETED: "bg-berem-success",
  IN_PROGRESS: "bg-berem-sand",
  PLANNED: "bg-berem-sand",
  ON_HOLD: "bg-berem-warning",
};

const formatDate = (date: Date, short = false) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: short ? "medium" : "long",
  }).format(date);

const clampProgress = (p: number) => Math.round(Math.min(100, Math.max(0, p)));

const isFile = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

function shorten(text: string, max = 160) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projet introuvable | BEREM",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${project.title} | BEREM`,
    description:
      shorten(project.description) ||
      `Découvrez la réalisation ${project.title} de BEREM, entreprise de génie civil et de construction.`,
  };
}

export default async function RealisationDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div
      className={`${display.variable} ${body.variable} font-[family-name:var(--font-body)]`}
    >
      <Suspense fallback={<RealisationLoading />}>
        <RealisationContent slug={slug} />
      </Suspense>
    </div>
  );
}

function RealisationLoading() {
  return (
    <main className="min-h-screen bg-berem-primary text-white">
      <div className="mx-auto max-w-6xl animate-pulse px-5 pt-40 sm:px-8">
        <div className="h-16 w-3/4 rounded-lg bg-white/10" />
        <div className="mt-6 h-4 w-1/2 rounded bg-white/10" />
        <div className="mt-24 h-14 rounded bg-white/10" />
      </div>
    </main>
  );
}

async function RealisationContent({ slug }: { slug: string }) {
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const status = project.status as string;
  const isDone = status === "COMPLETED";
  const isLive = status === "IN_PROGRESS" || isDone || status === "ON_HOLD";
  const progress = isDone ? 100 : clampProgress(project.progress);

  const images = project.media.filter((m) => m.type === "IMAGE");
  const videos = project.media.filter((m) => m.type === "VIDEO");

  /* Rapports classés du plus ancien au plus récent, quel que soit l’ordre de la requête */
  const when = (u: (typeof project.updates)[number]) =>
    u.publishedAt ?? u.eventDate;
  const chrono = [...project.updates].sort(
    (a, b) => when(a).getTime() - when(b).getTime(),
  );
  const latest = chrono[chrono.length - 1];

  const entries: StoryEntry[] = chrono.map((u) => ({
    id: u.id,
    title: u.title,
    description: u.description,
    progress: clampProgress(u.progress),
    date: formatDate(when(u), true),
    dateTime: when(u).toISOString(),
    stage: u.stage?.name ?? null,
    images: u.media
      .filter((m) => m.type === "IMAGE")
      .map((m) => ({
        id: m.id,
        url: m.url,
        caption: m.caption,
        alt: m.caption || u.title,
      })),
    videos: u.media
      .filter((m) => m.type === "VIDEO")
      .map((m) => ({
        id: m.id,
        url: m.url,
        caption: m.caption,
        isFile: isFile(m.url),
      })),
  }));

  /* Avant / maintenant : première et dernière photo de suivi, si dates différentes */
  const pics = entries.flatMap((e) =>
    e.images.map((img) => ({ url: img.url, date: e.date })),
  );
  const first = pics[0];
  const last = pics[pics.length - 1];
  const canCompare =
    !!first && !!last && first.date !== last.date && first.url !== last.url;

  const cover = images[0]?.url ?? last?.url;

  const galleryImages: GalleryImage[] = images.map((m) => ({
    id: m.id,
    url: m.url,
    caption: m.caption,
    alt: m.caption || project.title,
  }));

  const cell = "bg-berem-primary/85 p-4";
  const cellLabel = "text-xs text-white/60";
  const cellValue = "mt-1 font-semibold";

  let section = 0;
  const num = () => String(++section).padStart(2, "0");

  return (
    <>
      {/* ───────── HERO : photo + trame de plan + fiche chantier ───────── */}
      <header className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-berem-primary text-white">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-30 h-full w-full object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-t from-berem-primary via-berem-primary/75 to-berem-primary/30"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />

        <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-32 sm:px-8 sm:pb-14">
          <Link
            href="/realisations"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span aria-hidden="true">←</span> Toutes les réalisations
          </Link>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-8 text-white/85 sm:text-lg">
                {project.description}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/25 bg-white/25 text-sm backdrop-blur-sm">
              <div className={`${cell} col-span-2`}>
                <dt className={cellLabel}>Localisation</dt>
                <dd className={cellValue}>{project.location}</dd>
              </div>
              <div className={cell}>
                <dt className={cellLabel}>Statut</dt>
                <dd className={`${cellValue} flex items-center gap-2`}>
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${statusDots[status] ?? "bg-berem-muted"}`}
                  />
                  {statusLabels[status] ?? "À confirmer"}
                </dd>
              </div>
              <div className={cell}>
                <dt className={cellLabel}>Démarrage</dt>
                <dd className={cellValue}>
                  {project.startDate ? (
                    <time dateTime={project.startDate.toISOString()}>
                      {formatDate(project.startDate, true)}
                    </time>
                  ) : (
                    "À venir"
                  )}
                </dd>
              </div>
              {latest?.stage?.name && (
                <div className={`${cell} col-span-2`}>
                  <dt className={cellLabel}>Étape actuelle</dt>
                  <dd className={cellValue}>{latest.stage.name}</dd>
                </div>
              )}
              {latest && (
                <div className={`${cell} col-span-2`}>
                  <dt className={cellLabel}>Dernière mise à jour</dt>
                  <dd className={cellValue}>
                    <time dateTime={when(latest).toISOString()}>
                      {formatDate(when(latest))}
                    </time>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {isLive && (
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-10">
              <p className="font-[family-name:var(--font-display)] text-6xl font-extrabold leading-none tabular-nums sm:text-7xl">
                {progress}
                <span className="ml-1 text-3xl text-berem-sand">%</span>
              </p>
              <div className="flex-1">
                <Ruler value={progress} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="bg-background text-foreground">
        <div className="mx-auto max-w-6xl space-y-24 px-5 py-20 sm:px-8 lg:space-y-32 lg:py-28">
          {/* ───────── AVANT / MAINTENANT ───────── */}
          {canCompare && (
            <section aria-labelledby="avant-apres">
              <p className="font-mono text-sm text-berem-muted">{num()}</p>
              <h2
                id="avant-apres"
                className="mt-2 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight text-berem-primary sm:text-6xl"
              >
                Ce qui a changé depuis le début
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-berem-muted">
                Faites glisser pour comparer la première et la dernière photo
                de suivi du chantier.
              </p>
              <div className="mt-8">
                <BeforeAfter
                  before={first.url}
                  after={last.url}
                  beforeLabel={first.date}
                  afterLabel={last.date}
                  alt={project.title}
                />
              </div>
            </section>
          )}

          {/* ───────── LE CHANTIER, ÉTAPE PAR ÉTAPE ───────── */}
          {entries.length > 0 && (
            <section aria-labelledby="journal">
              <p className="font-mono text-sm text-berem-muted">{num()}</p>
              <h2
                id="journal"
                className="mt-2 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight text-berem-primary sm:text-6xl"
              >
                Le chantier, étape par étape
              </h2>
              <p className="mb-12 mt-4 max-w-xl leading-7 text-berem-muted">
                Faites défiler : l’avancement évolue à chaque rapport, du
                démarrage jusqu’à aujourd’hui.
              </p>
              <ChantierStory entries={entries} />
            </section>
          )}

          {/* ───────── GALERIE ───────── */}
          <section aria-labelledby="galerie">
            <p className="font-mono text-sm text-berem-muted">{num()}</p>
            <h2
              id="galerie"
              className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight text-berem-primary sm:text-6xl"
            >
              Le projet en images
            </h2>

            {galleryImages.length > 0 ? (
              <div className="mt-10">
                <Gallery images={galleryImages} layout="masonry" />
              </div>
            ) : (
              <p className="mt-8 rounded-2xl border border-berem-border bg-berem-surface-elevated p-6 leading-7 text-berem-muted">
                Les photos de ce projet seront ajoutées prochainement.
              </p>
            )}

            {videos.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {videos.map((v) => (
                  <VideoItem
                    key={v.id}
                    video={{
                      id: v.id,
                      url: v.url,
                      caption: v.caption,
                      isFile: isFile(v.url),
                    }}
                    label={`Vidéo du projet ${project.title}`}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ───────── APPEL À L’ACTION ───────── */}
        <section className="bg-berem-sand px-5 py-20 text-berem-primary sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="max-w-4xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Un projet comme celui-ci ?<br />
              Construisons-le ensemble.
            </h2>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/devis"
                className="inline-flex items-center gap-3 rounded-full bg-berem-primary px-8 py-4 font-bold text-white transition hover:bg-berem-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berem-primary"
              >
                Demander un devis <span aria-hidden="true">→</span>
              </Link>
              <p className="max-w-sm leading-7 text-berem-primary/80">
                Décrivez votre besoin : nous revenons vers vous avec une
                première estimation.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}