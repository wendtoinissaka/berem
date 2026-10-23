import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Génie civil",
    description:
      "Des solutions techniques adaptées aux contraintes et aux exigences de vos projets.",
    icon: "⌘",
  },
  {
    number: "02",
    title: "Construction",
    description:
      "Un accompagnement structuré pour vos projets de construction et de bâtiment.",
    icon: "▥",
  },
  {
    number: "03",
    title: "Travaux publics",
    description:
      "Des interventions orientées vers la qualité, la durabilité et la maîtrise technique.",
    icon: "⌁",
  },
  {
    number: "04",
    title: "Études techniques",
    description:
      "Des études et conseils techniques adaptés à la nature de chaque projet.",
    icon: "⌖",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Notre expertise
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#102A43] sm:text-4xl lg:text-5xl">
              Des solutions adaptées à vos projets.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              Découvrez nos domaines d&apos;intervention et les compétences
              mobilisées pour accompagner vos projets de construction.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-3 self-start font-bold text-[#102A43] transition hover:text-amber-600 md:self-auto"
          >
            Tous nos services <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.number}
              className="group relative border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center bg-[#102A43] text-2xl text-[#F59E0B]">
                  {service.icon}
                </span>

                <span className="text-sm font-bold tracking-widest text-slate-300">
                  {service.number}
                </span>
              </div>

              <h3 className="mt-8 text-xl font-extrabold text-[#102A43]">
                {service.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {service.description}
              </p>

              <div className="mt-7 h-1 w-10 bg-[#F59E0B] transition-all group-hover:w-20" />
            </article>
          ))}
        </div>

        <p className="mt-6 text-xs leading-6 text-slate-500">
          Les prestations présentées sont provisoires et devront être
          confirmées par l&apos;entreprise avant publication.
        </p>
      </div>
    </section>
  );
}