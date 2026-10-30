import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectStageStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import ProjectUpdateMediaGallery from "@/components/admin/projets/project-update-media-gallery";
import ProjectUpdateMediaUpload from "@/components/admin/projets/project-update-media-upload";
import {
  createProjectStage,
  updateProjectStage,
  createProjectUpdate,
  toggleProjectUpdatePublication,
} from "../../suivi-actions";

export const instant = false;

export const metadata = {
  title: "Suivi du chantier | BEREM Admin",
};

const stageStatusLabels: Record<ProjectStageStatus, string> = {
  NOT_STARTED: "Non commencée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  ON_HOLD: "En pause",
};

const stageStatusStyles: Record<ProjectStageStatus, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  ON_HOLD: "bg-amber-100 text-amber-800",
};

function formatDate(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ProjectTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      stages: {
        orderBy: { sortOrder: "asc" },
      },
      updates: {
        orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }],
        include: {
          stage: {
            select: { name: true },
          },
          media: true,
        },
      },
    },
  });

  if (!project) notFound();

  const archived = Boolean(project.archivedAt);

  const completedStages = project.stages.filter(
    (stage) => stage.status === "COMPLETED"
  ).length;

  const inProgressStages = project.stages.filter(
    (stage) => stage.status === "IN_PROGRESS"
  ).length;

  const publishedUpdates = project.updates.filter(
    (update) => update.isPublished
  ).length;

  const totalMedia = project.updates.reduce(
    (total, update) => total + update.media.length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      {/* En-tête du chantier */}
      <header className="space-y-5">
        <Link
          href="/admin/projets"
          className="inline-flex text-sm font-semibold text-slate-600 transition hover:text-amber-700"
        >
          ← Retour aux chantiers
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Administration · Suivi de chantier
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#102A43] sm:text-4xl">
              {project.title}
            </h1>

            <p className="mt-2 text-slate-600">
              📍 {project.location}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  archived
                    ? "bg-orange-100 text-orange-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {archived ? "Chantier archivé" : "Suivi actif"}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {project.stages.length} étape(s)
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {project.updates.length} compte(s) rendu(s)
              </span>
            </div>
          </div>

          <Link
            href={`/admin/projets/${project.id}/modifier`}
            className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50"
          >
            Modifier le chantier
          </Link>
        </div>
      </header>

      {/* Avertissement si le chantier est archivé */}
      {archived && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
          <p className="font-bold">Chantier archivé</p>
          <p className="mt-1">
            Tu peux consulter les étapes, les comptes rendus et les médias.
            Les modifications de suivi sont désactivées jusqu’à la restauration
            du chantier.
          </p>
        </div>
      )}

      {/* Tableau de bord */}
      <section
        aria-label="Résumé du chantier"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Progression générale
          </p>

          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {project.progress} %
          </p>

          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label={`Progression de ${project.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={project.progress}
          >
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, project.progress))}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Début : {formatDate(project.startDate)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Fin prévue : {formatDate(project.expectedEndDate)}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Étapes terminées
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-700">
            {completedStages}
            <span className="text-lg font-semibold text-slate-400">
              {" "}/ {project.stages.length}
            </span>
          </p>

          <p className="mt-3 text-xs text-slate-500">
            {inProgressStages} étape(s) en cours
          </p>

          <a
            href="#etapes"
            className="mt-4 inline-flex text-sm font-bold text-amber-700 hover:text-amber-800"
          >
            Consulter les étapes →
          </a>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Comptes rendus publiés
          </p>

          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {publishedUpdates}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Sur {project.updates.length} compte(s) rendu(s) enregistré(s)
          </p>

          <a
            href="#comptes-rendus"
            className="mt-4 inline-flex text-sm font-bold text-amber-700 hover:text-amber-800"
          >
            Consulter l’historique →
          </a>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Photos et vidéos
          </p>

          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {totalMedia}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Média(s) associés aux comptes rendus
          </p>

          <a
            href="#comptes-rendus"
            className="mt-4 inline-flex text-sm font-bold text-amber-700 hover:text-amber-800"
          >
            Gérer les médias →
          </a>
        </article>
      </section>

      {/* Accès rapide */}
      <nav
        aria-label="Actions rapides"
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        <span className="mr-1 text-sm font-bold text-[#102A43]">
          Actions rapides
        </span>

        {!archived && (
          <>
            <a
              href="#ajouter-etape"
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-amber-50"
            >
              + Ajouter une étape
            </a>

            <a
              href="#nouveau-compte-rendu"
              className="rounded-lg bg-[#102A43] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b4264]"
            >
              + Nouveau compte rendu
            </a>
          </>
        )}

        <a
          href="#comptes-rendus"
          className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-amber-50"
        >
          Voir l’historique
        </a>
      </nav>

      {/* Étapes techniques */}
      <section id="etapes" className="scroll-mt-6 space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Organisation du chantier
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#102A43]">
              Étapes techniques
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Consulte les différentes phases des travaux et modifie leur
              statut au fur et à mesure de l’avancement.
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            {completedStages} sur {project.stages.length} terminée(s)
          </span>
        </div>

        {/* Formulaire repliable pour ajouter une étape */}
        {!archived && (
          <details
            id="ajouter-etape"
            className="group overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl font-bold text-amber-800">
                  +
                </span>

                <div>
                  <h3 className="font-bold text-[#102A43]">
                    Ajouter une étape
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Créer une nouvelle phase de travaux
                  </p>
                </div>
              </div>

              <span className="text-sm font-bold text-amber-700 group-open:hidden">
                Ouvrir ↓
              </span>

              <span className="hidden text-sm font-bold text-amber-700 group-open:inline">
                Fermer ↑
              </span>
            </summary>

            <form
              action={createProjectStage}
              className="grid gap-4 border-t border-slate-100 p-5"
            >
              <input type="hidden" name="projectId" value={project.id} />

              <div>
                <label
                  htmlFor="stage-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nom de l’étape *
                </label>

                <input
                  id="stage-name"
                  name="name"
                  required
                  maxLength={150}
                  placeholder="Ex. Réalisation des fondations"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div>
                <label
                  htmlFor="stage-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="stage-description"
                  name="description"
                  rows={3}
                  placeholder="Précisions sur les travaux prévus..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <button
                type="submit"
                className="w-fit rounded-xl bg-[#102A43] px-5 py-3 font-bold text-white transition hover:bg-[#1b4264]"
              >
                Enregistrer l’étape
              </button>
            </form>
          </details>
        )}

        {project.stages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-bold text-[#102A43]">
              Aucune étape pour le moment
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {archived
                ? "Aucune étape technique n’a été enregistrée pour ce chantier."
                : "Commence par ajouter les principales phases des travaux : fondations, gros œuvre, toiture, finitions, etc."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {project.stages.map((stage, index) => (
              <article
                key={stage.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
              >
                {/* Résumé toujours visible */}
                <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-600">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-bold text-[#102A43]">
                        {stage.name}
                      </h3>

                      {stage.description && (
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                          {stage.description}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-slate-400">
                        Phase {index + 1} du chantier
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${stageStatusStyles[stage.status]}`}
                    >
                      {stageStatusLabels[stage.status]}
                    </span>

                    {!archived && (
                      <a
                        href={`#modifier-etape-${stage.id}`}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50"
                      >
                        Modifier ↓
                      </a>
                    )}
                  </div>
                </div>

                {/* Formulaire de modification repliable */}
                {!archived && (
                  <details
                    id={`modifier-etape-${stage.id}`}
                    className="group border-t border-slate-100"
                  >
                    <summary className="cursor-pointer list-none bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-amber-50 [&::-webkit-details-marker]:hidden">
                      <span className="group-open:hidden">
                        Ouvrir le formulaire de modification ↓
                      </span>
                      <span className="hidden group-open:inline">
                        Fermer le formulaire ↑
                      </span>
                    </summary>

                    <form
                      action={updateProjectStage}
                      className="space-y-4 p-5"
                    >
                      <input
                        type="hidden"
                        name="projectId"
                        value={project.id}
                      />

                      <input
                        type="hidden"
                        name="stageId"
                        value={stage.id}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`stage-name-${stage.id}`}
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Nom de l’étape *
                          </label>

                          <input
                            id={`stage-name-${stage.id}`}
                            name="name"
                            required
                            maxLength={150}
                            defaultValue={stage.name}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`stage-status-${stage.id}`}
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Statut de l’étape *
                          </label>

                          <select
                            id={`stage-status-${stage.id}`}
                            name="status"
                            defaultValue={stage.status}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                          >
                            {Object.values(ProjectStageStatus).map((status) => (
                              <option key={status} value={status}>
                                {stageStatusLabels[status]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`stage-description-${stage.id}`}
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Description
                        </label>

                        <textarea
                          id={`stage-description-${stage.id}`}
                          name="description"
                          rows={3}
                          defaultValue={stage.description ?? ""}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                        />
                      </div>

                      <button
                        type="submit"
                        className="rounded-xl bg-[#102A43] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b4264]"
                      >
                        Enregistrer les modifications
                      </button>
                    </form>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Comptes rendus */}
      <section id="comptes-rendus" className="scroll-mt-6 space-y-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
            Journal des travaux
          </p>

          <h2 className="mt-1 text-2xl font-black text-[#102A43]">
            Comptes rendus
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Enregistre les travaux réalisés, ajoute les photos et vidéos, puis
            décide quels comptes rendus seront visibles sur le site public.
          </p>
        </div>

        {/* Formulaire repliable pour un nouveau compte rendu */}
        {!archived && (
          <details
            id="nouveau-compte-rendu"
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#102A43] text-xl font-bold text-white">
                  +
                </span>

                <div>
                  <h3 className="font-bold text-[#102A43]">
                    Nouveau compte rendu
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Décrire une intervention ou une avancée du chantier
                  </p>
                </div>
              </div>

              <span className="text-sm font-bold text-amber-700 group-open:hidden">
                Créer ↓
              </span>

              <span className="hidden text-sm font-bold text-amber-700 group-open:inline">
                Fermer ↑
              </span>
            </summary>

            <form
              action={createProjectUpdate}
              className="space-y-6 border-t border-slate-100 p-5 sm:p-6"
            >
              <input type="hidden" name="projectId" value={project.id} />

              {/* Informations générales */}
              <div>
                <h4 className="font-bold text-[#102A43]">
                  1. Informations du compte rendu
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Donne un titre et indique la date des travaux.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="update-title"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Titre du compte rendu *
                  </label>

                  <input
                    id="update-title"
                    name="title"
                    required
                    maxLength={180}
                    placeholder="Ex. Achèvement des fondations"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="eventDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Date des travaux *
                  </label>

                  <input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="update-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description des travaux *
                </label>

                <textarea
                  id="update-description"
                  name="description"
                  required
                  rows={5}
                  placeholder="Décris les travaux réalisés, les résultats obtenus et la suite prévue..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              {/* Avancement */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-bold text-[#102A43]">
                  2. Avancement des travaux
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Associe le compte rendu à une étape et indique la progression
                  générale actuelle.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="update-stage"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Étape concernée
                  </label>

                  <select
                    id="update-stage"
                    name="stageId"
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  >
                    <option value="">Aucune étape particulière</option>

                    {project.stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="update-progress"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Progression générale (%) *
                  </label>

                  <input
                    id="update-progress"
                    name="progress"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    required
                    defaultValue={project.progress}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Valeur comprise entre 0 et 100.
                  </p>
                </div>
              </div>

              {/* Publication */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-bold text-[#102A43]">
                  3. Publication
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Choisis si le compte rendu doit être publié immédiatement.
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                <input
                  name="isPublished"
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-amber-500"
                />

                <span>
                  <span className="block text-sm font-bold text-[#102A43]">
                    Publier immédiatement
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-slate-500">
                    Si cette case reste décochée, le compte rendu sera conservé
                    en brouillon et ne sera pas visible publiquement.
                  </span>
                </span>
              </label>

              <div className="border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#102A43] px-5 py-3.5 font-bold text-white transition hover:bg-[#1b4264] sm:w-auto"
                >
                  Enregistrer le compte rendu
                </button>
              </div>
            </form>
          </details>
        )}

        {/* Historique */}
        <div className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center">
          <h3 className="text-lg font-bold text-[#102A43]">
            Historique des comptes rendus
          </h3>

          <span className="text-sm text-slate-500">
            {project.updates.length} élément(s)
          </span>
        </div>

        {project.updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-bold text-[#102A43]">
              Aucun compte rendu enregistré
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {archived
                ? "Ce chantier ne possède pas encore de compte rendu."
                : "Après une intervention, crée un compte rendu pour conserver une trace des travaux et partager leur progression."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {project.updates.map((update) => (
              <article
                key={update.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* En-tête du compte rendu */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                      {formatDate(update.eventDate)}
                    </p>

                    <h4 className="mt-2 text-lg font-bold text-[#102A43]">
                      {update.title}
                    </h4>

                    {update.stage && (
                      <p className="mt-1 text-sm text-slate-500">
                        Étape concernée : {update.stage.name}
                      </p>
                    )}
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                      update.isPublished
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {update.isPublished
                      ? "✓ Publié sur le site"
                      : "Brouillon · Non publié"}
                  </span>
                </div>

                {/* Description */}
                <div className="p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {update.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Progression indiquée
                      </p>

                      <p className="mt-1 text-xl font-black text-[#102A43]">
                        {update.progress} %
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                        {update.media.length} média(s)
                      </span>

                      {!archived && (
                        <form action={toggleProjectUpdatePublication}>
                          <input
                            type="hidden"
                            name="projectId"
                            value={project.id}
                          />

                          <input
                            type="hidden"
                            name="updateId"
                            value={update.id}
                          />

                          <button
                            type="submit"
                            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                              update.isPublished
                                ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                : "bg-emerald-700 text-white hover:bg-emerald-800"
                            }`}
                          >
                            {update.isPublished
                              ? "Dépublier"
                              : "Publier"}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Gestion des photos et vidéos */}
                  {!archived && (
                    <details className="group mt-5 overflow-hidden rounded-xl border border-slate-200">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-white p-4 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                        <div>
                          <p className="font-bold text-[#102A43]">
                            Photos et vidéos
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Ajouter ou consulter les médias de ce compte rendu
                          </p>
                        </div>

                        <span className="text-sm font-bold text-amber-700 group-open:hidden">
                          Ouvrir ↓
                        </span>

                        <span className="hidden text-sm font-bold text-amber-700 group-open:inline">
                          Fermer ↑
                        </span>
                      </summary>

                      <div className="space-y-5 border-t border-slate-100 p-4">
                        <ProjectUpdateMediaUpload
                          projectId={project.id}
                          updateId={update.id}
                        />

                        <ProjectUpdateMediaGallery
                          projectId={project.id}
                          updateId={update.id}
                          updateTitle={update.title}
                          media={update.media}
                          canDelete={!archived}
                        />
                      </div>
                    </details>
                  )}

                  {/* Les médias restent consultables sur un chantier archivé */}
                  {archived && update.media.length > 0 && (
                    <div className="mt-5">
                      <ProjectUpdateMediaGallery
                        projectId={project.id}
                        updateId={update.id}
                        updateTitle={update.title}
                        media={update.media}
                        canDelete={false}
                      />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}