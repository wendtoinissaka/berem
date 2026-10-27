"use client";

import { useState } from "react";
import Link from "next/link";
import SolutionMediaUpload from "@/components/admin/solutions/solution-media-upload";
import { createSolution, updateSolution } from "@/app/admin/solutions/actions";
import SolutionBrandImageUpload from "@/components/admin/solutions/solution-brand-image-upload";

type Feature = {
  title: string;
  description: string;
};

type SolutionFormData = {
  id?: string;
  name?: string;
  summary?: string;
  description?: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  websiteUrl?: string | null;
  actionLabel?: string | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured?: boolean;
  sortOrder?: number;
  features?: Feature[];
};

type Props = {
  initialData?: SolutionFormData;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

const labelClass = "block text-sm font-semibold text-slate-700";

export default function SolutionForm({ initialData }: Props) {
  const isEditing = Boolean(initialData?.id);

  const [solutionId, setSolutionId] = useState(initialData?.id ?? "");
  const [features, setFeatures] = useState<Feature[]>(
    initialData?.features?.length
      ? initialData.features
      : [{ title: "", description: "" }],
  );

  const [logoUrl, setLogoUrl] = useState(
  initialData?.logoUrl ?? ""
);

const [coverImageUrl, setCoverImageUrl] = useState(
  initialData?.coverImageUrl ?? ""
);

  function updateFeature(
    index: number,
    field: keyof Feature,
    value: string,
  ) {
    setFeatures((current) =>
      current.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature,
      ),
    );
  }

  function addFeature() {
    setFeatures((current) => [
      ...current,
      { title: "", description: "" },
    ]);
  }

  function removeFeature(index: number) {
    setFeatures((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    if (solutionId) {
      formData.set("id", solutionId);
    }

    formData.delete("featureTitle");
    formData.delete("featureDescription");

    for (const feature of features) {
      formData.append("featureTitle", feature.title);
      formData.append("featureDescription", feature.description);
    }

    if (isEditing) {
      await updateSolution(formData);
    } else {
      await createSolution(formData);
    }
  }

  return (
<form action={handleSubmit} className="space-y-8">
  <input type="hidden" name="id" value={solutionId} />

  <input type="hidden" name="logoUrl" value={logoUrl} />

  <input
    type="hidden"
    name="coverImageUrl"
    value={coverImageUrl}
  />
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Présentation
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#102A43]">
            1. Informations générales
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Présente clairement la solution et sa valeur ajoutée.
          </p>
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>
            Nom de la solution *
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            defaultValue={initialData?.name ?? ""}
            placeholder="Ex. M’ZAKA"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="summary" className={labelClass}>
            Résumé *
          </label>
          <textarea
            id="summary"
            name="summary"
            required
            maxLength={300}
            rows={3}
            defaultValue={initialData?.summary ?? ""}
            placeholder="Présentez la solution en quelques phrases."
            className={inputClass}
          />
          <p className="mt-2 text-xs text-slate-500">
            300 caractères maximum.
          </p>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description détaillée *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={7}
            defaultValue={initialData?.description ?? ""}
            placeholder="Expliquez le problème traité, le fonctionnement et les avantages."
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Fonctionnalités
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#102A43]">
            2. Fonctionnalités de la solution
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ajoute autant de fonctionnalités que nécessaire.
          </p>
        </div>

        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-[#102A43]">
                Fonctionnalité {index + 1}
              </h3>

              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className={labelClass}>
                Nom de la fonctionnalité
              </label>
              <input
                value={feature.title}
                onChange={(event) =>
                  updateFeature(index, "title", event.target.value)
                }
                maxLength={120}
                placeholder="Ex. Gestion des paiements"
                className={inputClass}
              />
            </div>

            <div className="mt-4">
              <label className={labelClass}>Description</label>
              <textarea
                value={feature.description}
                onChange={(event) =>
                  updateFeature(index, "description", event.target.value)
                }
                rows={2}
                maxLength={1000}
                placeholder="Décris brièvement cette fonctionnalité."
                className={inputClass}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addFeature}
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-[#102A43] transition hover:bg-amber-100"
        >
          + Ajouter une fonctionnalité
        </button>
      </section>

{/* Identité visuelle de la solution */}
<section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
      Identité visuelle
    </p>

    <h2 className="mt-2 text-xl font-bold text-[#102A43]">
      3. Logo et image de couverture
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Ajoute le logo de la solution et une image qui la représente.
      Les images sont envoyées vers Cloudinary.
    </p>
  </div>

  <div className="grid gap-6 lg:grid-cols-2">
    <SolutionBrandImageUpload
      kind="logo"
      solutionId={solutionId || undefined}
      initialUrl={logoUrl}
      onSolutionReady={setSolutionId}
      onUrlChange={setLogoUrl}
    />

    <SolutionBrandImageUpload
      kind="couverture"
      solutionId={solutionId || undefined}
      initialUrl={coverImageUrl}
      onSolutionReady={setSolutionId}
      onUrlChange={setCoverImageUrl}
    />
  </div>
</section>

{/* Galerie de la solution */}
<section className="space-y-4">
  <div>
    <h2 className="text-xl font-bold text-[#102A43]">
      4. Galerie de médias
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Ajoute les captures d'écran, illustrations et vidéos de présentation.
    </p>
  </div>

  <SolutionMediaUpload
    initialSolutionId={solutionId || undefined}
    onSolutionReady={setSolutionId}
  />
</section>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Liens
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#102A43]">
            3. Liens et présentation
          </h2>
        </div>

        <div>
          <label htmlFor="websiteUrl" className={labelClass}>
            Site web de la solution
          </label>
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={initialData?.websiteUrl ?? ""}
            placeholder="https://exemple.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="actionLabel" className={labelClass}>
            Texte du bouton
          </label>
          <input
            id="actionLabel"
            name="actionLabel"
            maxLength={80}
            defaultValue={
              initialData?.actionLabel ?? "Découvrir la solution"
            }
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Publication
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#102A43]">
            4. Visibilité de la solution
          </h2>
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status ?? "DRAFT"}
            className={inputClass}
          >
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
            <option value="ARCHIVED">Archivé</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className={labelClass}>
            Ordre d'affichage
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            step={1}
            defaultValue={initialData?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initialData?.isFeatured ?? false}
            className="mt-1 size-4 accent-amber-500"
          />
          <span>
            <span className="block font-semibold text-[#102A43]">
              Mettre en avant sur la page d'accueil
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              Cette option s'appliquera uniquement si la solution est publiée.
            </span>
          </span>
        </label>
      </section>

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Link
          href="/admin/solutions"
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Annuler
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-[#102A43] px-6 py-3 font-bold text-white transition hover:bg-[#183d5d]"
        >
          {isEditing ? "Enregistrer les modifications" : "Enregistrer la solution"}
        </button>
      </div>
    </form>
  );
}