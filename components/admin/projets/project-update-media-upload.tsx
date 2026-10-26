"use client";

import { useRef, useState } from "react";
import {
  createMediaUploadSignature,
  saveUploadedProjectMedia,
} from "@/app/admin/projets/media-actions";

type Props = {
  projectId: string;
  updateId: string;
};

type UploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video";
};

export default function ProjectUpdateMediaUpload({
  projectId,
  updateId,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    const files = Array.from(inputRef.current?.files ?? []);

    if (files.length === 0) {
      setMessage("Sélectionne au moins un fichier.");
      return;
    }

    const maxFiles = 10;
    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 50 * 1024 * 1024;

    if (files.length > maxFiles) {
      setMessage(`Sélectionne au maximum ${maxFiles} fichiers à la fois.`);
      return;
    }

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setMessage(`Format non autorisé : ${file.name}`);
        return;
      }

      if (isImage && file.size > maxImageSize) {
        setMessage(`${file.name} dépasse la limite de 10 Mo.`);
        return;
      }

      if (isVideo && file.size > maxVideoSize) {
        setMessage(`${file.name} dépasse la limite de 50 Mo.`);
        return;
      }
    }

    setLoading(true);
    setMessage("");

    try {
      const signatureData = await createMediaUploadSignature(
        createFormData()
      );

      for (const file of files) {
        const resourceType = file.type.startsWith("video/")
          ? "video"
          : "image";

        const form = new FormData();

        form.append("file", file);
        form.append("api_key", signatureData.apiKey);
        form.append("timestamp", String(signatureData.timestamp));
        form.append("folder", signatureData.folder);
        form.append("signature", signatureData.signature);

        const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`,
        {
            method: "POST",
            body: form,
        }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message ?? `Échec de l'envoi de ${file.name}.`
          );
        }

        const uploaded = result as UploadResult;

        if (uploaded.resource_type !== resourceType) {
          throw new Error(`Type inattendu pour ${file.name}.`);
        }

        const saveForm = new FormData();

        saveForm.set("projectId", projectId);
        saveForm.set("updateId", updateId);
        saveForm.set("url", uploaded.secure_url);
        saveForm.set("publicId", uploaded.public_id);
        saveForm.set("resourceType", uploaded.resource_type);
        saveForm.set("caption", caption);

        await saveUploadedProjectMedia(saveForm);
      }

      setMessage("Tous les fichiers ont été envoyés avec succès.");
      setCaption("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'envoi."
      );
    } finally {
      setLoading(false);
    }
  }

  function createFormData() {
    const formData = new FormData();
    formData.set("projectId", projectId);
    formData.set("updateId", updateId);
    return formData;
  }

  return (
    <div className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="font-bold text-[#102A43]">
        Ajouter des photos ou vidéos
      </h4>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Fichiers à envoyer
        </label>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          className="block w-full text-sm"
        />

        <p className="mt-2 text-xs text-slate-500">
          Jusqu'à 10 fichiers par envoi. Images : 10 Mo maximum par fichier.
          Vidéos : 50 Mo maximum par fichier.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Légende (facultative)
        </label>

        <input
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          maxLength={250}
          placeholder="Ex. Vue des fondations après coulage"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
        />
      </div>

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading}
        className="rounded-xl bg-[#102A43] px-5 py-3 font-bold text-white hover:bg-[#1b4264] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Envoi en cours..." : "Envoyer les fichiers"}
      </button>

      {message && (
        <p role="status" className="text-sm text-slate-700">
          {message}
        </p>
      )}
    </div>
  );
}