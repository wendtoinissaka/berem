import type { Metadata } from "next";
import Link from "next/link";
//import { Suspense } from "react";
import DevisForm from "@/components/devis/DevisForm";
//import DevisFeedback from "@/components/devis/DevisFeedback";

export const metadata: Metadata = {
  title: "Demander un devis | BEREM",
  description:
    "Présentez votre projet à BEREM grâce à notre formulaire de demande de devis.",
};

export default function DevisPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-950 px-6 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Parlons de votre projet
          </p>

          <h1 className="mt-5 text-4xl font-bold md:text-6xl">
            Demander un devis
          </h1>

          <p className="mt-6 max-w-2xl leading-8 text-slate-300">
            Présentez-nous votre projet et vos besoins. Nous pourrons ainsi
            mieux comprendre votre demande et vous recontacter.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <aside>
            <h2 className="text-2xl font-bold">
              Comment pouvons-nous vous aider ?
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Que votre projet concerne une construction, des travaux ou une
              rénovation, décrivez-nous votre besoin pour nous permettre
              d'étudier votre demande.
            </p>

            <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-6">
              <h3 className="font-bold text-slate-900">
                Quelques conseils
              </h3>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li>• Précisez le type de projet.</li>
                <li>• Décrivez les travaux envisagés.</li>
                <li>• Indiquez la localisation du projet.</li>
                <li>• Laissez des coordonnées permettant de vous joindre.</li>
              </ul>
            </div>

            <Link
              href="/services"
              className="mt-7 inline-flex font-semibold text-orange-700 hover:text-orange-800"
            >
              Consulter nos services →
            </Link>
          </aside>

            <DevisForm />
        </div>
      </section>
    </main>
  );
}