"use client";

import { useState, type FormEvent } from "react";

type FormStatus = {
  type: "success" | "error";
  message: string;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-60";

export default function DevisForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/devis", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setStatus({
          type: "error",
          message:
            result.message ||
            "Impossible d'envoyer votre demande. Veuillez réessayer.",
        });
        return;
      }

      form.reset();

      setStatus({
        type: "success",
        message: result.message,
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "Connexion impossible. Vérifiez votre connexion Internet et réessayez.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <h2 className="text-2xl font-bold">
        Informations sur votre projet
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        Les champs marqués d'un astérisque (*) sont obligatoires.
      </p>

      {status && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-6 rounded-xl border p-5 ${
            status.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <p className="font-semibold">
            {status.type === "success"
              ? "Demande enregistrée"
              : "Attention"}
          </p>
          <p className="mt-2 text-sm leading-6">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-semibold">
              Nom complet *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              placeholder="Votre nom"
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
              Téléphone *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={30}
              placeholder="Votre numéro de téléphone"
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold">
            Adresse e-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="exemple@domaine.com"
            className={inputClass}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-semibold">
            Entreprise (facultatif)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={180}
            placeholder="Nom de votre entreprise"
            className={inputClass}
            disabled={loading}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="projectType"
              className="mb-2 block text-sm font-semibold"
            >
              Type de projet *
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              defaultValue=""
              className={`${inputClass} bg-white`}
              disabled={loading}
            >
              <option value="" disabled>
                Sélectionnez une option
              </option>
              <option value="Construction">Construction</option>
              <option value="Travaux de bâtiment">Travaux de bâtiment</option>
              <option value="Rénovation">Rénovation</option>
              <option value="Suivi de projet">Suivi de projet</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-semibold">
              Localisation du projet *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              maxLength={180}
              placeholder="Ville, quartier..."
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="estimatedBudget"
              className="mb-2 block text-sm font-semibold"
            >
              Budget estimatif (facultatif)
            </label>
            <input
              id="estimatedBudget"
              name="estimatedBudget"
              type="text"
              maxLength={100}
              placeholder="Ex. : 5 000 000 FCFA"
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="desiredDate"
              className="mb-2 block text-sm font-semibold"
            >
              Date souhaitée (facultatif)
            </label>
            <input
              id="desiredDate"
              name="desiredDate"
              type="date"
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold"
          >
            Description du projet *
          </label>
          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder="Décrivez votre projet, vos besoins et les travaux envisagés..."
            className={`${inputClass} resize-y`}
            disabled={loading}
          />
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Les informations transmises seront utilisées pour traiter votre
          demande de devis.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {loading ? "Envoi en cours..." : "Envoyer ma demande"}
          {!loading && (
            <span className="ml-3" aria-hidden="true">
              →
            </span>
          )}
        </button>
      </form>
    </div>
  );
}