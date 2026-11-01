"use client";

import Link from "next/link";
import { useRef } from "react";

const constructionImage =
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2400&q=90";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;

    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2;
    const rotateY = ((x - centerX) / centerX) * 2;

    hero.style.setProperty("--pointer-x", `${x}px`);
    hero.style.setProperty("--pointer-y", `${y}px`);
    hero.style.setProperty("--rotate-x", `${rotateX}deg`);
    hero.style.setProperty("--rotate-y", `${rotateY}deg`);
  };

  const resetPointer = () => {
    const hero = heroRef.current;
    if (!hero) return;

    hero.style.setProperty("--pointer-x", "70%");
    hero.style.setProperty("--pointer-y", "40%");
    hero.style.setProperty("--rotate-x", "0deg");
    hero.style.setProperty("--rotate-y", "0deg");
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="berem-hero relative isolate min-h-[760px] overflow-hidden bg-[#10161F] text-white lg:min-h-[900px]"
    >
      {/* PHOTOGRAPHIE IMMERSIVE */}
      <div className="berem-hero__visual absolute inset-0 -z-30 overflow-hidden">
        <div
          className="berem-hero__image absolute inset-0"
          style={{ backgroundImage: `url("${constructionImage}")` }}
        />
      </div>

      {/* OVERLAYS CINÉMATOGRAPHIQUES */}
      <div className="absolute inset-0 -z-20 bg-[#10161F]/35" />

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#10161F_0%,rgba(16,22,31,0.97)_20%,rgba(16,22,31,0.83)_43%,rgba(16,22,31,0.2)_100%)]" />

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(0deg,#10161F_0%,transparent_40%,rgba(16,22,31,0.3)_100%)]" />

      {/* ÉCLAIRAGE INTERACTIF */}
      <div aria-hidden="true" className="berem-hero__spotlight" />

      {/* TEXTURE */}
      <div aria-hidden="true" className="berem-hero__noise" />

      {/* GRILLE ARCHITECTURALE */}
      <div aria-hidden="true" className="berem-hero__grid">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* ÉLÉMENTS TECHNIQUES */}
      <div aria-hidden="true" className="berem-hero__technical">
        <div className="berem-hero__technical-circle">
          <span />
          <span />
          <span />
        </div>

        <div className="berem-hero__technical-cross berem-cross-one" />
        <div className="berem-hero__technical-cross berem-cross-two" />
      </div>

      {/* CONTENU */}
      <div className="relative mx-auto flex min-h-[760px] max-w-[1600px] flex-col justify-center px-5 pb-32 pt-36 sm:px-8 lg:min-h-[900px] lg:px-16 xl:px-24">
        <div className="relative z-10 max-w-[1100px]">

          {/* EYEBROW */}
          <div className="berem-hero__intro flex items-center gap-4">
            <span className="berem-hero__eyebrow-line" />

            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#E6B36F] sm:text-xs">
              BEREM — Génie civil & construction
            </span>

            <span className="berem-hero__eyebrow-dot" />
          </div>

          {/* TITRE */}
          <h1 className="berem-hero__title mt-9">
            <span className="berem-title-line">
              <span>Concevoir</span>
              <span className="berem-title-period">.</span>
            </span>

            <span className="berem-title-line berem-title-line--accent">
              <span>Bâtir</span>
              <span className="berem-title-period">.</span>
            </span>

            <span className="berem-title-line">
              <span>Durer</span>
              <span className="berem-title-period">.</span>
            </span>
          </h1>

          {/* SIGNATURE */}
          <div className="berem-hero__description mt-9 flex max-w-2xl items-start gap-5 sm:mt-12">
            <span className="mt-1 hidden h-[66px] w-[2px] shrink-0 bg-[#D59344] sm:block" />

            <p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8 lg:text-lg">
              De la conception à la réalisation, nous donnons forme à vos
              projets avec exigence, maîtrise technique et sens du travail
              bien fait.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="berem-hero__actions mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center">
            <Link
              href="/devis"
              className="berem-button berem-button--primary group"
            >
              <span>Parlons de votre projet</span>

              <span className="berem-button__icon" aria-hidden="true">
                ↗
              </span>
            </Link>

            <Link
              href="/realisations"
              className="berem-button berem-button--secondary group"
            >
              <span>Découvrir nos réalisations</span>

              <span className="berem-button__icon" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* SIGNATURE VERTICALE */}
        <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] lg:block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/50">
            La rigueur dans la conception · L'exigence dans la réalisation
          </span>
        </div>

        {/* COORDONNÉES GRAPHIQUES */}
        <div className="berem-hero__coordinates absolute right-8 top-32 hidden text-right lg:block">
          <span>BEREM / 001</span>
          <span>CONSTRUCTION & ENGINEERING</span>
          <span className="berem-coordinate-line" />
        </div>

        {/* SCROLL INDICATOR */}
        <a
          href="#berem-intro"
          aria-label="Défiler vers la suite du site"
          className="berem-hero__scroll absolute bottom-10 left-5 inline-flex items-center gap-4 sm:left-8 lg:left-16 xl:left-24"
        >
          <span className="berem-scroll-circle">
            <span />
          </span>

          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/65">
            Explorer le site
          </span>
        </a>

        {/* SIGNATURE BASSE */}
        <div className="absolute bottom-10 right-5 hidden items-center gap-3 sm:right-8 md:flex lg:right-16 xl:right-24">
          <span className="h-px w-12 bg-[#D59344]" />

          <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/55">
            Bâtir avec exigence
          </span>
        </div>
      </div>

      {/* PROGRESSION */}
      <div className="berem-hero__progress">
        <span />
      </div>

      {/* INDICATEUR LATÉRAL */}
      <div className="berem-hero__side-index hidden lg:flex">
        <span>01</span>
        <span />
        <span>03</span>
      </div>
    </section>
  );
}