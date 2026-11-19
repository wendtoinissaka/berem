import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileText, ShieldCheck } from "lucide-react";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  updatedAt?: string;
  type: "legal" | "privacy";
  children: ReactNode;
};

export default function LegalPageLayout({
  title,
  description,
  updatedAt,
  type,
  children,
}: LegalPageLayoutProps) {
  const Icon = type === "legal" ? FileText : ShieldCheck;

  return (
    <main className="min-h-screen bg-[#FBF7F1]">
      {/* EN-TÊTE */}
      <section className="relative isolate overflow-hidden bg-[#10161F] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[500px] w-[500px] rounded-full border border-[#D59344]/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 -z-10 h-[350px] w-[350px] rounded-full border border-[#D59344]/10"
        />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/50 transition-colors hover:text-[#D59344]"
          >
            <ArrowLeft size={14} />
            Retour à l'accueil
          </Link>

          <div className="mt-12 max-w-3xl sm:mt-16">
            <div className="mb-6 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[#D59344]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D59344]">
                BEREM · Informations institutionnelles
              </span>
            </div>

            <div className="flex items-start gap-4 sm:gap-6">
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#D59344]/20 bg-[#D59344]/10 sm:flex">
                <Icon size={28} className="text-[#D59344]" />
              </div>

              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  {title}
                  <span className="text-[#D59344]">.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                  {description}
                </p>

                {updatedAt && (
                  <p className="mt-5 text-xs text-white/40">
                    Dernière mise à jour : {updatedAt}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENU */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <article className="min-w-0">
            <div className="rounded-2xl border border-[#172033]/[0.07] bg-white p-6 shadow-[0_12px_50px_rgba(16,22,31,0.04)] sm:p-10 lg:p-12">
              <div className="legal-content">{children}</div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[#172033]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#172033]/45">
                BEREM Ingénierie · Ouagadougou, Burkina Faso
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#172033]/65 transition-colors hover:text-[#D59344]"
              >
                Retour au site
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </article>

          {/* NAVIGATION SECONDAIRE */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-2xl border border-[#172033]/[0.07] bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#172033]/40">
                Informations
              </p>

              <nav className="mt-5 space-y-2">
                <Link
                  href="/mentions-legales"
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${
                    type === "legal"
                      ? "bg-[#10161F] font-semibold text-white"
                      : "text-[#172033]/65 hover:bg-[#FBF7F1] hover:text-[#10161F]"
                  }`}
                >
                  Mentions légales
                  {type === "legal" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D59344]" />
                  )}
                </Link>

                <Link
                  href="/politique-confidentialite"
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${
                    type === "privacy"
                      ? "bg-[#10161F] font-semibold text-white"
                      : "text-[#172033]/65 hover:bg-[#FBF7F1] hover:text-[#10161F]"
                  }`}
                >
                  Confidentialité
                  {type === "privacy" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D59344]" />
                  )}
                </Link>
              </nav>
            </div>

            <div className="mt-5 rounded-2xl border border-[#D59344]/20 bg-[#D59344]/[0.07] p-6">
              <p className="text-sm font-bold text-[#10161F]">
                Une question ?
              </p>
              <p className="mt-2 text-xs leading-6 text-[#172033]/60">
                Notre équipe reste disponible pour toute demande concernant
                nos informations et nos services.
              </p>

              <a
                href="mailto:contact@berem.bf"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#9B6425] hover:text-[#10161F]"
              >
                Nous contacter
                <ArrowUpRight size={14} />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}