import type { Metadata } from "next";
import { Suspense } from "react";
import { loginAdmin } from "@/lib/actions/admin-auth";

export const metadata: Metadata = {
  title: "Connexion administrateur",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{ erreur?: string }>;
};

function LoginForm({
  erreur,
}: {
  erreur?: string;
}) {
  return (
    <>
      {erreur && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {erreur === "identifiants"
            ? "Adresse e-mail ou mot de passe incorrect."
            : "La configuration de l'administration est incomplète."}
        </div>
      )}

      <form action={loginAdmin} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Adresse e-mail
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="administrateur@exemple.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Mot de passe
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="Ton mot de passe"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          Se connecter
        </button>
      </form>
    </>
  );
}

export default function AdminLoginPage({
  searchParams,
}: LoginPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            BEREM
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Administration
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Connecte-toi pour gérer les activités du site.
          </p>
        </div>

        <Suspense
          fallback={
            <p className="text-sm text-slate-500">
              Chargement du formulaire...
            </p>
          }
        >
          <LoginFormWrapper searchParams={searchParams} />
        </Suspense>

        <p className="mt-6 text-center text-xs text-slate-400">
          Espace privé · BEREM
        </p>
      </div>
    </main>
  );
}

async function LoginFormWrapper({
  searchParams,
}: LoginPageProps) {
  const { erreur } = await searchParams;

  return <LoginForm erreur={erreur} />;
}