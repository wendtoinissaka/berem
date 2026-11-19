import { ArrowUpRight, MapPin } from "lucide-react";

const address = "Ouagadougou, Burkina Faso";

const mapUrl =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3899.344150182698!2d-1.5569664249360426!3d12.224961188025885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDEzJzI5LjkiTiAxwrAzMycxNS44Ilc!5e0!3m2!1sfr!2sbf!4v1795090072880!5m2!1sfr!2sbf";

const directionsUrl =
  "https://maps.app.goo.gl/4MR5mVXft5wrRJiv9";

export default function LocationMapSection() {
  return (
    <section className="relative overflow-hidden border-y border-[#10161F]/[0.06] bg-[#FBF7F1]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">

          {/* INFORMATIONS */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#D59344]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A66C2B]">
                Notre localisation
              </span>
            </div>

            <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight text-[#10161F] sm:text-4xl">
              Venez nous rencontrer.
              <span className="text-[#D59344]">
                {" "}Nous sommes à Ouagadougou.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#172033]/60">
              Notre équipe vous accueille pour échanger sur vos projets
              de construction, de génie civil et d'ingénierie.
            </p>

            <div className="mt-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D59344]/20 bg-[#D59344]/10">
                <MapPin size={22} className="text-[#A66C2B]" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#172033]/40">
                  Adresse de BEREM
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#10161F]">
                  {address}
                </p>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#10161F] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#D59344] hover:text-[#10161F]"
            >
              Obtenir l'itinéraire
              <ArrowUpRight size={17} />
            </a>
          </div>

          {/* CARTE */}
          <div className="rounded-2xl border border-[#10161F]/10 bg-white p-2 shadow-[0_20px_60px_rgba(16,22,31,0.10)]">
            <div className="overflow-hidden rounded-xl">
              <iframe
                title="Localisation de BEREM à Ouagadougou"
                src={mapUrl}
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}