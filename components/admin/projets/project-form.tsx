import Link from "next/link";
import {
  ProjectStatus,
  ProjectType,
} from "@/generated/prisma/client";
import { createProject, updateProject } from "@/app/admin/projets/actions";

type ProjectFormData = {
  id?: string;
  title: string;
  description: string;
  location: string;
  type: ProjectType;
  status: ProjectStatus;
  progress: number;
  startDate: Date | null;
  expectedEndDate: Date | null;
  isPublished: boolean;
};

function formatDate(date: Date | null) {
  if (!date) return "";

  return new Date(date).toISOString().slice(0, 10);
}

const statusLabels: Record<ProjectStatus, string> = {
  PLANNED: "Planifié",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  ON_HOLD: "En pause",
};

const typeLabels: Record<ProjectType, string> = {
  BUILDING: "Bâtiment",
  ROAD: "Route et voirie",
  SANITATION: "Assainissement",
  ENGINEERING_STRUCTURE: "Ouvrage d'art",
  OTHER: "Autre",
};

export default function ProjectForm({
  project,
}: {
  project?: ProjectFormData;
}) {
  const isEditing = Boolean(project);

  return (
    <form
      action={isEditing ? updateProject : createProject}
      className="space-y-8"
    >
      {project?.id && (
        <input type="hidden" name="id" value={project.id} />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Nom du chantier *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={150}
            defaultValue={project?.title ?? ""}
            placeholder="Ex. Construction d'un bâtiment administratif"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Localisation *
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            maxLength={200}
            defaultValue={project?.location ?? ""}
            placeholder="Ex. Ouagadougou, Burkina Faso"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      <div>
  <label
    htmlFor="type"
    className="mb-2 block text-sm font-semibold text-slate-700"
  >
    Catégorie du chantier *
  </label>

  <select
    id="type"
    name="type"
    required
    defaultValue={project?.type ?? "OTHER"}
    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
  >
    {Object.values(ProjectType).map((type) => (
      <option key={type} value={type}>
        {typeLabels[type]}
      </option>
    ))}
  </select>
</div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Description du chantier *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={project?.description ?? ""}
          placeholder="Présentez le projet, les travaux réalisés et les objectifs..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Statut *
          </label>
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "PLANNED"}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            {Object.values(ProjectStatus).map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="progress"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Progression (%)
          </label>
          <input
            id="progress"
            name="progress"
            type="number"
            min={0}
            max={100}
            step={1}
            required
            defaultValue={project?.progress ?? 0}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            defaultChecked={project?.isPublished ?? false}
            className="h-5 w-5 accent-amber-500"
          />
          <label
            htmlFor="isPublished"
            className="text-sm font-semibold text-slate-700"
          >
            Publier sur le site
          </label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="startDate"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Date de début
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={formatDate(project?.startDate ?? null)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="expectedEndDate"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Date de fin prévue
          </label>
          <input
            id="expectedEndDate"
            name="expectedEndDate"
            type="date"
            defaultValue={formatDate(project?.expectedEndDate ?? null)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          className="rounded-xl bg-[#102A43] px-6 py-3 font-bold text-white transition hover:bg-[#1b4264]"
        >
          {isEditing ? "Enregistrer les modifications" : "Créer le chantier"}
        </button>

        <Link
          href="/admin/projets"
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}