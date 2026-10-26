"use client";

import { useRef, useState } from "react";
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

export default function ProjectMediaUpload({ projectId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleUpload() {
    const files = Array.from(inputRef.current?.files ?? []);

    if (files.length === 0) {
      setMessage("Sélectionne au moins une photo ou une vidéo.");
      setSuccess(false);
      return;
    }

    const maxFiles = 10;
    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 50 * 1024 * 1024;

    if (files.length > maxFiles) {
      setMessage(`Sélectionne au maximum ${maxFiles} fichiers à la fois.`);
      setSuccess(false);
      return;
    }

    // Vérifier tous les fichiers avant de commencer l'envoi.
    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setMessage(`Format non autorisé : ${file.name}`);
        setSuccess(false);
        return;
      }

      if (isImage && file.size > maxImageSize) {
        setMessage(`${file.name} dépasse la limite de 10 Mo.`);
        setSuccess(false);
        return;
      }

      if (isVideo && file.size > maxVideoSize) {
        setMessage(`${file.name} dépasse la limite de 50 Mo.`);
        setSuccess(false);
        return;
      }
    }

    setLoading(true);
    setMessage("Préparation de l'envoi...");
    setSuccess(false);

    try {
      const signatureForm = new FormData();
      signatureForm.set("projectId", projectId);

      const signatureData =
        await createProjectMediaUploadSignature(signatureForm);

      let uploadedCount = 0;

      for (const file of files) {
        const resourceType = file.type.startsWith("video/")
          ? "video"
          : "image";

        setMessage(
          `Envoi du fichier ${uploadedCount + 1}/${files.length} : ${file.name}`
        );

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

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message ??
              `Échec de l'envoi du fichier ${file.name}.`
          );
        }

        const uploaded = result as UploadResult;

        if (uploaded.resource_type !== resourceType) {
          throw new Error(`Type de fichier inattendu pour ${file.name}.`);
        }

        // Enregistrer le média dans la galerie principale du chantier.
        const saveForm = new FormData();

        saveForm.set("projectId", projectId);
        saveForm.set("url", uploaded.secure_url);
        saveForm.set("publicId", uploaded.public_id);
        saveForm.set("resourceType", uploaded.resource_type);
        saveForm.set("caption", caption.trim());

        await saveUploadedProjectLevelMedia(saveForm);

        uploadedCount++;
      }

      setMessage(
        `${uploadedCount} fichier(s) ajouté(s) avec succès à la galerie du chantier.`
      );
      setSuccess(true);
      setCaption("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      // Actualiser la page pour afficher les nouveaux médias.
      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'envoi des fichiers."
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
          Galerie du chantier
        </p>

        <h3 className="mt-2 text-xl font-extrabold text-[#102A43]">
          Photos et vidéos du projet
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ajoute les visuels qui seront présentés dans la galerie du chantier.
          La première photo enregistrée servira de couverture sur les cartes
          de présentation, tant qu'aucune fonction de choix de couverture
          n'est ajoutée.
        </p>
      </div>

      <div>
        <label
          htmlFor="project-media-files"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Sélectionner les fichiers
        </label>

        <input
          ref={inputRef}
          id="project-media-files"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          disabled={loading}
          className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#102A43] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#1b4264] disabled:opacity-60"
        />

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Maximum 10 fichiers par envoi. Images : 10 Mo maximum par fichier.
          Vidéos : 50 Mo maximum par fichier. Formats acceptés : JPG, PNG,
          WebP, AVIF, MP4 et WebM.
        </p>
      </div>

      <div>
        <label
          htmlFor="project-media-caption"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Légende des fichiers (facultative)
        </label>

        <input
          id="project-media-caption"
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          maxLength={250}
          disabled={loading}
          placeholder="Ex. Vue générale du bâtiment terminé"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:opacity-60"
        />

        <p className="mt-1 text-xs text-slate-500">
          Cette légende sera appliquée à tous les fichiers de cet envoi.
        </p>
      </div>

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl bg-[#102A43] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b4264] disabled:cursor-not-allowed disabled:opacity-60"
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