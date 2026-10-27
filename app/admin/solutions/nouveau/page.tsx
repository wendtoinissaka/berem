import Link from "next/link";
import SolutionForm from "@/components/admin/solutions/solution-form";

export const metadata = {
  title: "Nouvelle solution | BEREM Admin",
};

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
          Présentez une solution numérique, ses fonctionnalités, son identité
          visuelle et sa valeur ajoutée pour les clients de BEREM.
        </p>
      </header>

      <SolutionForm />
    </div>
  );
}