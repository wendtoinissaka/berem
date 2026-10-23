import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublishedProjectBySlug } from "@/lib/data/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projet introuvable",
    };
  }

  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

export default async function RealisationDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const images = project.media.filter((item) => item.type === "IMAGE");
  const videos = project.media.filter((item) => item.type === "VIDEO");

  return (
    <>
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
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-5xl">
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
                  ? new Intl.DateTimeFormat("fr-FR").format(
                      project.startDate,
                    )
                  : "Non renseignée"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Statut</p>
              <p className="mt-2 font-bold text-[#102A43]">
                {project.status === "COMPLETED"
                  ? "Terminé"
                  : project.status === "IN_PROGRESS"
                    ? "En cours"
                    : project.status === "PLANNED"
                      ? "Planifié"
                      : "En pause"}
              </p>
            </div>
          </div>

          {project.status === "IN_PROGRESS" && (
            <div className="mt-8 border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-bold text-[#102A43]">
                  Avancement du chantier
                </h2>

                <span className="font-black text-[#102A43]">
                  {project.progress} %
                </span>
              </div>

              <div
                className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Avancement du chantier"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(100, Math.max(0, project.progress))}
              >
                <div
                  className="h-full rounded-full bg-[#F59E0B]"
                  style={{
                    width: `${Math.min(100, Math.max(0, project.progress))}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-14">
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
              <p className="mt-5 text-sm leading-7 text-slate-600">
                Les photos de ce projet seront ajoutées prochainement.
              </p>
            )}
          </div>

          {videos.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">
                Vidéos du projet
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="border border-slate-200 bg-white p-4"
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#102A43] underline decoration-[#F59E0B] underline-offset-4 hover:text-amber-600"
                    >
                      {video.caption || "Voir la vidéo du projet"}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.updates.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-black text-[#102A43] sm:text-3xl">
                Historique du projet
              </h2>

              <div className="mt-7 space-y-4">
                {project.updates.map((update) => (
                  <article
                    key={update.id}
                    className="border-l-4 border-[#F59E0B] bg-white p-6"
                  >
                    <p className="text-xs font-semibold text-slate-500">
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "long",
                      }).format(update.publishedAt)}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-[#102A43]">
                      {update.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {update.description}
                    </p>

                    <p className="mt-3 text-sm font-bold text-[#102A43]">
                      Avancement : {update.progress} %
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 bg-[#102A43] p-8 text-white sm:p-10">
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
          </div>
        </div>
      </section>
    </>
  );
}