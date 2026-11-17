"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const WHATSAPP_MESSAGE =
  "Bonjour BEREM, je souhaite avoir des informations sur vos services.";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-center gap-3 sm:bottom-7 sm:right-7">
      {/* RETOUR EN HAUT */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Retourner en haut de la page"
        aria-hidden={!showScrollTop}
        tabIndex={showScrollTop ? 0 : -1}
        className={`group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#102A43] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#1b4264] hover:shadow-xl ${
          showScrollTop
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp size={20} strokeWidth={2} />

        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-[#102A43] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Retour en haut
        </span>
      </button>

      {/* WHATSAPP */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter BEREM sur WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-2xl sm:h-16 sm:w-16"
      >
        <FaWhatsapp size={34} />

        {/* INDICATEUR DE DISPONIBILITÉ */}
        <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-green-600" />

        {/* INFOBULLE */}
        <span className="pointer-events-none absolute right-[calc(100%+12px)] whitespace-nowrap rounded-lg bg-[#102A43] px-4 py-2.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:translate-x-2">
          Discutons sur WhatsApp
        </span>
      </a>
    </div>
  );
}