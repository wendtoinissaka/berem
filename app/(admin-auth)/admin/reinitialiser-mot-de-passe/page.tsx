import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { resetAdminPassword } from "@/lib/actions/admin-auth";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ token?: string; erreur?: string }>;
};

export default function ResetPasswordPage({ searchParams }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">BEREM</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Choisis un mot de passe d'au moins 12 caractères. Le lien est valable 20 minutes et ne peut être utilisé qu'une seule fois.
        </p>

        <Suspense fallback={<p className="mt-6 text-sm text-slate-500">Chargement...</p>}>
          <ResetPasswordForm searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function ResetPasswordForm({ searchParams }: Props) {
  const { token, erreur } = await searchParams;

  if (!token) {
    return (
      <div className="mt-6 space-y-4">
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {erreur === "invalide"
            ? "Ce lien est invalide, expiré ou a déjà été utilisé."
            : "Le lien de réinitialisation est manquant."}
        </p>
        <Link href="/admin/mot-de-passe-oublie" className="inline-block text-sm font-medium text-amber-700 hover:text-amber-600">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <>
      {erreur === "validation" && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Vérifie les deux mots de passe : ils doivent être identiques et contenir au moins 12 caractères (72 octets maximum).
        </p>
      )}
      {erreur === "invalide" && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Ce lien est invalide, expiré ou a déjà été utilisé. Demande-en un nouveau.
        </p>
      )}

      <form action={resetAdminPassword} className="mt-6 space-y-4">
        <input type="hidden" name="token" value={token} />
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Nouveau mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
        </div>
        <div>
          <label htmlFor="confirmation" className="mb-2 block text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
          <input
            id="confirmation"
            name="confirmation"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
          Enregistrer le nouveau mot de passe
        </button>
      </form>
    </>
  );
}
