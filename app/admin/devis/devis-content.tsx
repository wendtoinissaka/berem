import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma, QuoteStatus } from "@/generated/prisma/client";

const PAGE_SIZE = 20;

const statusLabels: Record<QuoteStatus, string> = {
  NEW: "Nouvelle",
  IN_REVIEW: "En cours d'étude",
  ADDITIONAL_INFO_REQUIRED: "Informations requises",
  QUOTE_SENT: "Devis envoyé",
  CLOSED: "Clôturée",
};

const statusStyles: Record<QuoteStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-600/20",
  IN_REVIEW: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ADDITIONAL_INFO_REQUIRED:
    "bg-orange-50 text-orange-700 ring-orange-600/20",
  QUOTE_SENT: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

type SearchParams = Promise<{
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: string;
}>;

type DevisContentProps = {
  searchParams?: SearchParams;
};

function buildUrl(params: {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
}) {
  const search = new URLSearchParams();

  if (params.q) search.set("q", params.q);
  if (params.status) search.set("status", params.status);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);

  if (params.page && params.page > 1) {
    search.set("page", String(params.page));
  }

  const query = search.toString();

  return query ? `/admin/devis?${query}` : "/admin/devis";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function StatCard({
  title,
  value,
  subtitle,
  color = "slate",
}: {
  title: string;
  value: number;
  subtitle: string;
  color?: "slate" | "blue" | "amber" | "green";
}) {
  const colors = {
    slate: "text-slate-950",
    blue: "text-blue-700",
    amber: "text-amber-700",
    green: "text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className={`mt-3 text-3xl font-bold ${colors[color]}`}>
        {value.toLocaleString("fr-FR")}
      </p>

      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

export default async function DevisContent({
  searchParams,
}: DevisContentProps) {
  const params = searchParams ? await searchParams : {};

  const q = (params.q ?? "").trim().slice(0, 150);
  const status = params.status ?? "";
  const from = params.from ?? "";
  const to = params.to ?? "";

  const parsedPage = Number(params.page ?? "1");
  const requestedPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const validStatuses = Object.keys(statusLabels);
  const selectedStatus = validStatuses.includes(status)
    ? (status as QuoteStatus)
    : "";

  const validFrom = /^\d{4}-\d{2}-\d{2}$/.test(from)
    ? from
    : "";

  const validTo = /^\d{4}-\d{2}-\d{2}$/.test(to)
    ? to
    : "";

  const createdAt: Prisma.DateTimeFilter = {};

  if (validFrom) {
    const start = new Date(`${validFrom}T00:00:00.000Z`);

    if (!Number.isNaN(start.getTime())) {
      createdAt.gte = start;
    }
  }

  if (validTo) {
    const end = new Date(`${validTo}T00:00:00.000Z`);

    if (!Number.isNaN(end.getTime())) {
      end.setUTCDate(end.getUTCDate() + 1);
      createdAt.lt = end;
    }
  }

  const where: Prisma.QuoteRequestWhereInput = {
    ...(selectedStatus ? { status: selectedStatus } : {}),

    ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),

    ...(q
      ? {
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { projectType: { contains: q } },
            { location: { contains: q } },
          ]
        }
      : {}),
  };

  const [
    totalRequests,
    newRequests,
    inReviewRequests,
    sentQuotes,
    closedRequests,
    filteredCount,
  ] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.quoteRequest.count({ where: { status: "IN_REVIEW" } }),
    prisma.quoteRequest.count({ where: { status: "QUOTE_SENT" } }),
    prisma.quoteRequest.count({ where: { status: "CLOSED" } }),
    prisma.quoteRequest.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const requests = await prisma.quoteRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE,
    select: {
      id: true,
      fullName: true,
      company: true,
      email: true,
      phone: true,
      projectType: true,
      location: true,
      status: true,
      createdAt: true,
    },
  });

  const hasFilters = Boolean(q || selectedStatus || validFrom || validTo);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-500 transition hover:text-amber-700"
          >
            ← Tableau de bord
          </Link>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            Espace de gestion BEREM
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Demandes de devis
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Centralisez les demandes des clients, suivez leur traitement et
            retrouvez rapidement les dossiers à prendre en charge.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Volume total</p>
          <p className="mt-1 text-xl font-bold text-slate-950">
            {totalRequests.toLocaleString("fr-FR")}
            <span className="ml-2 text-sm font-normal text-slate-500">
              demande(s)
            </span>
          </p>
        </div>
      </section>

      {/* Statistiques */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Toutes les demandes"
          value={totalRequests}
          subtitle="Enregistrées sur le site"
        />

        <StatCard
          title="Nouvelles demandes"
          value={newRequests}
          subtitle="À examiner en priorité"
          color="blue"
        />

        <StatCard
          title="En cours d'étude"
          value={inReviewRequests}
          subtitle="Dossiers en traitement"
          color="amber"
        />

        <StatCard
          title="Devis envoyés"
          value={sentQuotes}
          subtitle="En attente de suivi"
          color="green"
        />
      </section>

      {/* Filtres */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="font-bold text-slate-950">
            Rechercher une demande
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Affinez les résultats sans parcourir tous les dossiers.
          </p>
        </div>

        <form
          action="/admin/devis"
          method="GET"
          className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5 sm:p-6"
        >
          <div className="xl:col-span-2">
            <label
              htmlFor="q"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Recherche
            </label>

            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Nom, e-mail, téléphone, projet..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Statut
            </label>

            <select
              id="status"
              name="status"
              defaultValue={selectedStatus}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-amber-500"
            >
              <option value="">Tous les statuts</option>

              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="from"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Du
            </label>

            <input
              id="from"
              name="from"
              type="date"
              defaultValue={validFrom}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="to"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Au
            </label>

            <input
              id="to"
              name="to"
              type="date"
              defaultValue={validTo}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:col-span-2 xl:col-span-5">
            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Rechercher
            </button>

            <Link
              href="/admin/devis"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Réinitialiser
            </Link>

            {hasFilters && (
              <span className="text-sm text-slate-500">
                Filtres actifs
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Tableau */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-bold text-slate-950">
              Liste des demandes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredCount === 0
                ? "Aucun résultat"
                : `${(skip + 1).toLocaleString("fr-FR")} à ${Math.min(
                    skip + requests.length,
                    filteredCount,
                  ).toLocaleString("fr-FR")} sur ${filteredCount.toLocaleString("fr-FR")} résultat(s)`}
            </p>
          </div>

          <div className="text-sm text-slate-500">
            {closedRequests.toLocaleString("fr-FR")} dossier(s) clôturé(s)
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              {hasFilters ? "⌕" : "▤"}
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              {hasFilters
                ? "Aucune demande ne correspond aux critères"
                : "Aucune demande enregistrée"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {hasFilters
                ? "Essaie de modifier la recherche ou les filtres pour retrouver un dossier."
                : "Les demandes envoyées par les clients apparaîtront ici."}
            </p>

            {hasFilters && (
              <Link
                href="/admin/devis"
                className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Afficher toutes les demandes
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Client</th>
                    <th className="px-6 py-4 font-semibold">Projet</th>
                    <th className="px-6 py-4 font-semibold">Localisation</th>
                    <th className="px-6 py-4 font-semibold">Réception</th>
                    <th className="px-6 py-4 font-semibold">Statut</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition hover:bg-amber-50/30"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {request.fullName}
                        </p>

                        {request.company && (
                          <p className="mt-1 text-xs text-slate-500">
                            {request.company}
                          </p>
                        )}

                        <a
                          href={`mailto:${request.email}`}
                          className="mt-1 block text-xs text-slate-500 hover:text-amber-700"
                        >
                          {request.email}
                        </a>

                        <a
                          href={`tel:${request.phone}`}
                          className="mt-1 block text-xs text-slate-500 hover:text-amber-700"
                        >
                          {request.phone}
                        </a>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-800">
                          {request.projectType}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {request.location}
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap text-slate-600">
                        {formatDate(request.createdAt)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[request.status]}`}
                        >
                          {statusLabels[request.status]}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/devis/${request.id}`}
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
                        >
                          Consulter
                          <span aria-hidden="true">→</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-900">
                  {currentPage}
                </span>{" "}
                sur{" "}
                <span className="font-semibold text-slate-900">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={buildUrl({
                      q,
                      status: selectedStatus,
                      from: validFrom,
                      to: validTo,
                      page: currentPage - 1,
                    })}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    ← Précédent
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-xl border border-slate-100 px-4 py-2.5 text-sm text-slate-300">
                    ← Précédent
                  </span>
                )}

                {currentPage < totalPages ? (
                  <Link
                    href={buildUrl({
                      q,
                      status: selectedStatus,
                      from: validFrom,
                      to: validTo,
                      page: currentPage + 1,
                    })}
                    className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Suivant →
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-400">
                    Suivant →
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}