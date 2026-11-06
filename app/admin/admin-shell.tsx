import type { ReactNode } from "react";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAdmin } from "@/lib/actions/admin-auth";
import AdminNavigation from "./admin-navigation";

async function AdminContent({ children }: { children: ReactNode }) {
  await connection();

  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#F7F5F1] text-[#172033]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#10161F] text-white shadow-lg shadow-black/10">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-10">
          <div className="flex min-h-[88px] flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-xl font-black tracking-[0.08em]"
              >
                BEREM
                <span className="rounded-md bg-[#D59344] px-2 py-1 text-[10px] font-black tracking-[0.16em] text-[#10161F]">
                  ADMIN
                </span>
              </Link>

              <p className="mt-2 text-xs text-slate-400">
                Espace de gestion et d'administration
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-xs text-slate-400">
                  Connecté en tant que
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {admin.email}
                </p>
              </div>

              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-[#D59344] hover:bg-white/5 hover:text-white"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 py-3">
            <AdminNavigation />
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100vh-150px)] max-w-[1600px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        {children}
      </main>

      <footer className="border-t border-[#EAE1D7] bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-5 py-5 text-xs text-[#647084] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>
            <span className="font-bold text-[#172033]">BEREM</span>
            {" "}- Espace d'administration
          </p>

          <p>Gestion du contenu et suivi des activités</p>
        </div>
      </footer>
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F5F1] px-5">
          <div className="w-full max-w-sm rounded-2xl border border-[#EAE1D7] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 size-9 animate-spin rounded-full border-2 border-[#EAE1D7] border-t-[#D59344]" />

            <p className="font-semibold text-[#172033]">
              Chargement de l’espace d’administration
            </p>

            <p className="mt-2 text-sm text-[#647084]">
              Veuillez patienter quelques instants.
            </p>
          </div>
        </div>
      }
    >
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}