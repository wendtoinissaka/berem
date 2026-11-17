"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur BEREM :", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf7f1] px-6 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#d59344]/10 text-5xl">
          🏗️
        </div>

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#d59344]">
          BEREM · Un petit imprévu
        </p>

        <h1 className="mb-5 text-3xl font-bold tracking-tight text-[#10161f] sm:text-4xl">
          Oups ! Un imprévu sur le chantier.
        </h1>

        <p className="mx-auto mb-9 max-w-md leading-7 text-gray-600">
          Nous rencontrons actuellement une difficulté technique.
          Nos équipes travaillent pour rétablir la situation.
          Vous pouvez réessayer dans quelques instants.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-xl bg-[#d59344] px-7 py-3.5 font-semibold text-white transition hover:bg-[#bd7e32]"
          >
            Réessayer
          </button>

          <Link
            href="/"
            className="rounded-xl border border-gray-300 px-7 py-3.5 font-semibold text-[#10161f] transition hover:bg-white"
          >
            Retour à l'accueil
          </Link>
        </div>

        <p className="mt-12 text-sm text-gray-400">
          BEREM — Construisons aujourd'hui les espaces de demain.
        </p>
      </div>
    </main>
  );
}