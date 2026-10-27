"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <header className="sticky top-0 z-50 border-b border-berem-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="BEREM - Accueil"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/images/berem-logo.png"
            alt="BEREM — Génie civil et construction"
            width={180}
            height={100}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-berem-muted transition-colors duration-200 hover:text-berem-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/devis"
            className="inline-flex items-center gap-3 bg-berem-primary px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#4b3023] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berem-primary"
          >
            Demander un devis
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center border border-berem-border text-2xl text-berem-primary transition-colors hover:bg-berem-surface lg:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigation mobile"
          className="border-t border-berem-border bg-white px-5 py-5 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-berem-muted transition-colors hover:bg-berem-surface hover:text-berem-primary"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/devis"
              onClick={() => setMenuOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 bg-berem-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4b3023]"
            >
              Demander un devis
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}