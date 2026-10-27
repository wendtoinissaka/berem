import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SolutionDetailPage({ params }: Props) {
  await connection();

  const { slug } = await params;

  const solution = await prisma.solution.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      features: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      media: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!solution) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Fil d'Ariane */}
      <div className="border-b border-slate-100 px-5 py-4 sm:px-8">
        <nav
          aria-label="Fil d’Ariane"
          className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-[#F59E0B]">
            Accueil
          </Link>

          <span aria-hidden="true">/</span>

          <Link
            href="/solutions"
            className="transition hover:text-[#F59E0B]"
          >
            Solutions
          </Link>

          <span aria-hidden="true">/</span>

          <span className="font-semibold text-[#102A43]">
            {solution.name}
          </span>
        </nav>
      </div>

      {/* Présentation principale */}
      <section className="bg-[#102A43] px-5 py-14 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-[#F59E0B]"
            >
              <span aria-hidden="true">←</span>
              Toutes nos solutions
            </Link>

            {solution.logoUrl && (
              <div className="mt-8 inline-flex rounded-xl bg-white p-4">
                <img
                  src={solution.logoUrl}
                  alt={`Logo de ${solution.name}`}
                  className="max-h-20 max-w-48 object-contain"
                />
              </div>
            )}

            <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-[#F59E0B]">
              Solution BEREM
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              {solution.name}
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              {solution.summary}
            </p>

            {solution.websiteUrl && (
              <a
                href={solution.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#F59E0B] px-6 py-4 font-bold text-[#102A43] transition hover:bg-amber-400"
              >
                {solution.actionLabel || "Découvrir la solution"}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {solution.coverImageUrl ? (
              <img
                src={solution.coverImageUrl}
                alt={`Présentation de ${solution.name}`}
                className="max-h-[520px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-72 items-center justify-center p-10 text-center">
                <span className="text-6xl font-black text-[#F59E0B]">
                  {solution.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              À propos
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#102A43]">
              Comprendre la solution
            </h2>

            <div className="mt-7 whitespace-pre-line text-base leading-8 text-slate-600">
              {solution.description}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-7">
            <h2 className="text-xl font-black text-[#102A43]">
              Vous avez un projet ?
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Contactez BEREM pour discuter de vos besoins et découvrir
              comment cette solution peut vous accompagner.
            </p>

            <Link
              href="/devis"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#F59E0B] px-5 py-3 font-bold text-[#102A43] transition hover:bg-amber-400"
            >
              Demander un devis
              <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </section>

      {/* Fonctionnalités */}
      {solution.features.length > 0 && (
        <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              Fonctionnalités
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#102A43]">
              Ce que propose cette solution
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {solution.features.map((feature) => (
                <article
                  key={feature.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-[#F59E0B]/60 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#102A43] text-xl font-black text-[#F59E0B]">
                    ✓
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#102A43]">
                    {feature.title}
                  </h3>

                  {feature.description && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galerie */}
      {solution.media.length > 0 && (
        <section className="px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              En images
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#102A43]">
              Découvrez la solution
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {solution.media.map((media) => (
                <figure
                  key={media.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  {media.type === "VIDEO" ? (
                    <video
                      src={media.url}
                      controls
                      preload="metadata"
                      className="aspect-video w-full bg-slate-100 object-contain"
                    >
                      Votre navigateur ne prend pas en charge la lecture vidéo.
                    </video>
                  ) : (
                    <img
                      src={media.url}
                      alt={
                        media.caption ||
                        `Illustration de ${solution.name}`
                      }
                      loading="lazy"
                      className="aspect-video w-full object-cover"
                    />
                  )}

                  {media.caption && (
                    <figcaption className="px-4 py-3 text-sm text-slate-600">
                      {media.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact final */}
      <section className="px-5 pb-16 sm:px-8 lg:pb-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl bg-[#102A43] p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              Intéressé par cette solution ?
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Échangeons sur votre projet et vos besoins pour identifier
              l'accompagnement adapté.
            </p>
          </div>

          <Link
            href="/devis"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#F59E0B] px-6 py-4 font-bold text-[#102A43] transition hover:bg-amber-400"
          >
            Contacter BEREM
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}