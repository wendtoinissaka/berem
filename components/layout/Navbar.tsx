"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

type Solution = {
  id: string;
  name: string;
  slug: string;
};

type NavbarProps = {
  solutions: Solution[];
};

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Entreprise", href: "/entreprise" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions", hasDropdown: true },
  { label: "Réalisations", href: "/realisations" },
  { label: "Chantiers", href: "/chantiers" },
];

export default function Navbar({ solutions }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isSolutionsActive =
    pathname === "/solutions" ||
    pathname.startsWith("/solutions/") ||
    pathname === "/domotique" ||
    pathname.startsWith("/domotique/");

  useEffect(() => {
    setMenuOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSolutionsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-berem-border bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-8 lg:px-10">

        {/* IDENTITÉ BEREM */}
        <Link
          href="/"
          aria-label="BEREM - Accueil"
          className="group flex shrink-0 items-center gap-1"
        >
          <Image
            src="/images/berem-logo.png"
            alt="Logo BEREM"
            width={200}
            height={120}
            priority
            className="h-12 w-auto object-contain sm:h-14 lg:h-16"
          />

          <span className="relative -ml-1 inline-block overflow-hidden text-lg font-extrabold tracking-[0.07em] text-berem-primary sm:text-xl lg:text-2xl">
            <span className="block transition-opacity duration-300">
              BEREM
            </span>

            <span
              aria-hidden="true"
              className="absolute inset-0 block text-berem-orange [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:[clip-path:inset(0_0_0_0)]"
            >
              BEREM
            </span>
          </span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {navigation.map((item) => {
            // MENU SOLUTIONS
            if (item.hasDropdown) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={solutionsOpen}
                    aria-haspopup="true"
                    onClick={() =>
                      setSolutionsOpen((open) => !open)
                    }
                    className={`relative flex items-center gap-1.5 py-2 text-[13px] font-semibold transition-colors duration-200 ${
                      isSolutionsActive
                        ? "text-berem-orange"
                        : "text-berem-primary hover:text-berem-orange"
                    }`}
                  >
                    Solutions

                    <ChevronDown
                      size={15}
                      strokeWidth={1.8}
                      className={`transition-transform duration-200 ${
                        solutionsOpen ? "rotate-180" : ""
                      }`}
                    />

                    {isSolutionsActive && (
                      <span className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-berem-orange" />
                    )}
                  </button>

                  {/* LISTE DÉROULANTE */}
                  <div
                    className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4 transition-all duration-200 ${
                      solutionsOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-xl border border-berem-border bg-white p-2 shadow-xl">

                      <div className="px-3 pb-2 pt-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-berem-muted">
                          Nos solutions
                        </p>
                      </div>

                      {/* SOLUTIONS BEREM */}
                      {solutions.length > 0 ? (
                        solutions.map((solution) => {
                          const href = `/solutions/${solution.slug}`;
                          const active = isActive(href);

                          return (
                            <Link
                              key={solution.id}
                              href={href}
                              className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                                active
                                  ? "bg-berem-orange-soft text-berem-orange"
                                  : "text-berem-primary hover:bg-berem-cream hover:text-berem-orange"
                              }`}
                            >
                              <span>{solution.name}</span>

                              {active && (
                                <span className="h-1.5 w-1.5 rounded-full bg-berem-orange" />
                              )}
                            </Link>
                          );
                        })
                      ) : (
                        <p className="px-3 py-3 text-xs text-berem-muted">
                          Aucune solution disponible pour le moment.
                        </p>
                      )}

                      {/* DOMOTIQUE EN DERNIER */}
                      <div className="my-2 border-t border-berem-border" />

                      <Link
                        href="/domotique"
                        className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-bold transition-colors ${
                          isActive("/domotique")
                            ? "bg-berem-orange-soft text-berem-orange"
                            : "text-berem-primary hover:bg-berem-cream hover:text-berem-orange"
                        }`}
                      >
                        <span>Domotique</span>

                        {isActive("/domotique") && (
                          <span className="h-1.5 w-1.5 rounded-full bg-berem-orange" />
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            // AUTRES LIENS
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-[13px] font-semibold transition-colors duration-200 ${
                  active
                    ? "text-berem-orange"
                    : "text-berem-primary hover:text-berem-orange"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-berem-orange" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOUTON DEVIS DESKTOP */}
        <Link
          href="/devis"
          className="hidden items-center gap-2 rounded-full bg-berem-orange px-5 py-3 text-[13px] font-bold text-berem-primary transition-all duration-200 hover:bg-berem-orange-hover lg:inline-flex"
        >
          Demander un devis
          <ArrowUpRight size={16} strokeWidth={2} />
        </Link>

        {/* BOUTON MENU MOBILE */}
        <button
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-berem-border text-berem-primary transition-colors hover:bg-berem-orange-soft lg:hidden"
        >
          {menuOpen ? (
            <X size={21} strokeWidth={1.8} />
          ) : (
            <Menu size={21} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* MENU MOBILE */}
      <div
        id="mobile-navigation"
        aria-label="Navigation mobile"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`absolute inset-x-0 top-full overflow-hidden border-b border-berem-border bg-white shadow-xl transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen
            ? "visible max-h-[750px] translate-y-0 opacity-100"
            : "invisible max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 pb-6 pt-3 sm:px-8">
          <div className="divide-y divide-berem-border">

            {navigation.map((item) => {
              // MENU SOLUTIONS MOBILE
              if (item.hasDropdown) {
                return (
                  <div key={item.href} className="py-2">
                    <button
                      type="button"
                      aria-expanded={solutionsOpen}
                      onClick={() =>
                        setSolutionsOpen((open) => !open)
                      }
                      className={`flex w-full items-center justify-between py-2 text-sm font-semibold ${
                        isSolutionsActive
                          ? "text-berem-orange"
                          : "text-berem-primary"
                      }`}
                    >
                      Solutions

                      <ChevronDown
                        size={17}
                        strokeWidth={1.8}
                        className={`transition-transform duration-200 ${
                          solutionsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-200 ${
                        solutionsOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="space-y-1 pb-2 pl-3 pt-2">

                          {/* LISTE DES SOLUTIONS */}
                          {solutions.map((solution) => {
                            const href = `/solutions/${solution.slug}`;
                            const active = isActive(href);

                            return (
                              <Link
                                key={solution.id}
                                href={href}
                                className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium ${
                                  active
                                    ? "bg-berem-orange-soft text-berem-orange"
                                    : "text-berem-muted hover:bg-berem-cream hover:text-berem-primary"
                                }`}
                              >
                                <span>{solution.name}</span>

                                {active && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-berem-orange" />
                                )}
                              </Link>
                            );
                          })}

                          {/* DOMOTIQUE EN DERNIER */}
                          <div className="my-2 border-t border-berem-border" />

                          <Link
                            href="/domotique"
                            className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold ${
                              isActive("/domotique")
                                ? "bg-berem-orange-soft text-berem-orange"
                                : "text-berem-primary hover:bg-berem-cream"
                            }`}
                          >
                            <span>Domotique</span>

                            {isActive("/domotique") && (
                              <span className="h-1.5 w-1.5 rounded-full bg-berem-orange" />
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // AUTRES LIENS MOBILE
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between py-3.5 text-sm font-semibold transition-colors ${
                    active
                      ? "text-berem-orange"
                      : "text-berem-primary hover:text-berem-orange"
                  }`}
                >
                  <span>{item.label}</span>

                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-berem-orange" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ACTION MOBILE */}
          <Link
            href="/devis"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-berem-orange px-5 py-3.5 text-sm font-bold text-berem-primary transition-colors hover:bg-berem-orange-hover"
          >
            Demander un devis
            <ArrowUpRight size={17} />
          </Link>

          <p className="mt-4 text-center text-[11px] font-medium tracking-wide text-berem-muted">
            BEREM - Génie civil & construction
          </p>
        </nav>
      </div>
    </header>
  );
}