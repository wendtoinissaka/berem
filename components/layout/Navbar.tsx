"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Entreprise", href: "/entreprise" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Chantiers", href: "/chantiers" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le menu lors d'un changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Fermer le menu avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-berem-border bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-8 lg:px-10">

        {/* IDENTITÉ BEREM */}
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
    {/* Texte initial */}
    <span className="block transition-opacity duration-300">
      BEREM
    </span>

    {/* Texte animé */}
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
            ? "visible max-h-[520px] translate-y-0 opacity-100"
            : "invisible max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 pb-6 pt-3 sm:px-8">
          <div className="divide-y divide-berem-border">
            {navigation.map((item, index) => {
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