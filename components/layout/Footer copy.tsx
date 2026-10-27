import Link from "next/link";
import CopyrightYear from "./CopyrightYear";

const services = [
  "Génie civil",
  "Construction",
  "Travaux publics",
  "Études techniques",
];

export default function Footer() {
  return (
    <footer className="bg-[#0B1F33] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl font-black text-[#102A43]">
              B<span className="text-[#F59E0B]">.</span>
            </span>
            <span className="text-2xl font-black tracking-[0.16em]">
              BEREM
            </span>
          </Link>

          <p className="mt-6 max-w-xs text-sm leading-7 text-slate-300">
            Des solutions de construction et de génie civil pensées pour
            répondre aux exigences de vos projets.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#F59E0B]">
            Navigation
          </h2>

          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            <li>
              <Link href="/entreprise" className="hover:text-white">
                Notre entreprise
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white">
                Nos services
              </Link>
            </li>
            <li>
              <Link href="/realisations" className="hover:text-white">
                Nos réalisations
              </Link>
            </li>
            <li>
              <Link href="/chantiers" className="hover:text-white">
                Chantiers en cours
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#F59E0B]">
            Nos domaines
          </h2>

          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#F59E0B]">
            Parlons de votre projet
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-300">
            Vous avez un projet de construction ou des travaux à réaliser ?
            Contactez notre équipe pour en discuter.
          </p>

          <Link
            href="/devis"
            className="mt-5 inline-flex items-center gap-2 font-bold text-[#F59E0B] hover:text-amber-300"
          >
            Demander un devis <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-4 text-xs text-slate-400">
            Les coordonnées officielles seront ajoutées après validation par
            l&apos;entreprise.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-slate-400 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>
            <CopyrightYear />
          </p>

          <p>Génie civil · Construction · BTP</p>
        </div>
      </div>
    </footer>
  );
}