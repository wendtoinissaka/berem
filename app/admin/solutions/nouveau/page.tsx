import Link from "next/link";
import { createSolution } from "@/app/admin/solutions/actions";

export const metadata = {
  title: "Nouvelle solution | BEREM Admin",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

const labelClass = "block text-sm font-semibold text-slate-700";

const features = [
  { number: 1, title: "Fonctionnalité 1" },
  { number: 2, title: "Fonctionnalité 2" },
  { number: 3, title: "Fonctionnalité 3" },
  { number: 4, title: "Fonctionnalité 4" },
];

export default function NewSolutionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <Link
          href="/admin/solutions"
          className="text-sm font-semibold text-slate-500 transition hover:text-[#102A43]"
        >
          ← Retour aux solutions
        </Link>

        <h1 className="mt-4 text-3xl font-black text-[#102A43]">
          Ajouter une solution
        </h1>

        <p className="mt-2 text-slate-600">
          Présentez une solution numérique, ses fonctionnalités et sa valeur
          ajoutée pour les clients de BEREM.
        </p>
      </header>

      <form action={createSolution} className="space-y-8">
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-[#102A43]">
              1. Informations générales
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Le nom permettra de générer automatiquement l'adresse de la page.
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
              placeholder="Présentez la solution en quelques phrases."
              className={inputClass}
            />
            <p className="mt-2 text-xs text-slate-500">
              Maximum 300 caractères.
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
              placeholder="Expliquez le problème traité, le fonctionnement de la solution et ses avantages."
              className={inputClass}
            />
          </div>
        </section>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-[#102A43]">
              2. Fonctionnalités
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Les champs laissés vides seront ignorés.
            </p>
          </div>

          {features.map((feature) => (
            <div
              key={feature.number}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <h3 className="font-semibold text-[#102A43]">
                {feature.title}
              </h3>

              <div className="mt-3">
                <label
                  htmlFor={`featureTitle-${feature.number}`}
                  className={labelClass}
                >
                  Nom
                </label>
                <input
                  id={`featureTitle-${feature.number}`}
                  name="featureTitle"
                  maxLength={120}
                  placeholder="Ex. Gestion des paiements"
                  className={inputClass}
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor={`featureDescription-${feature.number}`}
                  className={labelClass}
                >
                  Description
                </label>
                <textarea
                  id={`featureDescription-${feature.number}`}
                  name="featureDescription"
                  rows={2}
                  maxLength={1000}
                  placeholder="Expliquez brièvement cette fonctionnalité."
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-[#102A43]">
              3. Liens et présentation
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Les images et vidéos seront ajoutées depuis la page de modification.
            </p>
          </div>

          <div>
            <label htmlFor="websiteUrl" className={labelClass}>
              Site web de la solution
            </label>
            <input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
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
              defaultValue="Découvrir la solution"
              maxLength={80}
              className={inputClass}
            />
          </div>
        </section>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-[#102A43]">
              4. Publication et visibilité
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              La solution sera d'abord enregistrée comme brouillon. Tu pourras
              ajouter sa couverture avant de la publier.
            </p>
          </div>

          <input type="hidden" name="status" value="DRAFT" />

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
              defaultValue={0}
              className={inputClass}
            />
            <p className="mt-2 text-xs text-slate-500">
              Les valeurs les plus faibles apparaîtront en premier.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <input
              type="checkbox"
              name="isFeatured"
              className="mt-1 size-4 accent-amber-500"
            />
            <span>
              <span className="block font-semibold text-[#102A43]">
                Prévoir une mise en avant sur la page d'accueil
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                La mise en avant sera activée lorsque la solution sera publiée.
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
            Créer le brouillon
          </button>
        </div>
      </form>
    </div>
  );
}