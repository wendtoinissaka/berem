"use client";

// global-error remplace le layout racine : il faut donc réimporter les styles et fournir <html> et <body>.
// Adaptez le chemin si votre fichier de styles n'est pas app/globals.css.
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <main className="flex min-h-screen items-center bg-background px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-[2px] w-10 bg-berem-orange" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-berem-orange-hover">Petit contretemps</p>
              <span className="h-[2px] w-10 bg-berem-orange" />
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-berem-primary sm:text-5xl">
              Le site prend un peu de retard.
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-berem-muted">
              Ce n’est pas de votre fait. Rechargez la page : dans la plupart des cas, tout rentre dans l’ordre.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row">
              <button type="button" onClick={reset} className="berem-btn berem-btn--primary group">
                <span className="berem-btn__content">Recharger la page</span>
                <span className="berem-btn__shine" aria-hidden="true" />
              </button>
              {/* Lien classique : le routeur peut être indisponible dans cet état. */}
              <a href="/" className="berem-btn berem-btn--dark group">
                <span className="berem-btn__content">Retour à l’accueil</span>
                <span className="berem-btn__shine" aria-hidden="true" />
              </a>
            </div>

            {error.digest && (
              <p className="mt-10 text-[11px] tracking-wide text-berem-muted/80">Référence : {error.digest}</p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
