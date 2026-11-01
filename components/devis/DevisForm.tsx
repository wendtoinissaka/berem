"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Send,
  UserRound,
  Phone,
  Mail,
  Building2,
  HardHat,
  MapPin,
  Wallet,
  CalendarDays,
  FileText,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

type FormStatus = {
  type: "success" | "error";
  message: string;
};

const inputClass =
  "w-full rounded-xl border border-[#E5DED5] bg-[#FCFBF9] px-4 py-3.5 text-sm text-[#172033] outline-none transition duration-200 placeholder:text-[#A2A8B2] hover:border-[#C9BBAA] focus:border-[#D59344] focus:bg-white focus:ring-4 focus:ring-[#D59344]/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-2 block text-sm font-semibold text-[#26364A]";

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10161F] text-sm font-bold text-[#D59344]">
        {number}
      </div>

      <div>
        <h3 className="text-base font-bold text-[#172033]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#87909D]">
          {description}
        </p>
      </div>
    </div>
  );
}

function FieldIcon({ icon: Icon }: { icon: typeof UserRound }) {
  return (
    <Icon
      size={15}
      strokeWidth={1.8}
      className="text-[#BE7D32]"
      aria-hidden="true"
    />
  );
}

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
    <div className="overflow-hidden rounded-2xl border border-[#EAE1D7] bg-white shadow-[0_20px_60px_rgba(23,32,51,0.08)]">
      {/* EN-TÊTE */}
      <div className="relative overflow-hidden bg-[#10161F] px-6 py-7 text-white sm:px-9 sm:py-8">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 h-56 w-56 rounded-full border border-white/[0.06]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-2 -top-10 h-36 w-36 rounded-full border border-white/[0.06]"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#D59344]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D59344]">
                Demande de devis
              </p>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Parlez-nous de votre projet.
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
              Quelques informations suffisent pour nous permettre de mieux
              comprendre vos besoins.
            </p>
          </div>

          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#D59344] sm:flex">
            <HardHat size={24} strokeWidth={1.5} />
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs text-white/55">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D59344]" />
            3 étapes simples
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#D59344]" />
            Informations confidentielles
          </span>
        </div>
      </div>

      {/* FORMULAIRE */}
      <div className="p-6 sm:p-9">
        {status && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-8 flex items-start gap-3 rounded-xl border p-4 ${
              status.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={21} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={21} className="mt-0.5 shrink-0" />
            )}

            <div>
              <p className="text-sm font-bold">
                {status.type === "success"
                  ? "Votre demande a bien été envoyée"
                  : "Un problème est survenu"}
              </p>
              <p className="mt-1 text-sm leading-6">{status.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-9">
          {/* ÉTAPE 1 : COORDONNÉES */}
          <section>
            <SectionHeading
              number="01"
              title="Vos coordonnées"
              description="Comment pouvons-nous vous contacter ?"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Nom complet <span className="text-[#BE7D32]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <FieldIcon icon={UserRound} />
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    placeholder="Votre nom complet"
                    className={`${inputClass} pl-11`}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Téléphone <span className="text-[#BE7D32]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <FieldIcon icon={Phone} />
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={30}
                    placeholder="+226 XX XX XX XX"
                    className={`${inputClass} pl-11`}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="email" className={labelClass}>
                Adresse e-mail <span className="text-[#BE7D32]">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <FieldIcon icon={Mail} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="exemple@domaine.com"
                  className={`${inputClass} pl-11`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="company" className={labelClass}>
                Entreprise{" "}
                <span className="font-normal text-[#87909D]">
                  (facultatif)
                </span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <FieldIcon icon={Building2} />
                </span>
                <input
                  id="company"
                  name="company"
                  type="text"
                  maxLength={180}
                  placeholder="Nom de votre entreprise"
                  className={`${inputClass} pl-11`}
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-[#F0EAE2]" />

          {/* ÉTAPE 2 : PROJET */}
          <section>
            <SectionHeading
              number="02"
              title="Votre projet"
              description="Précisez les caractéristiques de votre projet."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="projectType" className={labelClass}>
                  Type de projet <span className="text-[#BE7D32]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <FieldIcon icon={HardHat} />
                  </span>
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    defaultValue=""
                    className={`${inputClass} appearance-none pl-11`}
                    disabled={loading}
                  >
                    <option value="" disabled>
                      Sélectionnez une option
                    </option>
                    <option value="Construction">Construction</option>
                    <option value="Travaux de bâtiment">
                      Travaux de bâtiment
                    </option>
                    <option value="Rénovation">Rénovation</option>
                    <option value="Suivi de projet">Suivi de projet</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  Localisation <span className="text-[#BE7D32]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <FieldIcon icon={MapPin} />
                  </span>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    maxLength={180}
                    placeholder="Ville, quartier..."
                    className={`${inputClass} pl-11`}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="estimatedBudget" className={labelClass}>
                  Budget estimatif{" "}
                  <span className="font-normal text-[#87909D]">
                    (facultatif)
                  </span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <FieldIcon icon={Wallet} />
                  </span>
                  <input
                    id="estimatedBudget"
                    name="estimatedBudget"
                    type="text"
                    maxLength={100}
                    placeholder="Ex. : 5 000 000 FCFA"
                    className={`${inputClass} pl-11`}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="desiredDate" className={labelClass}>
                  Date souhaitée{" "}
                  <span className="font-normal text-[#87909D]">
                    (facultatif)
                  </span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <FieldIcon icon={CalendarDays} />
                  </span>
                  <input
                    id="desiredDate"
                    name="desiredDate"
                    type="date"
                    className={`${inputClass} pl-11`}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-[#F0EAE2]" />

          {/* ÉTAPE 3 : DESCRIPTION */}
          <section>
            <SectionHeading
              number="03"
              title="Décrivez votre projet"
              description="Donnez-nous suffisamment de détails pour comprendre vos attentes."
            />

            <label htmlFor="description" className={labelClass}>
              Description du projet{" "}
              <span className="text-[#BE7D32]">*</span>
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-4">
                <FieldIcon icon={FileText} />
              </span>
              <textarea
                id="description"
                name="description"
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                placeholder="Exemple : Je souhaite construire une villa de 4 pièces sur un terrain de 300 m² situé à Ouagadougou. J'aimerais obtenir un accompagnement pour les travaux de construction..."
                className={`${inputClass} min-h-44 resize-y pl-11 leading-7`}
                disabled={loading}
              />
            </div>

            <p className="mt-2 text-xs leading-5 text-[#87909D]">
              Décrivez la nature des travaux, les dimensions, les contraintes
              et vos attentes particulières.
            </p>
          </section>

          {/* ENVOI */}
          <div className="rounded-2xl border border-[#EAE1D7] bg-[#FBF7F1] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#BE7D32]"
              />
              <div>
                <p className="text-sm font-bold text-[#26364A]">
                  Vos informations sont protégées.
                </p>
                <p className="mt-1 text-xs leading-5 text-[#647084]">
                  Elles seront utilisées uniquement pour étudier et traiter
                  votre demande de devis.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#D59344] px-6 py-4 text-sm font-bold text-white shadow-[0_6px_18px_rgba(213,147,68,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#BE7D32] hover:shadow-[0_10px_24px_rgba(190,125,50,0.25)] focus:outline-none focus:ring-4 focus:ring-[#D59344]/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Envoi de votre demande...
                </>
              ) : (
                <>
                  Envoyer ma demande
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] text-[#87909D] sm:text-left">
              Les champs marqués d&apos;un astérisque (*) sont obligatoires.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}