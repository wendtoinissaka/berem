import Link from "next/link";
import ProjectForm from "@/components/admin/projets/project-form";

export const metadata = {
  title: "Nouveau chantier | BEREM Admin",
};

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/admin/projets"
          className="text-sm font-semibold text-slate-500 hover:text-[#102A43]"
        >
          ← Retour aux chantiers
        </Link>

        <h1 className="mt-4 text-3xl font-black text-[#102A43]">
          Ajouter un chantier
        </h1>

        <p className="mt-2 text-slate-600">
          Renseignez les informations principales de la réalisation.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProjectForm />
      </div>
    </div>
  );
}