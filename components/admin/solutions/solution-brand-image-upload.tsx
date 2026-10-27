"use client";

import { useRef, useState } from "react";

import {
  createSolutionMediaUploadSignature,
  ensureSolutionDraft,
  saveUploadedSolutionBrandImage,
} from "@/app/admin/solutions/media-actions";

type ImageKind = "logo" | "couverture";

type Props = {
  kind: ImageKind;
  solutionId?: string;
  initialUrl?: string | null;
  onSolutionReady: (id: string) => void;
  onUrlChange: (url: string) => void;
};

export default function SolutionBrandImageUpload({
  kind,
  solutionId,
  initialUrl,
  onSolutionReady,
  onUrlChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const label = kind === "logo" ? "Logo" : "Image de couverture";

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];

    if (!file) {
      setMessage("Sélectionne une image.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Le fichier doit être une image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("L'image ne doit pas dépasser 10 Mo.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const draftForm = new FormData();

      if (solutionId) {
        draftForm.set("solutionId", solutionId);
      }

      const draft = await ensureSolutionDraft(draftForm);

      onSolutionReady(draft.solutionId);

      const signatureForm = new FormData();

      signatureForm.set("solutionId", draft.solutionId);
      signatureForm.set("category", kind);

      const signature =
        await createSolutionMediaUploadSignature(signatureForm);

      const body = new FormData();

      body.append("file", file);
      body.append("api_key", signature.apiKey);
      body.append("timestamp", String(signature.timestamp));
      body.append("folder", signature.folder);
      body.append("signature", signature.signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
        {
          method: "POST",
          body,
        }
      );

      const uploaded = await response.json();

      if (!response.ok) {
        throw new Error(
          uploaded.error?.message || "Échec de l'envoi vers Cloudinary."
        );
      }

      const saveForm = new FormData();

      saveForm.set("solutionId", draft.solutionId);
      saveForm.set("url", uploaded.secure_url);
      saveForm.set("publicId", uploaded.public_id);
      saveForm.set("category", kind);

      const saved = await saveUploadedSolutionBrandImage(saveForm);

      setPreview(saved.url);
      onUrlChange(saved.url);

      setMessage(`${label} enregistré avec succès.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'envoi."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 p-4">
      <div>
        <h3 className="font-semibold text-slate-900">{label}</h3>

        <p className="mt-1 text-sm text-slate-500">
          Formats image acceptés selon la configuration Cloudinary.
          Taille maximale : 10 Mo.
        </p>
      </div>

      {preview && (
        <div className="flex h-40 items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={`Aperçu : ${label}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={() => setMessage("")}
        className="block w-full text-sm"
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading
          ? "Envoi en cours..."
          : preview
            ? `Remplacer le ${label.toLowerCase()}`
            : `Envoyer le ${label.toLowerCase()}`}
      </button>

      {message && (
        <p className="text-sm text-slate-600" role="status">
          {message}
        </p>
      )}
    </section>
  );
}