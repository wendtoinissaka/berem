"use client";

import { useState } from "react";
import Link from "next/link";
import type {
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

const projectStatuses: ProjectStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
];

const projectTypes: ProjectType[] = [
  "BUILDING",
  "ROAD",
  "SANITATION",
  "ENGINEERING_STRUCTURE",
  "OTHER",
];

function formatDate(date: Date | null) {
  if (!date) return "";

  const value = new Date(date);

  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

  const [startDate, setStartDate] = useState(
    formatDate(project?.startDate ?? null)
  );

  const [expectedEndDate, setExpectedEndDate] = useState(
    formatDate(project?.expectedEndDate ?? null)
  );

  function handleStartDateChange(value: string) {
    setStartDate(value);

    if (value && expectedEndDate && expectedEndDate <= value) {
      setExpectedEndDate("");
    }
  }

  const minimumEndDate = (() => {
    if (!startDate) return undefined;

    const nextDate = new Date(`${startDate}T00:00:00.000Z`);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    return nextDate.toISOString().slice(0, 10);
  })();

  return (
    <form
      action={isEditing ? updateProject : createProject}
      className="space-y-8"
    >
      {project?.id && (
        <input type="hidden" name="id" value={project.id} />
      )}

      {/* Informations générales */}
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

      {/* Catégorie */}
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
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500"
        >
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {typeLabels[type]}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
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

      {/* Statut, progression et publication */}
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
            required
            defaultValue={project?.status ?? "PLANNED"}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            {projectStatuses.map((status) => (
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
            Progression (%) *
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

      {/* Dates du chantier */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-5">
          <h3 className="font-bold text-slate-800">
            Planification du chantier
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Indiquez les dates de début et de fin prévues du chantier.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Date de début *
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="expectedEndDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Date de fin prévue *
            </label>

            <input
              id="expectedEndDate"
              name="expectedEndDate"
              type="date"
              required
              min={minimumEndDate}
              value={expectedEndDate}
              onChange={(e) => setExpectedEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              La date de fin doit être postérieure à la date de début.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          className="rounded-xl bg-[#102A43] px-6 py-3 font-bold text-white transition hover:bg-[#1b4264] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {isEditing
            ? "Enregistrer les modifications"
            : "Créer le chantier"}
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