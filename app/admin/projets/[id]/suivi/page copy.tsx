import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ProjectStageStatus,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
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

const publishedUpdates = project.updates.filter(
  (update) => update.isPublished
).length;

const totalMedia = project.updates.reduce(
  (total, update) => total + update.media.length,
  0
);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-4">
        <Link
          href="/admin/projets"
          className="inline-flex text-sm font-semibold text-slate-600 hover:text-amber-700"
        >
          ← Retour aux chantiers
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Administration · Suivi de chantier
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#102A43]">
              {project.title}
            </h1>

            <p className="mt-2 text-slate-600">
              📍 {project.location}
            </p>
          </div>

          <Link
            href={`/admin/projets/${project.id}/modifier`}
            className="inline-flex justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Modifier le chantier
          </Link>
        </div>
      </header>

          <section
        aria-label="Résumé du chantier"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Progression générale
          </p>
          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {project.progress} %
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{
                width: `${Math.min(100, Math.max(0, project.progress))}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Étapes terminées
          </p>
          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {completedStages} / {project.stages.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Étapes techniques achevées
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Comptes rendus publiés
          </p>
          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {publishedUpdates}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Sur {project.updates.length} compte(s) rendu(s)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Photos et vidéos
          </p>
          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {totalMedia}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Médias associés aux comptes rendus
          </p>
        </div>
      </section>
      
      {archived && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
          Ce chantier est archivé. Son suivi reste consultable, mais les
          modifications sont désactivées jusqu'à sa restauration.
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Progression générale</p>
            <p className="mt-1 text-3xl font-black text-[#102A43]">
              {project.progress} %
            </p>
          </div>

          <div className="text-sm text-slate-500">
            <p>Début : {formatDate(project.startDate)}</p>
            <p className="mt-1">
              Fin prévue : {formatDate(project.expectedEndDate)}
            </p>
          </div>
        </div>

        <div
          className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label={`Progression de ${project.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={project.progress}
        >
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-black text-[#102A43]">
            1. Étapes techniques
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Définissez les étapes et actualisez leur état d'avancement.
          </p>
        </div>

        {!archived && (
          <form
            action={createProjectStage}
            className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <input type="hidden" name="projectId" value={project.id} />

            <h3 className="font-bold text-[#102A43]">
              Ajouter une étape
            </h3>

            <div>
              <label
                htmlFor="stage-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nom de l'étape *
              </label>
              <input
                id="stage-name"
                name="name"
                required
                maxLength={150}
                placeholder="Ex. Réalisation des fondations"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="w-fit rounded-xl bg-[#102A43] px-5 py-3 font-bold text-white hover:bg-[#1b4264]"
            >
              Ajouter l'étape
            </button>
          </form>
        )}

        {project.stages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Aucune étape technique n'a encore été créée.
          </div>
        ) : (
          <div className="space-y-4">
            {project.stages.map((stage, index) => (
              <article
                key={stage.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {archived ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-bold text-[#102A43]">
                        {index + 1}. {stage.name}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {stageStatusLabels[stage.status]}
                      </span>
                    </div>
                    {stage.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                        {stage.description}
                      </p>
                    )}
                  </>
                ) : (
                  <form
                    action={updateProjectStage}
                    className="space-y-4"
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
                          Nom de l'étape
                        </label>
                        <input
                          id={`stage-name-${stage.id}`}
                          name="name"
                          required
                          maxLength={150}
                          defaultValue={stage.name}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`stage-status-${stage.id}`}
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Statut
                        </label>
                        <select
                          id={`stage-status-${stage.id}`}
                          name="status"
                          defaultValue={stage.status}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
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
                        rows={2}
                        defaultValue={stage.description ?? ""}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Enregistrer l'étape
                    </button>
                  </form>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-black text-[#102A43]">
            2. Comptes rendus
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Documentez les travaux effectués et choisissez les mises à jour
            visibles sur le site public.
          </p>
        </div>

        {!archived && (
          <form
            action={createProjectUpdate}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <input type="hidden" name="projectId" value={project.id} />

            <h3 className="font-bold text-[#102A43]">
              Nouveau compte rendu
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="update-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Titre *
                </label>
                <input
                  id="update-title"
                  name="title"
                  required
                  maxLength={180}
                  placeholder="Ex. Achèvement des fondations"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
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
                placeholder="Décrivez les travaux réalisés, les résultats obtenus et la suite prévue..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="update-stage"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Étape associée
                </label>
                <select
                  id="update-stage"
                  name="stageId"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
              <input
                name="isPublished"
                type="checkbox"
                className="mt-1 h-4 w-4 accent-amber-500"
              />
              <span>
                <span className="block text-sm font-bold text-[#102A43]">
                  Publier immédiatement
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  Si cette case reste décochée, le compte rendu sera conservé
                  en brouillon.
                </span>
              </span>
            </label>

            <button
              type="submit"
              className="rounded-xl bg-[#102A43] px-5 py-3 font-bold text-white hover:bg-[#1b4264]"
            >
              Enregistrer le compte rendu
            </button>
          </form>
        )}

        {project.updates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Aucun compte rendu enregistré pour ce chantier.
          </div>
        ) : (
          <div className="space-y-4">
            {project.updates.map((update) => (
              <article
                key={update.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                      {formatDate(update.eventDate)}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-[#102A43]">
                      {update.title}
                    </h3>

                    {update.stage && (
                      <p className="mt-1 text-sm text-slate-500">
                        Étape : {update.stage.name}
                      </p>
                    )}
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                      update.isPublished
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {update.isPublished ? "Publié" : "Brouillon"}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {update.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-600">
                    Progression indiquée : {update.progress} %
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-500">
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
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {update.isPublished ? "Dépublier" : "Publier"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Zone d'ajout de photos et vidéos */}
                {!archived && (
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <ProjectUpdateMediaUpload
                      projectId={project.id}
                      updateId={update.id}
                    />
                  </div>
                )}

                {/* Affichage des photos et vidéos déjà enregistrées */}
                {update.media.length > 0 && (
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {update.media.map((media) => (
                      <div
                        key={media.id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                      >
                        {media.type === "VIDEO" ? (
                          <video
                            src={media.url}
                            controls
                            preload="metadata"
                            className="aspect-video w-full bg-black object-contain"
                          />
                        ) : (
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={media.url}
                              alt={media.caption ?? update.title}
                              loading="lazy"
                              className="aspect-video w-full object-cover"
                            />
                          </a>
                        )}

                        {media.caption && (
                          <p className="p-3 text-sm text-slate-600">
                            {media.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>


        )}

        
      </section>
    </div>
  );
}