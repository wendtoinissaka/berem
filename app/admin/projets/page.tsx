import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@/generated/prisma/client";
import DeleteProjectButton from "@/components/admin/projets/delete-project-button";
import {
  archiveProject,
  restoreProject,
  toggleProjectPublication,
} from "./actions";

export const instant = false;

export const metadata = {
  title: "Gestion des chantiers | BEREM Admin",
};

const statusLabels: Record<ProjectStatus, string> = {
  PLANNED: "Planifié",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  ON_HOLD: "En pause",
};

const statusStyles: Record<ProjectStatus, string> = {
  PLANNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  ON_HOLD: "bg-slate-200 text-slate-700",
};

export default async function AdminProjectsPage() {
  const [projects, total, published, ongoing, archived] = await Promise.all([
    prisma.project.findMany({
      where: { archivedAt: null },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { media: true, updates: true },
        },
      },
    }),
    prisma.project.count({ where: { archivedAt: null } }),
    prisma.project.count({
      where: { isPublished: true, archivedAt: null },
    }),
    prisma.project.count({
      where: { status: "IN_PROGRESS", archivedAt: null },
    }),
    prisma.project.count({ where: { archivedAt: { not: null } } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#10161F]">
            Gestion des chantiers
          </h1>
          <p className="mt-2 text-slate-600">
            Créez, modifiez et gérez les réalisations présentées par BEREM.
          </p>
        </div>

        <Link
          href="/admin/projets/nouveau"
          className="inline-flex items-center justify-center rounded-xl bg-[#102A43] px-5 py-3 font-bold text-white transition hover:bg-[#1b4264]"
        >
          + Nouveau chantier
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[
          { label: "Total chantiers", value: total },
          { label: "Publiés", value: published },
          { label: "En cours", value: ongoing },
          { label: "Brouillons", value: total - published },
          { label: "Archivés", value: archived },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-black text-[#102A43]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-[#102A43]">
            Tous les chantiers
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Les chantiers non publiés restent invisibles sur le site public.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-[#102A43]">
              Aucun chantier enregistré
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Commencez par ajouter votre premier chantier.
            </p>
            <Link
              href="/admin/projets/nouveau"
              className="mt-5 inline-flex rounded-xl bg-amber-500 px-5 py-3 font-bold text-[#102A43] hover:bg-amber-400"
            >
              Créer un chantier
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col gap-5 p-6 xl:flex-row xl:items-center xl:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-[#102A43]">
                      {project.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[project.status]}`}
                    >
                      {statusLabels[project.status]}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        project.isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {project.isPublished ? "Publié" : "Brouillon"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    📍 {project.location}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>

                  <div className="mt-4 max-w-md">
                    <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                      <span>Progression</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`Progression de ${project.title}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={project.progress}
                    >
                      <div
                        className="h-full rounded-full bg-[#D59344]"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    {project._count.media} média(s) · {project._count.updates} mise(s) à jour
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/projets/${project.id}/modifier`}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Modifier
                  </Link>

                  <Link
                    href={`/admin/projets/${project.id}/suivi`}
                    className="rounded-lg bg-[#102A43] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1b4264]"
                  >
                    Gérer le suivi
                  </Link>

                  <form action={toggleProjectPublication}>
                    <input
                      type="hidden"
                      name="id"
                      value={project.id}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50"
                    >
                      {project.isPublished ? "Dépublier" : "Publier"}
                    </button>
                  </form>

                    {/* <DeleteProjectButton
                    projectId={project.id}
                    projectTitle={project.title}
                    /> */}

                  <form action={archiveProject}>
                  <input type="hidden" name="id" value={project.id} />

                  <button
                    type="submit"
                    className="rounded-lg border border-orange-300 px-4 py-2 text-sm font-semibold text-orange-800 hover:bg-orange-50"
                  >
                    Archiver
                  </button>
                </form>

                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}