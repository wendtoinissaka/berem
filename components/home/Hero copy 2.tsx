import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-[#10161F] lg:min-h-[850px]">
      {/* Image principale */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2400&q=90')",
        }}
      />

      {/* Traitement de l'image */}
      <div className="absolute inset-0 -z-20 bg-[#10161F]/50" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10161F] via-[#10161F]/90 to-[#10161F]/20" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10161F] via-transparent to-[#10161F]/20" />

      {/* Décoration architecturale */}
      <div className="pointer-events-none absolute right-[12%] top-0 hidden h-full w-px bg-white/10 lg:block" />

      <div className="pointer-events-none absolute right-[12%] top-0 hidden h-40 w-px bg-[#D59344] lg:block" />

      <div className="relative mx-auto flex min-h-[720px] max-w-[1440px] items-center px-5 py-28 sm:px-8 lg:min-h-[850px] lg:px-16">
        <div className="max-w-4xl">
          {/* Sur-titre */}
          <div className="hero-reveal mb-9 flex items-center gap-4">
            <span className="h-[2px] w-12 bg-[#D59344]" />

            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#E6B36F] sm:text-sm">
              BEREM · Génie civil & construction
            </span>
          </div>

          {/* Titre */}
          <h1 className="hero-reveal hero-delay-1 max-w-4xl text-5xl font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[88px]">
            Construire
            <br />
            <span className="text-[#D59344]">aujourd'hui.</span>
            <br />
            Penser demain.
          </h1>

          {/* Description */}
          <p className="hero-reveal hero-delay-2 mt-8 max-w-xl border-l-2 border-[#D59344] pl-5 text-base leading-8 text-white/75 sm:text-lg">
            De la conception à la réalisation, BEREM accompagne vos projets
            avec une approche fondée sur l'expertise technique, la rigueur
            et la qualité d'exécution.
          </p>

          {/* Boutons */}
          <div className="hero-reveal hero-delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/devis"
              className="group inline-flex min-h-16 items-center justify-center gap-5 bg-[#D59344] px-8 font-bold text-[#10161F] transition-all duration-300 hover:bg-white"
            >
              Parlons de votre projet

              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>

            <Link
              href="/realisations"
              className="group inline-flex min-h-16 items-center justify-center gap-5 border border-white/40 bg-white/5 px-8 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-[#10161F]"
            >
              Explorer nos réalisations

              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Points forts */}
          <div className="hero-reveal hero-delay-3 mt-16 grid max-w-2xl grid-cols-1 gap-5 border-t border-white/20 pt-7 sm:grid-cols-3 sm:gap-8">
            {[
              "Expertise technique",
              "Qualité d'exécution",
              "Suivi des projets",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#D59344]">
                  0{index + 1}
                </span>

                <span className="text-sm font-medium text-white/80">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Indication latérale */}
        <div className="absolute bottom-12 right-10 hidden items-center gap-4 lg:flex">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            Bâtir avec exigence
          </span>

          <span className="h-px w-16 bg-[#D59344]" />
        </div>
      </div>

      {/* Signature graphique */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
        <div className="h-full w-1/4 bg-[#D59344]" />
      </div>
    </section>
  );
}