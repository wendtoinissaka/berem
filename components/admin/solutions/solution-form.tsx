"use client";

import { useState } from "react";
import Link from "next/link";
import SolutionMediaUpload from "@/components/admin/solutions/solution-media-upload";
import { createSolution, updateSolution } from "@/app/admin/solutions/actions";
import SolutionBrandImageUpload from "@/components/admin/solutions/solution-brand-image-upload";
import { deleteSolutionMedia } from "@/app/admin/solutions/media-actions";
import {
  Trash2,
  Image as ImageIcon,
  Video,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";


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
  media?: SolutionMedia[];
};

type Props = {
  initialData?: SolutionFormData;
};

type SolutionMedia = {
  id: string;
  url: string;
  publicId: string | null;
  type: "IMAGE" | "VIDEO";
  caption: string | null;
};


const inputClass =
  "mt-2 w-full rounded-xl border border-[#EAE1D7] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#647084]/70 focus:border-[#D59344] focus:ring-2 focus:ring-[#D59344]/15";

const labelClass =
  "block text-sm font-semibold text-[#26364A]";

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

const [media, setMedia] = useState<SolutionMedia[]>(
  initialData?.media ?? [],
);

const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
const [mediaMessage, setMediaMessage] = useState("");
const [mediaToDelete, setMediaToDelete] = useState<SolutionMedia | null>(null);

function requestMediaDeletion(item: SolutionMedia) {
  setMediaToDelete(item);
}

async function confirmMediaDeletion() {
  if (!mediaToDelete) return;

  const mediaId = mediaToDelete.id;

  setDeletingMediaId(mediaId);
  setMediaMessage("");

  try {
    const formData = new FormData();
    formData.set("mediaId", mediaId);
    formData.set("solutionId", solutionId);

    await deleteSolutionMedia(formData);

    setMedia((current) => current.filter((item) => item.id !== mediaId));
    setMediaMessage("Le média a été supprimé avec succès.");
    setMediaToDelete(null);
  } catch (error) {
    setMediaMessage(
      error instanceof Error
        ? error.message
        : "Impossible de supprimer ce média.",
    );
  } finally {
    setDeletingMediaId(null);
  }
}


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
<section className="space-y-6 rounded-2xl border border-[#EAE1D7] bg-white p-6 shadow-sm sm:p-8">

  <div>
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D59344]">
      Médias
    </p>

    <h2 className="mt-2 text-xl font-bold text-[#10161F]">
      4. Galerie de la solution
    </h2>

    <p className="mt-1 text-sm text-[#647084]">
      Consulte les médias enregistrés, supprime ceux qui ne sont plus utiles
      ou ajoute de nouveaux fichiers.
    </p>
  </div>

  {media.length > 0 ? (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {media.map((item) => (
        <div
          key={item.id}
          className="group overflow-hidden rounded-xl border border-[#EAE1D7] bg-[#FBF7F1] shadow-sm transition hover:shadow-md"
        >
          {item.type === "IMAGE" ? (
            <img
              src={item.url}
              alt={item.caption || "Média de la solution"}
              className="h-40 w-full object-cover"
            />
          ) : (
            <video
              src={item.url}
              controls
              preload="metadata"
              className="h-40 w-full bg-[#10161F] object-contain"
            />
          )}

          <div className="space-y-3 p-3">

            <div className="flex items-center gap-2 text-xs font-medium text-[#647084]">
              {item.type === "IMAGE" ? (
                <ImageIcon size={15} />
              ) : (
                <Video size={15} />
              )}

              <span>
                {item.type === "IMAGE" ? "Image" : "Vidéo"}
              </span>
            </div>

            {item.caption && (
              <p className="line-clamp-2 text-sm text-[#26364A]">
                {item.caption}
              </p>
            )}

            <button
              type="button"
              onClick={() => requestMediaDeletion(item)}
              disabled={Boolean(deletingMediaId)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={15} />
              Supprimer
            </button>

          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-xl border border-dashed border-[#D9CBBB] bg-[#FBF7F1] p-8 text-center">
      <ImageIcon className="mx-auto text-[#647084]" size={30} />

      <p className="mt-3 text-sm font-semibold text-[#26364A]">
        Aucun média enregistré
      </p>

      <p className="mt-1 text-xs text-[#647084]">
        Les images et vidéos ajoutées apparaîtront ici.
      </p>
    </div>
  )}

  {mediaMessage && (
    <div
      role="status"
      className="rounded-lg border border-[#EAE1D7] bg-[#FBF7F1] px-4 py-3 text-sm text-[#26364A]"
    >
      {mediaMessage}
    </div>
  )}

  <div className="border-t border-[#EAE1D7] pt-6">
    <h3 className="mb-2 font-bold text-[#10161F]">
      Ajouter de nouveaux médias
    </h3>

    <p className="mb-4 text-sm text-[#647084]">
      Tu peux ajouter des captures d'écran, des illustrations ou des vidéos
      pour enrichir la présentation de cette solution.
    </p>

<SolutionMediaUpload
  initialSolutionId={solutionId || undefined}
  onSolutionReady={setSolutionId}
  onMediaUploaded={(newMedia) => {
    setMedia((current) => [...current, ...newMedia]);
  }}
/>
  </div>

</section>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Liens
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#102A43]">
            5. Liens et présentation
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
            6. Visibilité de la solution
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
      {mediaToDelete && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10161F]/70 p-4 backdrop-blur-sm"
    role="presentation"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget && !deletingMediaId) {
        setMediaToDelete(null);
      }
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-media-title"
      aria-describedby="delete-media-description"
      className="w-full max-w-md overflow-hidden rounded-2xl border border-[#EAE1D7] bg-[#FBF7F1] shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-[#EAE1D7] px-6 py-4">
        <h3 className="font-bold text-[#10161F]">
          Confirmation de suppression
        </h3>

        <button
          type="button"
          onClick={() => setMediaToDelete(null)}
          disabled={Boolean(deletingMediaId)}
          aria-label="Fermer"
          className="rounded-lg p-2 text-[#647084] transition hover:bg-[#F3E9DC] hover:text-[#10161F] disabled:opacity-50"
        >
          <X size={19} />
        </button>
      </div>

      <div className="p-6">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle size={27} />
        </div>

        <h4
          id="delete-media-title"
          className="mt-4 text-center text-lg font-bold text-[#10161F]"
        >
          Supprimer définitivement ce média ?
        </h4>

        <p
          id="delete-media-description"
          className="mt-2 text-center text-sm leading-6 text-[#647084]"
        >
          Cette action supprimera le fichier de la galerie et de son espace
          de stockage. Cette opération est irréversible.
        </p>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#EAE1D7] bg-white p-2">
          {mediaToDelete.type === "IMAGE" ? (
            <img
              src={mediaToDelete.url}
              alt={mediaToDelete.caption || "Média à supprimer"}
              className="h-36 w-full rounded-lg object-contain"
            />
          ) : (
            <video
              src={mediaToDelete.url}
              controls
              preload="metadata"
              className="h-36 w-full rounded-lg bg-[#10161F] object-contain"
            />
          )}

          {mediaToDelete.caption && (
            <p className="px-2 pb-1 pt-2 text-center text-xs text-[#647084]">
              {mediaToDelete.caption}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setMediaToDelete(null)}
            disabled={Boolean(deletingMediaId)}
            className="flex-1 rounded-xl border border-[#D9CBBB] bg-white px-4 py-3 text-sm font-semibold text-[#26364A] transition hover:bg-[#F3E9DC] disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={confirmMediaDeletion}
            disabled={Boolean(deletingMediaId)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deletingMediaId ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Supprimer définitivement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </form>
  );
}