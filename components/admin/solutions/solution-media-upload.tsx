"use client";

import { useRef, useState } from "react";
import {
  createSolutionMediaUploadSignature,
  ensureSolutionDraft,
  saveUploadedSolutionMedia,
} from "@/app/admin/solutions/media-actions";

type SolutionMedia = {
  id: string;
  url: string;
  publicId: string | null;
  type: "IMAGE" | "VIDEO";
  caption: string | null;
};

type Props = {
  initialSolutionId?: string;
  onSolutionReady?: (id: string) => void;
  onMediaUploaded?: (media: SolutionMedia[]) => void;
};

type UploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video";
};

type PreviewFile = {
  file: File;
  url: string;
  kind: "image" | "video";
};

export default function SolutionMediaUpload({
  initialSolutionId,
  onSolutionReady,
  onMediaUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [solutionId, setSolutionId] = useState(initialSolutionId ?? "");
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleFileSelection(files: FileList | null) {
    for (const preview of previews) {
      URL.revokeObjectURL(preview.url);
    }

    const selected = Array.from(files ?? []);
    const nextPreviews: PreviewFile[] = selected.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? "video" : "image",
    }));

    setPreviews(nextPreviews);
    setMessage("");
    setSuccess(false);
    setProgress(0);
  }

  async function handleUpload() {
    if (previews.length === 0) {
      setMessage("Sélectionne au moins une photo ou une vidéo.");
      setSuccess(false);
      return;
    }

    if (previews.length > 10) {
      setMessage("Tu peux sélectionner au maximum 10 fichiers par envoi.");
      setSuccess(false);
      return;
    }

    for (const { file } of previews) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setMessage(`Format non autorisé : ${file.name}`);
        setSuccess(false);
        return;
      }

      if (isImage && file.size > 10 * 1024 * 1024) {
        setMessage(`${file.name} dépasse la limite de 10 Mo.`);
        setSuccess(false);
        return;
      }

      if (isVideo && file.size > 50 * 1024 * 1024) {
        setMessage(`${file.name} dépasse la limite de 50 Mo.`);
        setSuccess(false);
        return;
      }
    }

    setLoading(true);
    setMessage("Préparation de l'envoi...");
    setSuccess(false);
    setProgress(0);

    try {
      let activeSolutionId = solutionId;

      if (!activeSolutionId) {
        const draftForm = new FormData();

        draftForm.set("name", "Nouvelle solution");
        draftForm.set("summary", "Solution en cours de création");
        draftForm.set("description", "Description en cours de rédaction");

        const draft = await ensureSolutionDraft(draftForm);

        activeSolutionId = draft.solutionId;
        setSolutionId(activeSolutionId);
        onSolutionReady?.(activeSolutionId);
      }

      const signatureForm = new FormData();
      signatureForm.set("solutionId", activeSolutionId);

      const signature =
        await createSolutionMediaUploadSignature(signatureForm);

      let uploadedCount = 0;

      for (const { file } of previews) {
        const resourceType = file.type.startsWith("video/")
          ? "video"
          : "image";

        setMessage(
          `Envoi ${uploadedCount + 1}/${previews.length} : ${file.name}`,
        );

        const uploadForm = new FormData();

        uploadForm.append("file", file);
        uploadForm.append("api_key", signature.apiKey);
        uploadForm.append("timestamp", String(signature.timestamp));
        uploadForm.append("folder", signature.folder);
        uploadForm.append("signature", signature.signature);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`,
          {
            method: "POST",
            body: uploadForm,
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message ?? `Échec de l'envoi de ${file.name}.`,
          );
        }

        const uploaded = result as UploadResult;

        if (
          uploaded.resource_type !== resourceType ||
          !uploaded.secure_url ||
          !uploaded.public_id
        ) {
          throw new Error(`Réponse Cloudinary invalide pour ${file.name}.`);
        }

        const saveForm = new FormData();

        saveForm.set("solutionId", activeSolutionId);
        saveForm.set("url", uploaded.secure_url);
        saveForm.set("publicId", uploaded.public_id);
        saveForm.set("resourceType", uploaded.resource_type);
        saveForm.set("caption", caption.trim());

        await saveUploadedSolutionMedia(saveForm);

        uploadedCount++;
        setProgress(Math.round((uploadedCount / previews.length) * 100));
      }

      setMessage(
        `${uploadedCount} fichier(s) envoyé(s) et enregistré(s) avec succès.`,
      );
      setSuccess(true);
      setPreviews([]);

      for (const preview of previews) {
        URL.revokeObjectURL(preview.url);
      }

      setCaption("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'envoi.",
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
          Identité visuelle
        </p>

        <h2 className="mt-2 text-xl font-bold text-[#102A43]">
          Galerie de la solution
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sélectionne les photos et vidéos depuis ton ordinateur. Les fichiers
          seront envoyés vers Cloudinary et associés à cette solution.
        </p>
      </div>

      <div>
        <label
          htmlFor="solution-media-files"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Photos et vidéos
        </label>

        <input
          ref={inputRef}
          id="solution-media-files"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          disabled={loading}
          onChange={(event) => handleFileSelection(event.target.files)}
          className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#102A43] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#1b4264] disabled:opacity-60"
        />

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Maximum 10 fichiers par envoi. Images : 10 Mo maximum par fichier.
          Vidéos : 50 Mo maximum par fichier. Formats : JPG, PNG, WebP, AVIF,
          MP4 et WebM.
        </p>
      </div>

      {previews.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Aperçu des fichiers sélectionnés ({previews.length})
          </h3>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {previews.map(({ file, url, kind }) => (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                {kind === "image" ? (
                  <img
                    src={url}
                    alt={file.name}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <video
                    src={url}
                    controls
                    preload="metadata"
                    className="h-36 w-full object-cover"
                  />
                )}

                <p className="break-words p-2 text-xs text-slate-600">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="solution-media-caption"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Légende commune (facultative)
        </label>

        <input
          id="solution-media-caption"
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          maxLength={250}
          disabled={loading}
          placeholder="Ex. Interface de gestion de la solution"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:opacity-60"
        />
      </div>

      {loading && (
        <div>
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
            <span>Envoi des fichiers</span>
            <span>{progress} %</span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || previews.length === 0}
        className="inline-flex items-center justify-center rounded-xl bg-[#102A43] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b4264] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Envoi en cours..." : "Envoyer les médias"}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-xl p-3 text-sm ${
            success
              ? "bg-emerald-50 text-emerald-800"
              : "bg-slate-50 text-slate-700"
          }`}
        >
          {message}
        </p>
      )}
    </section>
  );
}