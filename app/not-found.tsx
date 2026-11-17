import Link from "next/link";
import { ArrowUpRight, Compass, Home } from "lucide-react";

export const metadata = { title: "Page introuvable | BEREM" };

const liens = [
  { href: "/services", label: "Nos services" },
  { href: "/realisations", label: "Nos réalisations" },
  { href: "/chantiers", label: "Chantiers en cours" },
  { href: "/devis", label: "Demander un devis" },
];

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-background px-5 py-24 sm:px-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[clamp(10rem,38vw,26rem)] font-black leading-none tracking-tighter text-berem-primary/[0.04]"
      >
        404
      </span>

      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-berem-orange/40 bg-berem-orange-soft text-berem-orange-hover">
          <Compass size={28} strokeWidth={1.6} aria-hidden="true" />
        </span>

        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="h-[2px] w-10 bg-berem-orange" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-berem-orange-hover">Erreur 404</p>
          <span className="h-[2px] w-10 bg-berem-orange" />
        </div>

        <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-berem-primary sm:text-5xl">
          Cette page n’est pas sur nos plans.
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-berem-muted">
          Le lien est peut-être incorrect ou la page a été déplacée. Reprenons le bon chemin ensemble.
        </p>

        <div className="mt-10 flex justify-center">
          <Link href="/" className="berem-btn berem-btn--primary group">
            <span className="berem-btn__content">Retour à l’accueil</span>
            <span className="berem-btn__icon" aria-hidden="true"><Home size={18} /></span>
            <span className="berem-btn__shine" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold">
          {liens.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-flex items-center gap-1.5 text-berem-orange-hover transition-colors hover:text-berem-primary">
                {l.label} <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
