import Link from "next/link";
import { prisma } from "@/lib/prisma";

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value.toLocaleString("fr-FR")}
      </p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default async function DashboardContent() {
  const [
    totalProjects,
    ongoingProjects,
    totalQuotes,
    newQuotes,
    activeServices,
    publishedTestimonials,
    recentQuotes,
  ] = await Promise.all([
    prisma.project.count(),

    prisma.project.count({
      where: { status: "IN_PROGRESS" },
    }),

    prisma.quoteRequest.count(),

    prisma.quoteRequest.count({
      where: { status: "NEW" },
    }),

    prisma.service.count({
      where: { isActive: true },
    }),

    prisma.testimonial.count({
      where: { isPublished: true },
    }),

    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        projectType: true,
        location: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const statusLabels: Record<string, string> = {
    NEW: "Nouvelle",
    IN_REVIEW: "En cours d'étude",
    ADDITIONAL_INFO_REQUIRED: "Informations requises",
    QUOTE_SENT: "Devis envoyé",
    CLOSED: "Clôturée",
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
          Vue générale
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Tableau de bord
        </h1>

        <p className="mt-2 text-slate-600">
          Suis les activités du site et accède rapidement aux informations
          importantes de BEREM.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Chantiers et réalisations"
          value={totalProjects}
          description="Nombre total de projets enregistrés"
        />

        <StatCard
          title="Chantiers en cours"
          value={ongoingProjects}
          description="Projets actuellement en exécution"
        />

        <StatCard
          title="Demandes de devis"
          value={totalQuotes}
          description={`${newQuotes} nouvelle(s) demande(s) à traiter`}
        />

        <StatCard
          title="Services actifs"
          value={activeServices}
          description="Services actuellement activés"
        />

        <StatCard
          title="Témoignages publiés"
          value={publishedTestimonials}
          description="Témoignages visibles sur le site"
        />

        <div className="flex flex-col justify-between rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
          <div>
            <p className="text-sm text-slate-400">Action prioritaire</p>

            <h2 className="mt-3 text-xl font-bold">
              Traiter les demandes de devis
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Consulte les demandes reçues et leur statut.
            </p>
          </div>

          <Link
            href="/admin/devis"
            className="mt-6 inline-flex w-fit rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Gérer les devis →
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Dernières demandes de devis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Les cinq demandes les plus récentes.
            </p>
          </div>

          <Link
            href="/admin/devis"
            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            Voir toutes les demandes →
          </Link>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-700">
              Aucune demande de devis pour le moment.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Les nouvelles demandes apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Projet</th>
                  <th className="px-6 py-4 font-medium">Localisation</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {quote.fullName}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {quote.projectType}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {quote.location}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                        {statusLabels[quote.status] ?? quote.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "medium",
                      }).format(quote.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}