"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight, Home, MessageCircle, RefreshCw, Wrench } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En production, le message réel est masqué : cherchez le "digest" dans les logs Render.
    console.error(error);
  }, [error]);

  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <main className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-background px-5 py-24 sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 -z-10 h-[420px] w-[420px] rounded-full border border-berem-primary/[0.06]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-24 -z-10 h-[290px] w-[290px] rounded-full border border-berem-primary/[0.06]" />

      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-berem-orange/40 bg-berem-orange-soft text-berem-orange-hover">
          <Wrench size={28} strokeWidth={1.6} aria-hidden="true" />
        </span>

        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="h-[2px] w-10 bg-berem-orange" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-berem-orange-hover">Petit contretemps</p>
          <span className="h-[2px] w-10 bg-berem-orange" />
        </div>

        <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-berem-primary sm:text-5xl">
          Cette page prend un peu de retard.
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-berem-muted">
          Ce n’est pas de votre fait. Rechargez la page : dans la plupart des cas, tout rentre dans l’ordre. Votre
          projet mérite mieux qu’une page blanche, et nous restons disponibles pour en parler.
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row">
          <button type="button" onClick={reset} className="berem-btn berem-btn--primary group">
            <span className="berem-btn__content">Recharger la page</span>
            <span className="berem-btn__icon" aria-hidden="true"><RefreshCw size={18} /></span>
            <span className="berem-btn__shine" aria-hidden="true" />
          </button>
          <Link href="/" className="berem-btn berem-btn--dark group">
            <span className="berem-btn__content">Retour à l’accueil</span>
            <span className="berem-btn__icon" aria-hidden="true"><Home size={18} /></span>
            <span className="berem-btn__shine" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold">
          {numero && (
            <a
              href={`https://wa.me/${numero}?text=${encodeURIComponent("Bonjour BEREM, je rencontre un problème sur votre site.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-berem-orange-hover transition-colors hover:text-berem-primary"
            >
              <MessageCircle size={16} aria-hidden="true" /> Nous écrire sur WhatsApp
            </a>
          )}
          <Link href="/devis" className="inline-flex items-center gap-2 text-berem-orange-hover transition-colors hover:text-berem-primary">
            Demander un devis <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {error.digest && (
          <p className="mt-10 text-[11px] tracking-wide text-berem-muted/80">
            Référence : {error.digest} (à nous communiquer si vous nous contactez)
          </p>
        )}
      </div>
    </main>
  );
}
