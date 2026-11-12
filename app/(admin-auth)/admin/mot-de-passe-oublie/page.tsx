import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requestPasswordReset } from "@/lib/actions/admin-auth";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ sent?: string }> };

export default function ForgotPasswordPage({ searchParams }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">BEREM</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Indique l'adresse e-mail associée au compte administrateur. Si elle correspond à un compte, un lien de réinitialisation sera envoyé.
        </p>

        <Suspense fallback={<p className="mt-6 text-sm text-slate-500">Chargement...</p>}>
          <ForgotPasswordForm searchParams={searchParams} />
        </Suspense>

        <Link href="/admin/connexion" className="mt-6 inline-block text-sm font-medium text-amber-700 hover:text-amber-600">
          Retour à la connexion
        </Link>
      </div>
    </main>
  );
}

async function ForgotPasswordForm({ searchParams }: Props) {
  const { sent } = await searchParams;

  return (
    <>
      {sent === "1" && (
        <div className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-700" role="status">
          Si cette adresse correspond au compte administrateur, un e-mail contenant les instructions vient d'être envoyé.
        </div>
      )}

      <form action={requestPasswordReset} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Adresse e-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="administrateur@exemple.com"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
          Envoyer le lien
        </button>
      </form>
    </>
  );
}
