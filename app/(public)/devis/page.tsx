import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  MapPin,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import DevisForm from "@/components/devis/DevisForm";

export const metadata: Metadata = {
  title: "Demander un devis | BEREM",
  description:
    "Présentez votre projet de construction, de rénovation ou de génie civil à BEREM et obtenez une réponse adaptée à vos besoins.",
};

const advice = [
  {
    icon: Building2,
    title: "Présentez votre projet",
    description:
      "Précisez la nature des travaux et le résultat que vous souhaitez obtenir.",
  },
  {
    icon: MapPin,
    title: "Indiquez la localisation",
    description:
      "La ville et le quartier nous aideront à mieux comprendre votre besoin.",
  },
  {
    icon: ClipboardList,
    title: "Détaillez vos attentes",
    description:
      "Mentionnez les contraintes, les délais et votre budget si vous en avez un.",
  },
];

export default function DevisPage() {
  return (
    <main className="min-h-screen bg-[#FBF7F1] text-[#172033]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#10161F] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:px-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#D59344]" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D59344]">
                Parlons de votre projet
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Construisons ensemble
              <br />
              <span className="text-[#D59344]">votre prochain projet.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Décrivez-nous vos besoins. Notre équipe étudiera votre demande
              afin de vous proposer un accompagnement adapté à votre projet.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENU */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          {/* COLONNE INFORMATIVE */}
          <aside className="lg:sticky lg:top-28">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#BE7D32]">
              <MessageSquareText size={16} />
              Votre demande
            </div>

            <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Chaque projet commence par une bonne compréhension de vos besoins.
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#647084]">
              Construction, travaux de bâtiment, rénovation ou suivi de
              chantier : partagez avec nous les premières informations sur
              votre projet.
            </p>

            <div className="mt-9 space-y-6">
              {advice.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EAE1D7] bg-white text-[#BE7D32]">
                      <Icon size={20} strokeWidth={1.7} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#172033]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#647084]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-9 border-t border-[#EAE1D7] pt-6">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#BE7D32]"
                />
                <p className="text-xs leading-6 text-[#647084]">
                  Les informations communiquées sont utilisées uniquement
                  pour l'étude et le traitement de votre demande.
                </p>
              </div>
            </div>

            <Link
              href="/services"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#BE7D32] transition hover:gap-3 hover:text-[#172033]"
            >
              Découvrir nos services
              <ArrowRight size={16} />
            </Link>
          </aside>

          {/* FORMULAIRE */}
          <div className="min-w-0">
            <DevisForm />
          </div>
        </div>
      </section>
    </main>
  );
}