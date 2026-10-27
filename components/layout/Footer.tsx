import Image from "next/image";
import Link from "next/link";
import CopyrightYear from "./CopyrightYear";
import FoundationIllustration from "./FoundationIllustration";

const navigation = [
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

export default function Footer() {
  return (
    <footer className="bg-[#392319] text-white">
      {/* APPEL À L'ACTION */}
      <section className="bg-[#FAF9F6] text-[#303438]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <div className="grid gap-6 border-b border-[#DCD5CC] pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[2px] w-7 bg-[#696B43]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#696B43]">
                  Donnons forme à vos ambitions
                </p>
              </div>

              <h2 className="max-w-2xl font-serif text-3xl font-medium leading-tight tracking-tight text-[#392319] sm:text-4xl lg:text-5xl">
                Un projet en tête ?
                <br />

                <span className="text-[#8B776B]">
                  Construisons la suite ensemble.
                </span>
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#62666A]">
                Présentez-nous votre projet et échangeons sur vos besoins.
              </p>
            </div>

            <Link
              href="/devis"
              className="group inline-flex min-h-12 w-fit items-center gap-7 bg-[#392319] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4B3023] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#392319]"
            >
              Demander un devis

              <span
                aria-hidden="true"
                className="text-lg transition-transform duration-200 group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B8178]">
              BEREM · Génie civil & construction
            </p>

            <div aria-hidden="true" className="flex items-center gap-1">
              <span className="h-1 w-6 bg-[#392319]" />
              <span className="h-1 w-3 bg-[#696B43]" />
              <span className="h-1 w-2 bg-[#C1A18F]" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER INSTITUTIONNEL */}
      <section className="relative isolate overflow-hidden">
        {/* Illustration technique interactive */}
        <FoundationIllustration />

        {/* Motif architectural secondaire */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[22%] border-l border-white/[0.04] lg:block"
        >
          <div className="absolute inset-y-0 left-1/2 border-l border-white/[0.035]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1fr] lg:gap-8">
            {/* IDENTITÉ */}
            <div>
              <Link
                href="/"
                aria-label="BEREM - Accueil"
                className="inline-flex items-center"
              >
                <Image
                  src="/images/berem-logo.png"
                  alt="BEREM — Génie civil et construction"
                  width={180}
                  height={100}
                  className="h-14 w-auto object-contain"
                />
              </Link>

              <p className="mt-4 max-w-xs font-serif text-lg leading-relaxed text-white">
                La rigueur dans la conception.
                <br />
                L'exigence dans la réalisation.
              </p>

              <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">
                Des solutions de construction adaptées à vos projets.
              </p>
            </div>

            {/* NAVIGATION */}
            <div>
              <h2 className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C1A18F]">
                <span className="h-px w-5 bg-[#696B43]" />
                Explorer
              </h2>

              <ul className="mt-5 space-y-3">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-[#C1A18F] transition-all duration-200 group-hover:w-3" />

                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* DOMAINES */}
            <div>
              <h2 className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C1A18F]">
                <span className="h-px w-5 bg-[#696B43]" />
                Nos domaines
              </h2>

              <ul className="mt-5 space-y-3">
                {domains.map((domain) => (
                  <li
                    key={domain}
                    className="text-sm leading-6 text-white/65"
                  >
                    {domain}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-3 border-l border-[#696B43] py-1 pl-3">
                <span
                  aria-hidden="true"
                  className="text-lg text-[#C1A18F]"
                >
                  ◇
                </span>

                <p className="max-w-[180px] text-xs leading-5 text-white/45">
                  Méthode, précision et exigence.
                </p>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h2 className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C1A18F]">
                <span className="h-px w-5 bg-[#696B43]" />
                Contact
              </h2>

              <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
                Un projet de construction ou des travaux à réaliser ?
                Échangeons sur vos besoins.
              </p>

              <Link
                href="/devis"
                className="group mt-4 inline-flex items-center gap-2 border-b border-white/25 pb-1.5 text-sm font-semibold text-white transition-colors hover:border-[#C1A18F] hover:text-[#C1A18F]"
              >
                Parlons de votre projet

                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </Link>
            </div>
          </div>

          {/* SIGNATURE FINALE */}
          <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/45">
              <CopyrightYear />
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
              Génie civil
              <span className="mx-2 text-[#696B43]">/</span>
              Construction
              <span className="mx-2 text-[#696B43]">/</span>
              BTP
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}