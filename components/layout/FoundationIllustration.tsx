"use client";

import { useEffect, useRef, useState } from "react";

export default function FoundationIllustration() {
  const illustrationRef = useRef<HTMLDivElement>(null);

  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Le parent est la zone complète du footer institutionnel.
    // On écoute les événements sur cette zone, pas sur le dessin :
    // les liens restent donc accessibles.
    const zone = illustrationRef.current?.parentElement;

    if (!zone) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const rect = zone.getBoundingClientRect();

      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        setPointer({
          x: Math.max(-1, Math.min(1, targetX)),
          y: Math.max(-1, Math.min(1, targetY)),
        });
      });
    };

    const handleEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setActive(true);
    };

    const handleLeave = () => {
      setActive(false);
      setPointer({ x: 0, y: 0 });
    };

    zone.addEventListener("pointermove", handleMove);
    zone.addEventListener("pointerenter", handleEnter);
    zone.addEventListener("pointerleave", handleLeave);

    return () => {
      cancelAnimationFrame(frame);
      zone.removeEventListener("pointermove", handleMove);
      zone.removeEventListener("pointerenter", handleEnter);
      zone.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  const motion = (depth: number) => ({
    transform: `translate3d(${pointer.x * depth}px, ${pointer.y * depth * 0.55}px, 0)`,
  });

  return (
    <div
      ref={illustrationRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
    >
      {/* Lumière d'ambiance */}
      <div
        className="absolute -bottom-36 left-[42%] h-[420px] w-[520px] rounded-full bg-[#696B43]/[0.07] blur-[100px] transition-opacity duration-700"
        style={{
          opacity: active ? 1 : 0.45,
          ...motion(7),
        }}
      />

      {/* Trame architecturale de fond */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(193,161,143,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(193,161,143,.18) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "linear-gradient(to top, black, transparent 90%)",
          ...motion(3),
        }}
      />

      {/* Dessin principal */}
      <div
        className="absolute bottom-[-32px] left-1/2 w-[580px] max-w-none -translate-x-1/2 text-[#C1A18F]/65 transition-transform duration-200 ease-out md:left-[58%] lg:w-[700px] xl:left-[60%] xl:w-[780px]"
        style={{
          ...motion(12),
          filter: active
            ? "drop-shadow(0 0 16px rgba(193,161,143,0.06))"
            : "none",
        }}
      >
        <svg
          viewBox="0 0 780 430"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
        >
          <defs>
            <linearGradient id="concreteTop" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#C1A18F" stopOpacity=".22" />
              <stop offset="1" stopColor="#C1A18F" stopOpacity=".04" />
            </linearGradient>

            <linearGradient id="concreteSide" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#C1A18F" stopOpacity=".12" />
              <stop offset="1" stopColor="#C1A18F" stopOpacity=".025" />
            </linearGradient>

            <linearGradient id="oliveSide" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#696B43" stopOpacity=".28" />
              <stop offset="1" stopColor="#696B43" stopOpacity=".04" />
            </linearGradient>

            <pattern
              id="soilHatch"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(35)"
            >
              <path
                d="M0 0V8"
                stroke="#C1A18F"
                strokeOpacity=".2"
                strokeWidth=".7"
              />
            </pattern>
          </defs>

          {/* Axes et lignes de référence */}
          <g
            stroke="#C1A18F"
            strokeWidth=".7"
            strokeDasharray="3 7"
            opacity=".35"
          >
            <path d="M100 80V355" />
            <path d="M260 40V375" />
            <path d="M420 25V390" />
            <path d="M580 55V365" />
            <path d="M55 180H710" />
            <path d="M55 285H710" />
          </g>

          {/* Sol excavé : coupe du terrain */}
          <g stroke="#C1A18F" strokeWidth=".8">
            <path
              d="M58 300L155 340L425 398L700 305"
              fill="url(#soilHatch)"
              strokeOpacity=".55"
            />
            <path
              d="M58 300L155 340L425 398L700 305"
              strokeDasharray="5 5"
              strokeOpacity=".6"
            />
            <path d="M58 309L155 349L425 407L700 314" strokeOpacity=".2" />
          </g>

          {/* Semelle filante arrière */}
          <g stroke="currentColor" strokeWidth="1">
            <path
              d="M170 210L425 115L635 185L380 282Z"
              fill="url(#concreteTop)"
            />
            <path
              d="M170 210V241L380 314V282Z"
              fill="url(#concreteSide)"
            />
            <path
              d="M380 282L635 185V216L380 314Z"
              fill="url(#oliveSide)"
            />
          </g>

          {/* Semelles isolées : volumes */}
          <g stroke="currentColor" strokeWidth="1.15">
            <path
              d="M100 285L165 251L232 274L166 310Z"
              fill="url(#concreteTop)"
            />
            <path d="M100 285V306L166 331V310Z" fill="url(#concreteSide)" />
            <path d="M166 310L232 274V295L166 331Z" fill="url(#oliveSide)" />

            <path
              d="M320 316L390 279L463 304L392 342Z"
              fill="url(#concreteTop)"
            />
            <path d="M320 316V338L392 365V342Z" fill="url(#concreteSide)" />
            <path d="M392 342L463 304V326L392 365Z" fill="url(#oliveSide)" />

            <path
              d="M535 267L600 233L670 257L605 293Z"
              fill="url(#concreteTop)"
            />
            <path d="M535 267V288L605 314V293Z" fill="url(#concreteSide)" />
            <path d="M605 293L670 257V278L605 314Z" fill="url(#oliveSide)" />
          </g>

          {/* Longrines de liaison */}
          <g stroke="currentColor" strokeWidth="1">
            <path d="M166 310L320 316L320 332L166 326Z" fill="url(#concreteSide)" />
            <path d="M392 342L535 267L535 284L392 359Z" fill="url(#concreteSide)" />
          </g>

          {/* Armatures de la semelle arrière */}
          <g
            stroke="#C1A18F"
            strokeWidth="1.15"
            opacity={active ? 1 : 0.72}
          >
            <path d="M190 213L380 279L610 193" />
            <path d="M215 203L380 261L583 187" />
            <path d="M240 193L380 243L556 181" />
            <path d="M265 184L380 225L530 175" />
            <path d="M290 175L380 207L503 169" />
            <path d="M315 166L380 189L477 163" />
          </g>

          {/* Armatures verticales */}
          <g stroke="#C1A18F" strokeWidth="1.1">
            {Array.from({ length: 8 }, (_, i) => (
              <path
                key={`bar-${i}`}
                d={`M${205 + i * 49} ${200 - i * 5}L${205 + i * 49} ${228 + i * 5}`}
                opacity=".65"
              />
            ))}
          </g>

          {/* Poteaux en béton armé */}
          <g stroke="currentColor" strokeWidth="1.15">
            {/* Poteau gauche */}
            <path d="M245 94L245 199L275 210L275 105Z" fill="url(#concreteSide)" />
            <path d="M245 94L260 85L290 96L275 105Z" fill="url(#concreteTop)" />
            <path d="M275 105L290 96V201L275 210Z" fill="url(#oliveSide)" />

            {/* Poteau central */}
            <path d="M405 60V177L435 188V71Z" fill="url(#concreteSide)" />
            <path d="M405 60L420 51L450 62L435 71Z" fill="url(#concreteTop)" />
            <path d="M435 71L450 62V177L435 188Z" fill="url(#oliveSide)" />

            {/* Poteau droit */}
            <path d="M565 104V211L595 222V115Z" fill="url(#concreteSide)" />
            <path d="M565 104L580 95L610 106L595 115Z" fill="url(#concreteTop)" />
            <path d="M595 115L610 106V211L595 222Z" fill="url(#oliveSide)" />
          </g>

          {/* Armatures apparentes des poteaux */}
          <g stroke="#C1A18F" strokeWidth="1.15">
            <path d="M252 94V200M259 91V202M267 101V207" />
            <path d="M412 60V180M420 57V183M428 68V185" />
            <path d="M572 103V213M580 100V216M588 112V219" />
          </g>

          {/* Étriers */}
          <g stroke="#696B43" strokeWidth="1.4">
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={`tie-${i}`}
                d={`M${248 + i * 0.2} ${112 + i * 13}L${275} ${122 + i * 13}`}
              />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={`tie-center-${i}`}
                d={`M408 ${80 + i * 14}L437 ${91 + i * 14}`}
              />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={`tie-right-${i}`}
                d={`M568 ${124 + i * 13}L597 ${135 + i * 13}`}
              />
            ))}
          </g>

          {/* Points de connexion interactifs */}
          <g>
            {[
              [260, 85],
              [420, 51],
              [580, 95],
              [166, 310],
              [392, 342],
              [605, 293],
            ].map(([cx, cy], i) => (
              <g key={`node-${i}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={active ? 7 : 4}
                  fill="#696B43"
                  fillOpacity={active ? ".22" : ".1"}
                  className="transition-all duration-300"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={active ? 2.8 : 1.8}
                  fill="#C1A18F"
                />
              </g>
            ))}
          </g>

          {/* Cotes et annotations */}
          <g
            stroke="#C1A18F"
            strokeWidth=".8"
            fill="currentColor"
            fontFamily="Arial, sans-serif"
            fontSize="9"
            letterSpacing="1.4"
            opacity=".75"
          >
            <path d="M100 365H232M100 359V371M232 359V371" />
            <text x="120" y="381" stroke="none">
              SEMELLE ISOLEE
            </text>

            <path d="M480 345H550M480 339V351M550 339V351" />
            <text x="476" y="363" stroke="none">
              LONGRINE
            </text>

            <path d="M635 104H692M635 98V110M692 98V110" />
            <text x="637" y="94" stroke="none">
              POTEAU BA
            </text>
          </g>

          {/* Repères de plan */}
          <g stroke="#696B43" strokeWidth="1.1">
            <path d="M65 65H88M76.5 53.5V76.5" />
            <path d="M685 365H708M696.5 353.5V376.5" />
          </g>
        </svg>
      </div>

      {/* Légende technique en filigrane */}
      <div
        className="absolute bottom-7 right-8 hidden items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-[#C1A18F]/30 xl:flex"
        style={motion(5)}
      >
        <span className="h-px w-8 bg-[#696B43]/70" />
        Étude structurelle · BEREM
      </div>
    </div>
  );
}