import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  deleteTestimonial,
  toggleTestimonialPublication,
} from "./actions";

export const metadata = {
  title: "Témoignages | BEREM Admin",
};

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  const publishedCount = testimonials.filter(
    (testimonial) => testimonial.isPublished
  ).length;

  const draftCount = testimonials.length - publishedCount;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-[#102A43]">
            Témoignages clients
          </h1>

          <p className="mt-2 text-slate-600">
            Gérez les avis et témoignages des clients de BEREM.
          </p>
        </div>

        <Link
          href="/admin/temoignages/nouveau"
          className="inline-flex items-center justify-center rounded-xl bg-[#102A43] px-5 py-3 font-semibold text-white transition hover:bg-[#183d5d]"
        >
          + Ajouter un témoignage
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total des témoignages</p>
          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {testimonials.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Témoignages publiés</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Brouillons</p>
          <p className="mt-2 text-3xl font-black text-amber-600">
            {draftCount}
          </p>
        </div>
      </div>

      {/* Liste */}
      {testimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
            💬
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#102A43]">
            Aucun témoignage pour le moment
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-slate-600">
            Ajoutez les témoignages de vos clients pour valoriser les
            réalisations et le savoir-faire de BEREM.
          </p>

          <Link
            href="/admin/temoignages/nouveau"
            className="mt-6 inline-flex rounded-xl bg-amber-500 px-5 py-3 font-bold text-[#102A43] transition hover:bg-amber-400"
          >
            Ajouter le premier témoignage
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Client</th>
                  <th className="px-5 py-4 font-semibold">Témoignage</th>
                  <th className="px-5 py-4 font-semibold">Statut</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {testimonials.map((testimonial) => (
                  <tr
                    key={testimonial.id}
                    className="align-top transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-5">
                      <p className="font-bold text-[#102A43]">
                        {testimonial.clientName}
                      </p>

                      {testimonial.company && (
                        <p className="mt-1 text-slate-600">
                          {testimonial.company}
                        </p>
                      )}

                      {testimonial.role && (
                        <p className="mt-1 text-xs text-slate-500">
                          {testimonial.role}
                        </p>
                      )}

                      {testimonial.projectName && (
                        <p className="mt-2 text-xs font-medium text-amber-700">
                          Projet : {testimonial.projectName}
                        </p>
                      )}
                    </td>

                    <td className="max-w-sm px-5 py-5">
                      <p className="whitespace-pre-line text-slate-600">
                        {testimonial.content.length > 180
                          ? `${testimonial.content.slice(0, 180)}…`
                          : testimonial.content}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          testimonial.isPublished
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {testimonial.isPublished ? "Publié" : "Brouillon"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-5 text-slate-500">
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(testimonial.createdAt)}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex flex-col items-end gap-2">
                        <Link
                          href={`/admin/temoignages/${testimonial.id}/modifier`}
                          className="inline-flex rounded-lg border border-slate-200 px-3 py-2 font-semibold text-[#102A43] transition hover:border-[#102A43] hover:bg-slate-50"
                        >
                          Modifier
                        </Link>

                        <form action={toggleTestimonialPublication}>
                          <input
                            type="hidden"
                            name="id"
                            value={testimonial.id}
                          />

                          <button
                            type="submit"
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              testimonial.isPublished
                                ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            }`}
                          >
                            {testimonial.isPublished
                              ? "Dépublier"
                              : "Publier"}
                          </button>
                        </form>

                        <form
                          action={deleteTestimonial}
                          onSubmit={undefined}
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={testimonial.id}
                          />

                          <input
                            type="hidden"
                            name="confirmation"
                            value="SUPPRIMER"
                          />

                          <button
                            type="submit"
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Supprimer
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-sm text-slate-500">
        Seuls les témoignages publiés seront destinés à être affichés sur le
        site public. Vérifiez leur authenticité et obtenez l’accord des clients
        concernés avant publication.
      </p>
    </div>
  );
}