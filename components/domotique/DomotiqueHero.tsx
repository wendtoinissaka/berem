import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function DomotiqueHero() {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-[#10161F] text-white lg:min-h-[760px]">
      {/* IMAGE DE FOND */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90')",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10161F] via-[#10161F]/90 to-[#10161F]/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10161F] via-transparent to-[#10161F]/20" />

      <div className="mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-5 pb-20 pt-28 sm:px-8 lg:min-h-[760px] lg:px-10">
        <div className="max-w-3xl">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-berem-orange" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-berem-orange">
              BEREM · Domotique & Smart Building
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-7xl">
            Votre bâtiment mérite
            <span className="block text-berem-orange">
              plus qu'une installation classique.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            Imaginez des espaces qui s'adaptent à votre mode de vie,
            anticipent vos besoins et vous donnent le contrôle sur votre
            environnement.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#solutions-domotiques"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-berem-orange px-7 py-4 text-sm font-bold text-berem-primary transition-all hover:-translate-y-1 hover:bg-berem-orange-hover"
            >
              Explorer les possibilités
              <ArrowUpRight size={18} />
            </Link>

            <Link
              href="/devis"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 px-7 py-4 text-sm font-semibold text-white transition-all hover:border-berem-orange hover:bg-white/10"
            >
              Parler de mon projet
            </Link>
          </div>
        </div>

        {/* INDICATION BASSE */}
        <div className="mt-20 flex flex-col gap-5 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
            <span>Domotique</span>
            <span>Automatisation</span>
            <span>Smart Building</span>
          </div>

          <a
            href="#solutions-domotiques"
            className="flex items-center gap-3 text-xs font-semibold text-white/70 transition-colors hover:text-berem-orange"
          >
            Découvrir notre univers
            <ArrowDown size={16} />
          </a>
        </div>
      </div>

      {/* REPÈRE DÉCORATIF */}
      <div className="absolute right-0 top-1/2 hidden h-40 w-1 bg-berem-orange/70 lg:block" />
    </section>
  );
}