"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProjectMediaUploadSignature,
  saveUploadedProjectLevelMedia,
} from "@/app/admin/projets/media-actions";

type Props = {
  projectId: string;
};

type UploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video";
};

const MAX_FILES = 10;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function validateFile(file: File): string | null {
  if (
    !ACCEPTED_IMAGE_TYPES.includes(file.type) &&
    !ACCEPTED_VIDEO_TYPES.includes(file.type)
  ) {
    return `${file.name} : format non autorisé.`;
  }

  if (
    ACCEPTED_IMAGE_TYPES.includes(file.type) &&
    file.size > MAX_IMAGE_SIZE
  ) {
    return `${file.name} dépasse la limite de 10 Mo.`;
  }

  if (
    ACCEPTED_VIDEO_TYPES.includes(file.type) &&
    file.size > MAX_VIDEO_SIZE
  ) {
    return `${file.name} dépasse la limite de 50 Mo.`;
  }

  return null;
}

export default function ProjectMediaUpload({ projectId }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");

  function addFiles(incomingFiles: FileList | File[]) {
    if (loading) return;

    const incoming = Array.from(incomingFiles);
    const errors: string[] = [];
    const accepted: File[] = [];

    for (const file of incoming) {
      const validationError = validateFile(file);

      if (validationError) {
        errors.push(validationError);
        continue;
      }

      accepted.push(file);
    }

    const combined = [...files];

    for (const file of accepted) {
      if (combined.length >= MAX_FILES) {
        errors.push(`Maximum ${MAX_FILES} fichiers par envoi.`);
        break;
      }

      // Éviter les doublons portant le même nom, la même taille
      // et la même date de modification.
      const duplicate = combined.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      );

      if (!duplicate) {
        combined.push(file);
      }
    }

    setFiles(combined);
    setSuccess(false);
    setMessage(
      errors.length > 0
        ? errors.slice(0, 3).join(" ")
        : ""
    );
  }

  function removeFile(index: number) {
    if (loading) return;

    setFiles((current) => current.filter((_, i) => i !== index));
    setMessage("");
    setSuccess(false);
  }

  async function handleUpload() {
    if (loading) return;

    if (files.length === 0) {
      setMessage("Ajoute au moins une photo ou une vidéo.");
      setSuccess(false);
      return;
    }

    const invalidFile = files.find((file) => validateFile(file));

    if (invalidFile) {
      setMessage(validateFile(invalidFile) ?? "Fichier invalide.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setProgress(0);
    setMessage("");
    setSuccess(false);

    let uploadedCount = 0;

    try {
      const signatureForm = new FormData();
      signatureForm.set("projectId", projectId);

      const signatureData =
        await createProjectMediaUploadSignature(signatureForm);

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        setCurrentFile(file.name);
        setMessage(
          `Envoi du fichier ${index + 1} sur ${files.length}…`
        );

        const resourceType = ACCEPTED_VIDEO_TYPES.includes(file.type)
          ? "video"
          : "image";

        const uploadForm = new FormData();

        uploadForm.append("file", file);
        uploadForm.append("api_key", signatureData.apiKey);
        uploadForm.append("timestamp", String(signatureData.timestamp));
        uploadForm.append("folder", signatureData.folder);
        uploadForm.append("signature", signatureData.signature);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`,
          {
            method: "POST",
            body: uploadForm,
          }
        );

        const result = (await response.json()) as
          | UploadResult
          | { error?: { message?: string } };

        if (!response.ok) {
          throw new Error(
            "error" in result
              ? result.error?.message ??
                  `Échec de l'envoi de ${file.name}.`
              : `Échec de l'envoi de ${file.name}.`
          );
        }

        const uploaded = result as UploadResult;

        if (
          uploaded.resource_type !== resourceType ||
          !uploaded.secure_url ||
          !uploaded.public_id
        ) {
          throw new Error(
            `La réponse reçue pour ${file.name} est invalide.`
          );
        }

        const saveForm = new FormData();

        saveForm.set("projectId", projectId);
        saveForm.set("url", uploaded.secure_url);
        saveForm.set("publicId", uploaded.public_id);
        saveForm.set("resourceType", uploaded.resource_type);
        saveForm.set("caption", caption.trim());

        await saveUploadedProjectLevelMedia(saveForm);

        uploadedCount++;
        setProgress(Math.round((uploadedCount / files.length) * 100));
      }

      setFiles([]);
      setCaption("");
      setMessage(
        `${uploadedCount} fichier${uploadedCount > 1 ? "s" : ""} ajouté${uploadedCount > 1 ? "s" : ""} à la galerie.`
      );
      setSuccess(true);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      setMessage(
        uploadedCount > 0
          ? `${uploadedCount} fichier${uploadedCount > 1 ? "s ont" : " a"} été enregistré${uploadedCount > 1 ? "s" : ""}. L'envoi a été interrompu : ${
              error instanceof Error
                ? error.message
                : "une erreur est survenue."
            } Vérifie la galerie avant de relancer l'envoi.`
          : error instanceof Error
            ? error.message
            : "Une erreur est survenue pendant l'envoi."
      );

      setSuccess(false);
    } finally {
      setLoading(false);
      setCurrentFile("");
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_45px_-30px_rgba(15,23,42,0.25)]">
      {/* En-tête */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-700">
            <span aria-hidden="true">↥</span>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              Gestion des visuels
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-[#102A43] sm:text-2xl">
              Ajouter des médias
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Enrichis la présentation de ce chantier avec des photos
              et des vidéos de qualité. Tu peux sélectionner plusieurs
              fichiers en une seule opération.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-8">
        {/* Zone de dépôt */}
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            if (!loading) setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);

            if (!loading) {
              addFiles(event.dataTransfer.files);
            }
          }}
          className={`flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition ${
            dragging
              ? "border-amber-500 bg-amber-50"
              : "border-slate-300 bg-slate-50/70 hover:border-amber-400 hover:bg-amber-50/40"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl text-[#102A43] shadow-sm">
            <span aria-hidden="true">＋</span>
          </span>

          <span className="mt-4 text-base font-bold text-[#102A43]">
            {dragging
              ? "Dépose tes fichiers ici"
              : "Glisse tes fichiers ici"}
          </span>

          <span className="mt-2 text-sm text-slate-500">
            ou clique pour parcourir tes fichiers
          </span>

          <span className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            JPG · PNG · WebP · AVIF · MP4 · WebM
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          disabled={loading}
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
            }

            // Permet de sélectionner à nouveau le même fichier.
            event.target.value = "";
          }}
          className="sr-only"
          aria-label="Sélectionner des photos et vidéos"
        />

        {/* Limites */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-500">
              Nombre de fichiers
            </p>
            <p className="mt-1 text-sm font-bold text-[#102A43]">
              {files.length}/{MAX_FILES} sélectionnés
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-500">
              Photos
            </p>
            <p className="mt-1 text-sm font-bold text-[#102A43]">
              10 Mo maximum par fichier
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-500">
              Vidéos
            </p>
            <p className="mt-1 text-sm font-bold text-[#102A43]">
              50 Mo maximum par fichier
            </p>
          </div>
        </div>

        {/* Fichiers sélectionnés */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-[#102A43]">
                  Fichiers sélectionnés
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Vérifie ta sélection avant l'envoi.
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setFiles([]);
                  setMessage("");
                  setSuccess(false);
                }}
                className="text-xs font-semibold text-slate-500 transition hover:text-red-600 disabled:opacity-50"
              >
                Tout retirer
              </button>
            </div>

            <div className="space-y-2">
              {files.map((file, index) => {
                const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

                return (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                      <span aria-hidden="true">
                        {isVideo ? "▷" : "▧"}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        title={file.name}
                        className="truncate text-sm font-semibold text-slate-800"
                      >
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {isVideo ? "Vidéo" : "Photo"} ·{" "}
                        {formatSize(file.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => removeFile(index)}
                      aria-label={`Retirer ${file.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Légende commune */}
        <div>
          <label
            htmlFor="project-media-caption"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Légende des médias{" "}
            <span className="font-normal text-slate-400">
              (facultatif)
            </span>
          </label>

          <input
            id="project-media-caption"
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={250}
            disabled={loading}
            placeholder="Ex. Vue générale du bâtiment en construction"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:opacity-60"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Cette légende sera appliquée à tous les fichiers de cet envoi.
          </p>
        </div>

        {/* Progression */}
        {loading && (
          <div
            className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-semibold text-[#102A43]">
                {currentFile || "Préparation de l'envoi…"}
              </p>
              <span className="shrink-0 text-sm font-bold text-amber-700">
                {progress} %
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-label="Progression des fichiers enregistrés"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-slate-500">
              Garde cette page ouverte jusqu'à la fin de l'opération.
            </p>
          </div>
        )}

        {/* Retour utilisateur */}
        {message && (
          <div
            role={success ? "status" : "alert"}
            aria-live="polite"
            className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
              success
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <p className="font-semibold">
              {success ? "Envoi terminé" : loading ? "Envoi en cours" : "Information"}
            </p>
            <p className="mt-1">{message}</p>
          </div>
        )}

        {/* Action principale */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Les fichiers seront ajoutés à la galerie du chantier.
          </p>

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#102A43] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1b4264] focus:outline-none focus:ring-4 focus:ring-[#102A43]/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">{loading ? "…" : "↑"}</span>
            {loading
              ? "Envoi en cours…"
              : `Envoyer ${files.length > 0 ? files.length : ""} média${files.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </section>
  );
}