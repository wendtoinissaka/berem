import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

import CopyrightYear from "./CopyrightYear";
import FoundationIllustration from "./FoundationIllustration";

// ============================================
// ICÔNES DES RÉSEAUX SOCIAUX — SVG PERSONNALISÉS
// ============================================

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.8-.1-1.7-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.2H7.2V13H10v8h3.5Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9h4v12H3V9Zm7 0h4v1.6c.6-1 1.7-1.9 3.5-1.9 3.7 0 4.5 2.4 4.5 5.5V21h-4v-6c0-1.4 0-3-1.9-3s-2.1 1.5-2.1 3v6h-4V9Z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

// ============================================
// DONNÉES DU FOOTER
// ============================================

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "L'entreprise", href: "/entreprise" },
  { label: "Nos services", href: "/services" },
  { label: "Nos solutions", href: "/solutions" },
  { label: "Nos réalisations", href: "/realisations" },
  { label: "Chantiers en cours", href: "/chantiers" },
];

const domains = [
  "Génie civil",
  "Construction",
  "Travaux publics",
  "Études techniques",
];

const contact = {
  phone: "+226 61 91 00 41",
  whatsapp: "+22661910041",
  email: "beremingenierie@gmail.com",
  address: "Secteur 51, Ouagadougou, Burkina Faso",
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1JAcgF3FCQ/",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/beremmzaka/",
    icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/berem",
    icon: LinkedinIcon,
  },
  {
    label: "YouTube",
    href: "https://m.youtube.com/@beremmzaka4471", // Ajouter ici l'adresse officielle de la chaîne YouTube
    icon: YoutubeIcon,
  },
];

const platforms = [
  {
    label: "MZAKA",
    href: "https://site-mzaka.duckdns.org",
  },
];

// ============================================
// COMPOSANT FOOTER
// ============================================

export default function Footer() {
  const activeSocialLinks = socialLinks.filter((social) => social.href.trim());

  return (
    <footer className="relative isolate overflow-hidden bg-[#10161F] text-white">

      <FoundationIllustration />

      {/* Motif architectural discret */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[25%] border-l border-white/[0.04] lg:block"
      >
        <div className="absolute inset-y-0 left-1/2 border-l border-white/[0.04]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">

        {/* CONTENU PRINCIPAL */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1.15fr] lg:gap-12">

          {/* IDENTITÉ, RÉSEAUX ET PLATEFORMES */}
          <div>
            {/* Logo */}
            <Link
              href="/"
              aria-label="BEREM - Accueil"
              className="inline-flex items-center gap-1"
            >
              <Image
                src="/images/berem-logo.png"
                alt="Logo BEREM"
                width={200}
                height={120}
                className="h-14 w-auto object-contain sm:h-16"
              />

              <span className="-ml-1 text-2xl font-extrabold tracking-[0.07em] text-white">
                BEREM
              </span>
            </Link>

            {/* Réseaux sociaux */}
            {activeSocialLinks.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                  Suivez-nous
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                  {activeSocialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D59344] hover:bg-[#D59344] hover:text-[#10161F]"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Plateformes */}
            {platforms.length > 0 && (
              <div className="mt-7">
                <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                  Nos plateformes
                </h2>

                <ul className="space-y-3">
                  {platforms.map((platform) => (
                    <li key={platform.href}>
                      <a
                        href={platform.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-[#D59344]"
                      >
                        <Globe size={15} />
                        {platform.label}
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* NAVIGATION */}
          <div>
            <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#D59344]">
              <span className="h-px w-5 bg-[#D59344]" />
              Navigation
            </h2>

            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#D59344]"
                  >
                    <span className="h-px w-0 bg-[#D59344] transition-all duration-200 group-hover:w-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DOMAINES — MASQUÉS SUR MOBILE ET TABLETTE */}
          <div className="hidden lg:block">
            <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#D59344]">
              <span className="h-px w-5 bg-[#D59344]" />
              Nos domaines
            </h2>

            <ul className="mt-5 space-y-3">
              {domains.map((domain) => (
                <li key={domain} className="text-sm text-white/60">
                  {domain}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#D59344]">
              <span className="h-px w-5 bg-[#D59344]" />
              Contactez-nous
            </h2>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
              Notre équipe est disponible pour échanger sur vos projets et vous accompagner dans leur réalisation.
            </p>

            <div className="mt-5 space-y-4">

              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="group flex items-start gap-3"
                >
                  <Phone size={17} className="mt-0.5 shrink-0 text-[#D59344]" />
                  <span className="text-sm text-white/70 transition-colors group-hover:text-[#D59344]">
                    {contact.phone}
                  </span>
                </a>
              )}

              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <Phone size={17} className="mt-0.5 shrink-0 text-[#D59344]" />
                  <span className="text-sm text-white/70 transition-colors group-hover:text-[#D59344]">
                    WhatsApp : {contact.whatsapp}
                  </span>
                </a>
              )}

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex items-start gap-3"
                >
                  <Mail size={17} className="mt-0.5 shrink-0 text-[#D59344]" />
                  <span className="break-all text-sm text-white/70 transition-colors group-hover:text-[#D59344]">
                    {contact.email}
                  </span>
                </a>
              )}

              {contact.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-[#D59344]" />
                  <span className="text-sm leading-6 text-white/70">
                    {contact.address}
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/devis"
              className="group mt-6 inline-flex items-center gap-2 border-b border-[#D59344]/50 pb-2 text-sm font-semibold text-[#D59344] transition-colors hover:border-[#D59344] hover:text-white"
            >
              Demander un devis
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* BARRE INFÉRIEURE */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-white/45">
            <CopyrightYear />
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="#"
              // href="/mentions-legales"
              className="text-xs text-white/45 transition-colors hover:text-[#D59344]"
            >
              Mentions légales
            </Link>

            <Link
              href="#"
              // href="/politique-confidentialite"
              className="text-xs text-white/45 transition-colors hover:text-[#D59344]"
            >
              Confidentialité
            </Link>

            <span className="hidden h-4 w-px bg-white/15 sm:block" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
              Génie civil · Construction · BTP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}