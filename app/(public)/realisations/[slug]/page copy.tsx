import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getPublishedProjectBySlug } from "@/lib/data/projects";

export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
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
  return Math.min(100, Math.max(0, progress));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projet introuvable | BEREM",
    };
  }

  return {
    title: `${project.title} | BEREM`,
    description: project.description.slice(0, 160),
  };
}

export default async function RealisationDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<RealisationLoading />}>
      <RealisationContent slug={slug} />
    </Suspense>
  );
}

function RealisationLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-20">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="mt-6 h-4 w-full rounded bg-slate-200" />
        <div className="mt-3 h-4 w-5/6 rounded bg-slate-200" />
        <div className="mt-10 h-64 rounded bg-slate-200" />
      </div>
    </main>
  );
}

async function RealisationContent({ slug }: { slug: string }) {
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const images = project.media.filter((item) => item.type === "IMAGE");
  const videos = project.media.filter((item) => item.type === "VIDEO");

  const latestUpdate = project.updates[0];
  const progress = clampProgress(project.progress);

  return (
    <>
      {/* En-tête du projet */}
      <section className="bg-[#102A43] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/realisations"
            className="text-sm font-semibold text-slate-300 transition hover:text-[#F59E0B]"
          >
            ← Toutes les réalisations
          </Link>

          <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
            {project.location}
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-3xl leading-8 text-slate-300">
            {project.description}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm font-semibold">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                project.status === "COMPLETED"
                  ? "bg-emerald-400"
                  : project.status === "IN_PROGRESS"
                    ? "bg-[#F59E0B]"
                    : "bg-slate-400"
              }`}
            />
            {getStatusLabel(project.status)}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-5xl">
          {/* Informations générales */}
          <div className="grid gap-5 border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Localisation</p>
              <p className="mt-2 font-bold text-[#102A43]">
                {project.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Date de démarrage</p>
              <p className="mt-2 font-bold text-[#102A43]">
                {project.startDate
                  ? formatDate(project.startDate)
                  : "Non renseignée"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Statut du projet</p>
              <p className="mt-2 font-bold text-[#102A43]">
                {getStatusLabel(project.status)}
              </p>
            </div>
          </div>

          {/* Progression générale */}
          {(project.status === "IN_PROGRESS" ||
            project.status === "COMPLETED") && (
            <section className="mt-8 border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Suivi du chantier
                  </p>
                  <h2 className="mt-2 text-xl font-black text-[#102A43]">
                    Avancement des travaux
                  </h2>
                </div>

                <span className="text-3xl font-black text-[#102A43]">
                  {project.status === "COMPLETED" ? 100 : progress}%
                </span>
              </div>

              <div
                className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Avancement du chantier"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={
                  project.status === "COMPLETED" ? 100 : progress
                }
              >
                <div
                  className="h-full rounded-full bg-[#F59E0B] transition-all"
                  style={{
                    width: `${
                      project.status === "COMPLETED" ? 100 : progress
                    }%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {project.status === "COMPLETED"
                  ? "Ce projet est terminé."
                  : "La progression est basée sur les informations de suivi enregistrées pour ce projet."}
              </p>
            </section>
          )}

          {/* Dernière actualité publiée */}
          {latestUpdate && (
            <section className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
                    Actualité du chantier
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#102A43] sm:text-3xl">
                    Dernière mise à jour
                  </h2>
                </div>

                <p className="text-sm text-slate-500">
                  {formatDate(
                    latestUpdate.publishedAt ?? latestUpdate.eventDate
                  )}
                </p>
              </div>

              <article className="mt-6 overflow-hidden border border-slate-200 bg-white">
                <div className="border-b border-slate-100 p-6 sm:p-8">
                  {latestUpdate.stage?.name && (
                    <p className="inline-flex bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
                      Étape : {latestUpdate.stage.name}
                    </p>
                  )}

                  <h3 className="mt-4 text-xl font-black text-[#102A43] sm:text-2xl">
                    {latestUpdate.title}
                  </h3>

                  <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                    {latestUpdate.description}
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#F59E0B]"
                        style={{
                          width: `${clampProgress(latestUpdate.progress)}%`,
                        }}
                      />
                    </div>

                    <span className="shrink-0 text-sm font-black text-[#102A43]">
                      {clampProgress(latestUpdate.progress)}%
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Avancement indiqué dans ce rapport
                  </p>
                </div>

                {latestUpdate.media.length > 0 && (
                  <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                    {latestUpdate.media.map((media) => (
                      <figure
                        key={media.id}
                        className="overflow-hidden border border-slate-200"
                      >
                        {media.type === "IMAGE" ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={media.url}
                              alt={media.caption || latestUpdate.title}
                              loading="lazy"
                              className="h-64 w-full object-cover"
                            />
                            {media.caption && (
                              <figcaption className="p-3 text-sm text-slate-600">
                                {media.caption}
                              </figcaption>
                            )}
                          </>
                        ) : (
                          <div className="p-4">
                            <a
                              href={media.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#102A43] underline decoration-[#F59E0B] underline-offset-4 hover:text-amber-600"
                            >
                              {media.caption || "Voir la vidéo du rapport"}
                              {" ↗"}
                            </a>
                          </div>
                        )}
                      </figure>
                    ))}
                  </div>
                )}
              </article>
            </section>
          )}

          {/* Galerie générale */}
          <section className="mt-14">
            <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">
              Galerie du projet
            </h2>

            {images.length > 0 ? (
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {images.map((image) => (
                  <figure
                    key={image.id}
                    className="overflow-hidden border border-slate-200 bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.caption || project.title}
                      loading="lazy"
                      className="h-64 w-full object-cover"
                    />

                    {image.caption && (
                      <figcaption className="p-4 text-sm text-slate-600">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-5 border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
                Les photos générales de ce projet seront ajoutées prochainement.
              </p>
            )}
          </section>

          {/* Vidéos générales */}
          {videos.length > 0 && (
            <section className="mt-14">
              <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">
                Vidéos du projet
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="border border-slate-200 bg-white p-5"
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#102A43] underline decoration-[#F59E0B] underline-offset-4 hover:text-amber-600"
                    >
                      {video.caption || "Voir la vidéo du projet"}
                      {" ↗"}
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Historique des rapports publiés */}
          {project.updates.length > 0 && (
            <section className="mt-16">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
                Journal des travaux
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#102A43] sm:text-3xl">
                Historique du chantier
              </h2>

              <div className="mt-8 space-y-5">
                {project.updates.map((update, index) => (
                  <article
                    key={update.id}
                    className="relative border border-slate-200 bg-white p-6 sm:p-8"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-500">
                        {formatDate(update.publishedAt ?? update.eventDate)}
                      </p>

                      <span className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {index === 0 ? "Dernière actualité" : "Rapport de suivi"}
                      </span>
                    </div>

                    {update.stage?.name && (
                      <p className="mt-4 text-sm font-semibold text-amber-700">
                        Étape : {update.stage.name}
                      </p>
                    )}

                    <h3 className="mt-3 text-lg font-black text-[#102A43] sm:text-xl">
                      {update.title}
                    </h3>

                    <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                      {update.description}
                    </p>

                    <p className="mt-4 text-sm font-bold text-[#102A43]">
                      Avancement du rapport :{" "}
                      {clampProgress(update.progress)}%
                    </p>

                    {update.media.length > 0 && (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {update.media.map((media) => (
                          <figure
                            key={media.id}
                            className="overflow-hidden border border-slate-200"
                          >
                            {media.type === "IMAGE" ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={media.url}
                                  alt={media.caption || update.title}
                                  loading="lazy"
                                  className="h-56 w-full object-cover"
                                />
                                {media.caption && (
                                  <figcaption className="p-3 text-sm text-slate-600">
                                    {media.caption}
                                  </figcaption>
                                )}
                              </>
                            ) : (
                              <div className="p-4">
                                <a
                                  href={media.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-[#102A43] underline decoration-[#F59E0B] underline-offset-4 hover:text-amber-600"
                                >
                                  {media.caption || "Voir la vidéo du rapport"}
                                  {" ↗"}
                                </a>
                              </div>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Appel à l'action */}
          <section className="mt-16 bg-[#102A43] p-8 text-white sm:p-10">
            <h2 className="text-2xl font-black">
              Vous avez un projet similaire ?
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Contactez notre équipe pour présenter votre besoin et étudier
              les possibilités de réalisation.
            </p>

            <Link
              href="/devis"
              className="mt-7 inline-flex bg-[#F59E0B] px-6 py-4 font-bold text-[#102A43] transition hover:bg-amber-400"
            >
              Demander un devis →
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}