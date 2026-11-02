import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";

import { getPublishedProjectBySlug } from "@/lib/data/projects";
import {
  Gallery,
  ImageComparison,
  type GalleryImage,
} from "./project-client";
import {
  ChantierStory,
  Ruler,
  VideoItem,
  type StoryEntry,
} from "./story-client";

export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const statusLabels: Record<string, string> = {
  PLANNED: "Planifié",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  ON_HOLD: "En pause",
};

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-berem-success",
  IN_PROGRESS: "bg-berem-sand",
  PLANNED: "bg-berem-sand",
  ON_HOLD: "bg-berem-warning",
};

const formatDate = (date: Date, short = false) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: short ? "medium" : "long",
  }).format(date);

const clampProgress = (value: number) =>
  Math.round(Math.min(100, Math.max(0, value)));

const isFile = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

function shorten(text: string, max = 160) {
  const value = text.replace(/\s+/g, " ").trim();

  return value.length <= max
    ? value
    : `${value.slice(0, max - 1).trimEnd()}…`;
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

export default async function RealisationDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  return (
    <div className="font-sans">
      <Suspense fallback={<RealisationLoading />}>
        <RealisationContent slug={slug} />
      </Suspense>
    </div>
  );
}

function RealisationLoading() {
  return (
    <main className="min-h-screen bg-berem-primary">
      <div className="mx-auto max-w-6xl animate-pulse px-5 pb-20 pt-32 sm:px-8">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="mt-8 h-14 max-w-2xl rounded bg-white/10" />
        <div className="mt-5 h-4 max-w-xl rounded bg-white/10" />
        <div className="mt-12 h-64 rounded-xl bg-white/10" />
      </div>
    </main>
  );
}

async function RealisationContent({ slug }: { slug: string }) {
  const project = await getPublishedProjectBySlug(slug);

  if (!project) notFound();

  const status = project.status as string;
  const isDone = status === "COMPLETED";
  const isLive =
    status === "IN_PROGRESS" ||
    isDone ||
    status === "ON_HOLD";

  const progress = isDone ? 100 : clampProgress(project.progress);

  const images = project.media.filter((media) => media.type === "IMAGE");
  const videos = project.media.filter((media) => media.type === "VIDEO");

  const when = (update: (typeof project.updates)[number]) =>
    update.publishedAt ?? update.eventDate;

  const chrono = [...project.updates].sort(
    (a, b) => when(a).getTime() - when(b).getTime(),
  );

  const latest = chrono[chrono.length - 1];

  const entries: StoryEntry[] = chrono.map((update) => ({
    id: update.id,
    title: update.title,
    description: update.description,
    progress: clampProgress(update.progress),
    date: formatDate(when(update), true),
    dateTime: when(update).toISOString(),
    stage: update.stage?.name ?? null,
    images: update.media
      .filter((media) => media.type === "IMAGE")
      .map((media) => ({
        id: media.id,
        url: media.url,
        caption: media.caption,
        alt: media.caption || update.title,
      })),
    videos: update.media
      .filter((media) => media.type === "VIDEO")
      .map((media) => ({
        id: media.id,
        url: media.url,
        caption: media.caption,
        isFile: isFile(media.url),
      })),
  }));

  const pics = entries.flatMap((entry) =>
    entry.images.map((image) => ({
      url: image.url,
      date: entry.date,
      alt: image.alt,
    })),
  );

  const first = pics[0];
  const last = pics[pics.length - 1];

  const canCompare =
    !!first &&
    !!last &&
    first.date !== last.date &&
    first.url !== last.url;

  const cover = images[0]?.url ?? last?.url;

  const galleryImages: GalleryImage[] = images.map((media) => ({
    id: media.id,
    url: media.url,
    caption: media.caption,
    alt: media.caption || project.title,
  }));

  return (
    <>
      {/* HERO */}
      <header className="bg-berem-primary text-white">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
          <Link
            href="/realisations"
            className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <ArrowLeft size={16} />
            Toutes les réalisations
          </Link>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium">
                  <span
                    className={`h-2 w-2 rounded-full ${statusStyles[status] ?? "bg-white/40"}`}
                  />
                  {statusLabels[status] ?? "Statut à confirmer"}
                </span>

                {project.location && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-white/65">
                    <MapPin size={15} />
                    {project.location}
                  </span>
                )}
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-berem-sand">
                Nos réalisations
              </p>

              <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>

              <p className="mt-5 max-w-xl whitespace-pre-line text-base leading-7 text-white/70">
                {project.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 border-t border-white/15 pt-6">
                <div>
                  <p className="flex items-center gap-2 text-xs text-white/45">
                    <CalendarDays size={14} />
                    Démarrage
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {project.startDate
                      ? formatDate(project.startDate, true)
                      : "À venir"}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-xs text-white/45">
                    <Clock3 size={14} />
                    Dernière actualité
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {latest
                      ? formatDate(when(latest), true)
                      : "Non disponible"}
                  </p>
                </div>
              </div>
            </div>

            {cover ? (
              <div className="relative">
                <div className="overflow-hidden rounded-xl bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={`Vue du projet ${project.title}`}
                    className="aspect-[5/4] w-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-white/10 bg-berem-primary/95 px-4 py-3 shadow-xl backdrop-blur sm:left-7 sm:right-7">
                  <span className="text-xs text-white/65">
                    Réalisation BEREM
                  </span>
                  <span className="text-xs font-semibold text-berem-sand">
                    {statusLabels[status] ?? "Projet"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex aspect-[5/4] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-white/45">
                Photo du projet à venir
              </div>
            )}
          </div>

          {/* Progression */}
          {isLive && (
            <div className="mt-16 max-w-3xl border-t border-white/15 pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/55">
                    Avancement du projet
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums">
                    {progress}
                    <span className="ml-1 text-lg text-berem-sand">%</span>
                  </p>
                </div>

                {latest?.stage?.name && (
                  <p className="max-w-[50%] text-right text-sm text-white/65">
                    {latest.stage.name}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <Ruler value={progress} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="bg-background text-foreground">
        <div className="mx-auto max-w-6xl space-y-20 px-5 py-16 sm:px-8 sm:py-20 lg:space-y-24 lg:py-24">
          {/* ÉVOLUTION DU CHANTIER */}
          {canCompare && (
            <section aria-labelledby="evolution">
              <SectionHeading
                number="01"
                eyebrow="Évolution du projet"
                title="Du début à aujourd'hui"
                description="Voici un aperçu de l'évolution du chantier entre les premières interventions et la dernière étape documentée."
              />

              <div className="mt-7">
                <ImageComparison
                  before={{
                    id: "project-start",
                    url: first.url,
                    alt: first.alt,
                    caption: "Début du chantier",
                  }}
                  after={{
                    id: "project-latest",
                    url: last.url,
                    alt: last.alt,
                    caption: "Dernière étape",
                  }}
                />
              </div>
            </section>
          )}

          {/* JOURNAL */}
          {entries.length > 0 && (
            <section aria-labelledby="journal">
              <SectionHeading
                number={canCompare ? "02" : "01"}
                eyebrow="Suivi des travaux"
                title="Le chantier, étape par étape"
                description="Consultez les différentes étapes du projet et découvrez les avancées au fil des interventions."
              />

              <div className="mt-8">
                <ChantierStory entries={entries} />
              </div>
            </section>
          )}

          {/* GALERIE */}
          <section aria-labelledby="galerie">
            <SectionHeading
              number={
                canCompare
                  ? "03"
                  : entries.length > 0
                    ? "02"
                    : "01"
              }
              eyebrow="Galerie photographique"
              title="Le projet en images"
              description="Parcourez les images de cette réalisation. Sélectionnez une photo pour l'afficher en grand et examiner les détails."
            />

            {galleryImages.length > 0 ? (
              <div className="mt-8">
                <Gallery images={galleryImages} layout="masonry" />
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-berem-border bg-berem-surface-elevated px-6 py-10 text-center">
                <p className="font-semibold text-berem-primary">
                  Galerie bientôt disponible
                </p>
                <p className="mt-2 text-sm text-berem-muted">
                  Les photos de ce projet seront ajoutées prochainement.
                </p>
              </div>
            )}
          </section>

          {/* VIDÉOS */}
          {videos.length > 0 && (
            <section aria-labelledby="videos">
              <SectionHeading
                number={
                  canCompare
                    ? "04"
                    : entries.length > 0
                      ? "03"
                      : "02"
                }
                eyebrow="Contenus vidéo"
                title="Le projet en mouvement"
                description="Découvrez des séquences vidéo qui illustrent les travaux et les différentes interventions."
              />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {videos.map((video) => (
                  <VideoItem
                    key={video.id}
                    video={{
                      id: video.id,
                      url: video.url,
                      caption: video.caption,
                      isFile: isFile(video.url),
                    }}
                    label={`Vidéo du projet ${project.title}`}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* CTA */}
        <section className="bg-berem-surface px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-berem-muted">
                Votre projet commence ici
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-berem-primary sm:text-4xl lg:text-5xl">
                Vous avez un projet de construction ?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-berem-muted sm:text-base">
                Présentez-nous votre besoin. Notre équipe pourra étudier
                votre projet et vous accompagner dans sa réalisation.
              </p>
            </div>

            <Link
              href="/devis"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-berem-primary px-7 py-4 text-sm font-semibold text-white transition hover:bg-berem-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berem-primary"
            >
              Demander un devis
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function SectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-berem-border pb-6 sm:flex-row sm:gap-8">
      <span className="pt-1 text-sm font-semibold tabular-nums text-berem-orange">
        {number}
      </span>

      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-berem-muted">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-berem-primary sm:text-4xl">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-berem-muted sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}