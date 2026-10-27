"use client";

import { useState } from "react";

type Testimonial = {
  id: string;
  clientName: string;
  company: string | null;
  role: string | null;
  content: string;
  projectName: string | null;
  photoUrl: string | null;
};

const INITIAL_COUNT = 3;
const LOAD_MORE_COUNT = 3;

export default function TestimonialsList({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  return (
    <>
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTestimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-200 hover:border-amber-300 sm:p-6"
          >
            {/* En-tête compact */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <span
                aria-hidden="true"
                className="font-serif text-4xl leading-8 text-amber-500"
              >
                “
              </span>

              {testimonial.projectName && (
                <span className="max-w-[70%] rounded bg-slate-50 px-2.5 py-1 text-right text-xs text-slate-500">
                  {testimonial.projectName}
                </span>
              )}
            </div>

            {/* Commentaire */}
            <p className="mb-5 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
              {testimonial.content}
            </p>

            {/* Informations du client */}
            <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
              {testimonial.photoUrl ? (
                <img
                  src={testimonial.photoUrl}
                  alt={`Photo de ${testimonial.clientName}`}
                  loading="lazy"
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white"
                >
                  {testimonial.clientName.trim().charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {testimonial.clientName}
                </h3>

                {(testimonial.role || testimonial.company) && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {[testimonial.role, testimonial.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Navigation entre les groupes */}
      {(hasMore || visibleCount > INITIAL_COUNT) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {hasMore && (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + LOAD_MORE_COUNT, testimonials.length)
                )
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Voir plus de témoignages
              <span aria-hidden="true">↓</span>
            </button>
          )}

          {visibleCount > INITIAL_COUNT && (
            <button
              type="button"
              onClick={() => setVisibleCount(INITIAL_COUNT)}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Réduire
            </button>
          )}
        </div>
      )}

      {/* <p className="mt-4 text-center text-xs text-slate-400">
        {visibleTestimonials.length} témoignage
        {visibleTestimonials.length > 1 ? "s" : ""} affiché
        {visibleTestimonials.length > 1 ? "s" : ""} sur {testimonials.length}
      </p> */}
    </>
  );
}