import type { ReactNode } from "react";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { logoutAdmin } from "@/lib/actions/admin-auth";

async function AdminContent({ children }: { children: ReactNode }) {
  await connection();
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <Link href="/admin" className="text-xl font-bold tracking-wide">
              BEREM <span className="text-amber-400">ADMIN</span>
            </Link>
            <p className="mt-1 text-xs text-slate-400">
              Connecté : {admin.email}
            </p>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:bg-slate-800"
            >
              Déconnexion
            </button>
          </form>
        </div>

        <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 px-6 pb-4 text-sm">
          <Link href="/admin" className="rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700">
            Tableau de bord
          </Link>
          <Link href="/admin/projets" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Chantiers
          </Link>
          <Link
              href="/admin/solutions"
              className="rounded-lg px-3 py-2 hover:bg-slate-800"
            >
              Solutions
            </Link>
          <Link
            href="/admin/devis"
            className="rounded-lg px-3 py-2 hover:bg-slate-800"
          >
            Demandes de devis
          </Link>
          <Link href="/admin/services" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Services
          </Link>
          <Link href="/admin/temoignages" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Témoignages
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 p-8">
          Chargement de l’espace d’administration…
        </div>
      }
    >
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}