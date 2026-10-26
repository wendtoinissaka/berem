import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { QuoteStatus } from "@/generated/prisma/client";
import { updateQuoteStatus, addQuoteNote } from "../actions";

const statusLabels: Record<QuoteStatus, string> = {
  NEW: "Nouveau",
  IN_REVIEW: "En cours d'étude",
  ADDITIONAL_INFO_REQUIRED: "Informations complémentaires requises",
  QUOTE_SENT: "Devis envoyé",
  CLOSED: "Clôturé",
};

const statusStyles: Record<QuoteStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-200",
  IN_REVIEW: "bg-amber-50 text-amber-700 ring-amber-200",
  ADDITIONAL_INFO_REQUIRED: "bg-orange-50 text-orange-700 ring-orange-200",
  QUOTE_SENT: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-200",
};

function formatDate(date: Date | null) {
  if (!date) return "Non renseignée";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function InfoItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-1 break-words text-sm font-semibold text-slate-800">
        {children}
      </div>
    </div>
  );
}

export default function DevisDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    updated?: string;
    noteAdded?: string;
  }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
          Chargement de la fiche du devis...
        </div>
      }
    >
      <DevisDetailContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function DevisDetailContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    updated?: string;
    noteAdded?: string;
  }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const query = await searchParams;

  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!quote) {
    notFound();
  }

  const budget = quote.estimatedBudget || "Non renseigné";

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/devis"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <span aria-hidden="true">←</span>
            Retour aux demandes
          </Link>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Détail de la demande
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Référence :{" "}
            <span className="font-mono text-slate-700">{quote.id}</span>
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${statusStyles[quote.status]}`}
        >
          {statusLabels[quote.status]}
        </span>
      </div>

      {/* Confirmation du changement de statut */}
      {query.updated === "1" && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          Le statut de la demande a été mis à jour avec succès.
        </div>
      )}

      {/* Confirmation de l'ajout d'une note */}
      {query.noteAdded === "1" && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          La note interne a été enregistrée avec succès.
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Informations principales */}
        <div className="space-y-6 lg:col-span-2">
          {/* Informations du client */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Informations du client
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Coordonnées communiquées dans le formulaire.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-5 sm:grid-cols-2">
              <InfoItem label="Nom complet">{quote.fullName}</InfoItem>

              <InfoItem label="Entreprise">
                {quote.company || "Non renseignée"}
              </InfoItem>

              <InfoItem label="Adresse e-mail">
                <a
                  href={`mailto:${quote.email}`}
                  className="text-blue-700 hover:underline"
                >
                  {quote.email}
                </a>
              </InfoItem>

              <InfoItem label="Téléphone">
                <a
                  href={`tel:${quote.phone}`}
                  className="text-blue-700 hover:underline"
                >
                  {quote.phone}
                </a>
              </InfoItem>

              <InfoItem label="Localisation du projet">
                {quote.location}
              </InfoItem>

              <InfoItem label="Date de réception">
                {formatDate(quote.createdAt)}
              </InfoItem>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <a
                href={`mailto:${quote.email}?subject=${encodeURIComponent(
                  "Votre demande de devis - BEREM"
                )}`}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Envoyer un e-mail
              </a>

              <a
                href={`tel:${quote.phone}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Appeler le client
              </a>
            </div>
          </section>

          {/* Détails du projet */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Détails du projet
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Informations fournies par le client pour préparer le devis.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-5 sm:grid-cols-2">
              <InfoItem label="Type de projet">
                {quote.projectType}
              </InfoItem>

              <InfoItem label="Budget estimé">{budget}</InfoItem>

              <InfoItem label="Date souhaitée">
                {formatDate(quote.desiredDate)}
              </InfoItem>

              <InfoItem label="Dernière mise à jour">
                {formatDate(quote.updatedAt)}
              </InfoItem>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm font-medium text-slate-500">
                Description du projet
              </p>

              <div className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {quote.description}
              </div>
            </div>
          </section>

          {/* Notes internes et historique */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Historique et notes internes
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Retrouvez les changements de statut et les observations
                enregistrées par l'administration. Ces notes ne sont pas
                envoyées au client.
              </p>
            </div>

            {/* Formulaire d'ajout d'une note */}
            <form action={addQuoteNote} className="mt-5 space-y-3">
              <input type="hidden" name="id" value={quote.id} />

              <label
                htmlFor="message"
                className="block text-sm font-semibold text-slate-700"
              >
                Ajouter une note interne
              </label>

              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={5000}
                required
                placeholder="Ex. : Client contacté, visite du terrain à planifier, attente des plans..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Enregistrer la note
                </button>
              </div>
            </form>

            {/* Chronologie */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-900">
                Activités récentes
              </h3>

              {quote.activities.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Aucune activité enregistrée pour le moment.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Les changements de statut et les notes apparaîtront ici.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {quote.activities.map((activity) => {
                    const isNote = activity.type === "NOTE";

                    return (
                      <div
                        key={activity.id}
                        className="relative flex gap-4"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                            isNote
                              ? "bg-violet-100 text-violet-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <span aria-hidden="true">
                            {isNote ? "✎" : "↻"}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span
                              className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isNote
                                  ? "bg-violet-50 text-violet-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {isNote
                                ? "Note interne"
                                : activity.type === "STATUS_CHANGE"
                                  ? "Changement de statut"
                                  : "Activité"}
                            </span>

                            <time
                              dateTime={activity.createdAt.toISOString()}
                              className="text-xs text-slate-500"
                            >
                              {formatDate(activity.createdAt)}
                            </time>
                          </div>

                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                            {activity.message}
                          </p>

                          {activity.oldStatus && activity.newStatus && (
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
                                {statusLabels[activity.oldStatus]}
                              </span>

                              <span
                                aria-hidden="true"
                                className="text-slate-400"
                              >
                                →
                              </span>

                              <span
                                className={`rounded-md px-2 py-1 font-semibold ring-1 ring-inset ${statusStyles[activity.newStatus]}`}
                              >
                                {statusLabels[activity.newStatus]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Gestion administrative */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Gestion de la demande
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Modifiez le statut pour suivre l'avancement du traitement de cette
              demande.
            </p>

            <form action={updateQuoteStatus} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={quote.id} />

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Statut de la demande
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={quote.status}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  {Object.values(QuoteStatus).map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Enregistrer le statut
              </button>
            </form>
          </section>

          {/* Étapes de traitement */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              Étapes de traitement
            </h3>

            <div className="mt-4 space-y-4">
              {[
                {
                  title: "Nouveau",
                  description: "La demande vient d'être reçue.",
                },
                {
                  title: "En cours d'étude",
                  description: "L'équipe examine le projet.",
                },
                {
                  title: "Devis envoyé",
                  description: "Une proposition a été transmise au client.",
                },
                {
                  title: "Clôturé",
                  description: "Le traitement de la demande est terminé.",
                },
              ].map((step, index) => (
                <div key={step.title} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}