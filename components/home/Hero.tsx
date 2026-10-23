import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[650px] items-center overflow-hidden bg-[#102A43] lg:min-h-[730px]">
      {/* Image d'arrière-plan temporaire */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2200&q=85')",
        }}
      />

      {/* Overlay pour assurer la lisibilité du texte */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071827]/95 via-[#102A43]/80 to-[#102A43]/25" />

      <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-3 border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm">
              Génie civil · Construction · BTP
            </span>
          </div>

          <h1 className="text-4xl font-black leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Bâtissons
            <br />
            <span className="text-[#F59E0B]">l&apos;avenir</span> ensemble.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Des projets conçus avec rigueur, des travaux exécutés avec
            exigence et des solutions adaptées à vos ambitions.
            Donnons vie à vos projets de construction.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/devis"
              className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#F59E0B] px-7 py-4 font-bold text-[#102A43] transition hover:bg-amber-400"
            >
              Parler de votre projet
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href="/realisations"
              className="inline-flex min-h-14 items-center justify-center border border-white/40 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#102A43]"
            >
              Découvrir nos réalisations
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-7 text-sm text-slate-200">
            <span>Expertise technique</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#F59E0B] sm:block" />
            <span>Qualité d&apos;exécution</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#F59E0B] sm:block" />
            <span>Suivi des projets</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 hidden h-2 w-1/3 bg-[#F59E0B] lg:block" />
    </section>
  );
}