import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHomeStatistics } from "@/lib/statistics";
import AnimatedStatistics from "@/components/home/AnimatedStatistics";

export default async function StatsSection() {
  const statistics = await getHomeStatistics();

  if (statistics.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#10161F] py-24 text-white sm:py-28">
      {/* Décoration d'arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.04]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full border border-white/[0.04]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
        {/* Présentation */}
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#D59344]" />
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D59344]">
              Notre engagement en chiffres
            </p>
          </div>

          <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Votre vision.
            <br />
            Notre expertise.
            <br />
            <span className="text-[#D59344]">Des réalisations concrètes.</span>
          </h2>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300">
            Derrière chaque chiffre, il y a un engagement, un savoir-faire
            et une équipe mobilisée pour donner vie à vos projets. Découvrez
            quelques indicateurs qui témoignent de notre activité.
          </p>

          <Link
            href="/entreprise"
            className="group mt-9 inline-flex items-center gap-4 bg-[#D59344] px-6 py-4 font-bold text-[#10161F] transition-colors duration-300 hover:bg-[#BE7D32]"
          >
            Découvrir notre entreprise
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Statistiques animées */}
        <AnimatedStatistics statistics={statistics} />
      </div>
    </section>
  );
}