"use client";

import { useState } from "react";

type RoomId = "salon" | "cuisine" | "chambre1" | "entree" | "terrasse" | "chambre2";

const ROOMS: { id: RoomId; label: string; x: number; y: number; w: number; h: number; outdoor?: boolean }[] = [
  { id: "salon", label: "Salon", x: 20, y: 20, w: 250, h: 170 },
  { id: "cuisine", label: "Cuisine", x: 270, y: 20, w: 150, h: 170 },
  { id: "chambre1", label: "Chambre 1", x: 420, y: 20, w: 160, h: 170 },
  { id: "entree", label: "Entrée", x: 20, y: 190, w: 150, h: 190 },
  { id: "terrasse", label: "Terrasse", x: 170, y: 190, w: 250, h: 190, outdoor: true },
  { id: "chambre2", label: "Chambre 2", x: 420, y: 190, w: 160, h: 190 },
];

type Scenario = {
  id: string;
  label: string;
  lit: RoomId[];
  alert?: RoomId;
  etat: [string, string][];
  note: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "soiree",
    label: "Soirée",
    lit: ["salon", "cuisine", "terrasse"],
    etat: [
      ["Éclairage", "Ambiance salon, cuisine et terrasse"],
      ["Volets", "Salon ouvert sur la terrasse"],
      ["Climatisation", "Salon et cuisine"],
      ["Alimentation", "Réseau"],
      ["Alarme", "Désarmée"],
    ],
    note: "Une seule commande règle l’ambiance de toute la maison.",
  },
  {
    id: "depart",
    label: "Je pars",
    lit: [],
    etat: [
      ["Éclairage", "Tout éteint"],
      ["Volets", "Fermés"],
      ["Climatisation", "Arrêtée"],
      ["Alimentation", "Réseau"],
      ["Alarme", "Armée"],
    ],
    note: "En quittant la maison, un seul geste éteint, ferme et protège.",
  },
  {
    id: "nuit",
    label: "Nuit",
    lit: ["entree"],
    etat: [
      ["Éclairage", "Veilleuse dans l’entrée"],
      ["Volets", "Fermés"],
      ["Climatisation", "Chambres uniquement"],
      ["Alimentation", "Réseau"],
      ["Alarme", "Armée, mode nuit"],
    ],
    note: "Les pièces de jour se mettent au repos, les chambres restent confortables.",
  },
  {
    id: "coupure",
    label: "Coupure d’électricité",
    lit: ["salon", "entree"],
    etat: [
      ["Éclairage", "Pièces essentielles uniquement"],
      ["Volets", "Inchangés"],
      ["Climatisation", "Délestée"],
      ["Alimentation", "Batterie ou solaire"],
      ["Alarme", "Active"],
    ],
    note: "Le système bascule seul et coupe les charges non essentielles pour tenir plus longtemps.",
  },
  {
    id: "intrusion",
    label: "Alerte intrusion",
    lit: ["salon", "cuisine", "chambre1", "entree", "terrasse", "chambre2"],
    alert: "entree",
    etat: [
      ["Éclairage", "Toutes les pièces allumées"],
      ["Volets", "Fermés"],
      ["Climatisation", "Inchangée"],
      ["Alimentation", "Réseau"],
      ["Alarme", "Déclenchée dans l’entrée"],
    ],
    note: "Les lumières s’allument, la sirène retentit et le propriétaire reçoit une notification.",
  },
];

export default function MaisonInteractive() {
  const [actif, setActif] = useState(SCENARIOS[0].id);
  const s = SCENARIOS.find((x) => x.id === actif) ?? SCENARIOS[0];

  return (
    <div>
      <svg
        viewBox="0 0 600 400"
        role="img"
        aria-label="Plan d’une maison dont les pièces s’éclairent selon le scénario choisi"
        className="h-auto w-full"
      >
        {ROOMS.map((r) => {
          const lit = s.lit.includes(r.id);
          const alerte = s.alert === r.id;
          return (
            <g key={r.id}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                style={{ fill: lit ? "#F2B01E" : "rgba(255,255,255,0)" }}
                stroke={alerte ? "#FF6B5B" : "#9FB3C8"}
                strokeWidth={alerte ? 5 : 2}
                strokeDasharray={r.outdoor ? "6 6" : undefined}
                className="transition-colors duration-300 motion-reduce:transition-none"
              />
              <text x={r.x + 14} y={r.y + 32} fontSize="18" fontWeight="500" fill={lit ? "#1D3557" : "#DCE6F0"}>
                {r.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choisir un scénario">
        {SCENARIOS.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={x.id === actif}
            onClick={() => setActif(x.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              x.id === actif
                ? "bg-[#F2B01E] text-[#1D3557]"
                : "border border-white/40 text-white hover:bg-white/10"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-5">
        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {s.etat.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-white/15 pb-2 text-sm">
              <dt className="text-[#9FB3C8]">{k}</dt>
              <dd className="text-right text-white">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-base text-white">{s.note}</p>
      </div>
      <p className="mt-3 text-xs text-[#9FB3C8]">Simulation illustrative d’un scénario type.</p>
    </div>
  );
}
