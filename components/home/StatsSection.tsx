import Link from "next/link";

const advantages = [
  {
    number: "01",
    title: "Rigueur technique",
    description:
      "Une approche méthodique pour répondre aux exigences de chaque projet.",
  },
  {
    number: "02",
    title: "Qualité d'exécution",
    description:
      "Une attention particulière portée aux travaux, aux détails et aux finitions.",
  },
  {
    number: "03",
    title: "Suivi des projets",
    description:
      "Une communication structurée pour informer les clients de l'avancement.",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#102A43] py-24 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
            Notre engagement
          </p>

          <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Votre vision.
            <br />
            Notre expertise.
            <br />
            Des réalisations concrètes.
          </h2>

          <p className="mt-7 max-w-xl leading-8 text-slate-300">
            Chaque projet mérite une attention particulière, une organisation
            rigoureuse et une communication claire. Notre objectif est de
            proposer des solutions adaptées aux besoins de nos clients.
          </p>

          <Link
            href="/entreprise"
            className="mt-9 inline-flex items-center gap-3 bg-[#F59E0B] px-6 py-4 font-bold text-[#102A43] transition hover:bg-amber-400"
          >
            Découvrir notre entreprise
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="space-y-0">
          {advantages.map((advantage) => (
            <article
              key={advantage.number}
              className="flex gap-6 border-b border-white/15 py-7 first:border-t"
            >
              <span className="text-sm font-black tracking-widest text-[#F59E0B]">
                {advantage.number}
              </span>

              <div>
                <h3 className="text-xl font-bold">{advantage.title}</h3>

                <p className="mt-3 leading-7 text-slate-300">
                  {advantage.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}