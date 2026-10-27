import Link from "next/link";
import TestimonialForm from "@/components/admin/temoignages/testimonial-form";

export const metadata = {
  title: "Ajouter un témoignage | BEREM Admin",
};

export default function NewTestimonialPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link
          href="/admin/temoignages"
          className="text-sm font-semibold text-slate-500 transition hover:text-[#102A43]"
        >
          ← Retour aux témoignages
        </Link>

        <h1 className="mt-4 text-3xl font-black text-[#102A43]">
          Ajouter un témoignage
        </h1>

        <p className="mt-2 text-slate-600">
          Enregistrez le retour d'expérience d'un client de BEREM.
        </p>
      </div>

      <TestimonialForm />
    </div>
  );
}