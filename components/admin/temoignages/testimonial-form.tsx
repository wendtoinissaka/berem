"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { createTestimonial } from "@/app/admin/temoignages/actions";
import {
  createTestimonialPhotoUploadSignature,
  verifyTestimonialPhoto,
} from "@/app/admin/temoignages/media-actions";

type TestimonialFormData = {
  id?: string;
  clientName?: string;
  company?: string | null;
  role?: string | null;
  content?: string;
  projectName?: string | null;
  photoUrl?: string | null;
  isPublished?: boolean;
};

type TestimonialFormProps = {
  testimonial?: TestimonialFormData;
};

export default function TestimonialForm({
  testimonial,
}: TestimonialFormProps) {
  const isEditing = Boolean(testimonial?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoUrl, setPhotoUrl] = useState(
    testimonial?.photoUrl ?? ""
  );
  const [photoPublicId, setPhotoPublicId] = useState("");
  const [removePhoto, setRemovePhoto] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  async function handlePhotoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadMessage("");

    if (!file.type.startsWith("image/")) {
      setUploadMessage("Veuillez sélectionner un fichier image.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage("La photo ne doit pas dépasser 10 Mo.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      // 1. Demander une signature sécurisée au serveur.
      const signatureForm = new FormData();

      if (testimonial?.id) {
        signatureForm.set("testimonialId", testimonial.id);
      }

      const signature =
        await createTestimonialPhotoUploadSignature(signatureForm);

      // 2. Envoyer directement l'image à Cloudinary.
      const uploadForm = new FormData();

      uploadForm.append("file", file);
      uploadForm.append("api_key", signature.apiKey);
      uploadForm.append("timestamp", String(signature.timestamp));
      uploadForm.append("folder", signature.folder);
      uploadForm.append("signature", signature.signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadForm,
        }
      );

      const uploaded = await response.json();

      if (!response.ok) {
        throw new Error(
          uploaded?.error?.message ??
            "Impossible d'envoyer la photo vers Cloudinary."
        );
      }

      if (!uploaded.secure_url || !uploaded.public_id) {
        throw new Error("Cloudinary n'a pas retourné les informations attendues.");
      }

      // 3. Vérifier la photo côté serveur avant de la retenir.
      const verificationForm = new FormData();

      verificationForm.set("url", uploaded.secure_url);
      verificationForm.set("publicId", uploaded.public_id);

      const verified = await verifyTestimonialPhoto(verificationForm);

      setPhotoUrl(verified.url);
      setPhotoPublicId(verified.publicId);
      setRemovePhoto(false);
      setUploadMessage("Photo envoyée avec succès.");
    } catch (error) {
      setUploadMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'envoi de la photo."
      );
    } finally {
      setIsUploading(false);

      // Permet de sélectionner à nouveau le même fichier.
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <form action={createTestimonial} className="space-y-8">
      {testimonial?.id && (
        <input type="hidden" name="id" value={testimonial.id} />
      )}

      {/* Informations sur le client */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#102A43]">
            Informations sur le client
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Identifiez la personne qui témoigne et, si nécessaire, son entreprise.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="clientName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nom du client *
            </label>

            <input
              id="clientName"
              name="clientName"
              type="text"
              required
              maxLength={150}
              defaultValue={testimonial?.clientName ?? ""}
              placeholder="Ex. : Jean Ouédraogo"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Entreprise
            </label>

            <input
              id="company"
              name="company"
              type="text"
              defaultValue={testimonial?.company ?? ""}
              placeholder="Nom de l'entreprise"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Fonction du client
            </label>

            <input
              id="role"
              name="role"
              type="text"
              defaultValue={testimonial?.role ?? ""}
              placeholder="Ex. : Directeur général"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="projectName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Projet concerné
            </label>

            <input
              id="projectName"
              name="projectName"
              type="text"
              defaultValue={testimonial?.projectName ?? ""}
              placeholder="Nom du chantier ou de la réalisation"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>
      </section>

      {/* Contenu et photo */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#102A43]">
            Contenu du témoignage
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Saisissez les propos du client sans en déformer le sens.
          </p>
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Témoignage *
          </label>

          <textarea
            id="content"
            name="content"
            required
            maxLength={10000}
            rows={7}
            defaultValue={testimonial?.content ?? ""}
            placeholder="Saisissez ici le témoignage du client..."
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Maximum : 10 000 caractères.
          </p>
        </div>

        <div className="mt-8">
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Photo du client
          </label>

          {/* Valeurs utilisées lors de l'enregistrement */}
          <input
            type="hidden"
            name="photoUrl"
            value={photoUrl}
          />

          <input
            type="hidden"
            name="photoPublicId"
            value={photoPublicId}
          />

          <input
            type="hidden"
            name="removePhoto"
            value={removePhoto ? "true" : "false"}
            />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Aperçu de la photo du client"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="px-3 text-center text-sm text-slate-400">
                  Aucune photo sélectionnée
                </div>
              )}
            </div>

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-[#102A43] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading
                  ? "Envoi en cours..."
                  : photoUrl
                    ? "Changer la photo"
                    : "Choisir une photo"}
              </button>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Formats image acceptés par le navigateur. Taille maximale :
                10 Mo. La photo sera envoyée vers Cloudinary.
              </p>

              {uploadMessage && (
                <p
                  role="status"
                  className={`mt-3 text-sm ${
                    uploadMessage === "Photo envoyée avec succès."
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {uploadMessage}
                </p>
              )}

              {photoUrl && (
                <button
                  type="button"
                onClick={() => {
                setPhotoUrl("");
                setPhotoPublicId("");
                setRemovePhoto(true);
                setUploadMessage("");
                }}
                  disabled={isUploading}
                  className="mt-3 block text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Retirer la photo
                </button>
              )}
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Assurez-vous que le client a autorisé l'utilisation de sa photo
            sur le site de BEREM.
          </p>
        </div>
      </section>

      {/* Publication */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-[#102A43]">
          Publication
        </h2>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={testimonial?.isPublished ?? false}
            className="mt-1 h-4 w-4 accent-amber-500"
          />

          <span>
            <span className="block font-semibold text-[#102A43]">
              Publier ce témoignage
            </span>

            <span className="mt-1 block text-sm leading-5 text-slate-500">
              Le témoignage sera marqué comme publié. Son affichage sur le site
              dépendra également de son intégration dans la page publique.
            </span>
          </span>
        </label>
      </section>

      {/* Boutons d'action */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/temoignages"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Annuler
        </Link>

        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center justify-center rounded-xl bg-[#102A43] px-6 py-3 font-bold text-white transition hover:bg-[#183d5d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading
            ? "Veuillez patienter..."
            : isEditing
              ? "Enregistrer les modifications"
              : "Enregistrer le témoignage"}
        </button>
      </div>
    </form>
  );
}