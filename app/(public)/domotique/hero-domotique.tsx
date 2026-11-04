"use client";

import { useRef, useState } from "react";
import { AirVent, BatteryCharging, Bell, Blinds, Cctv, Clock, Droplets, Lightbulb, Lock, LockOpen, PlugZap, type LucideIcon } from "lucide-react";
import Bouton from "./bouton";

type Id = "lumiere" | "volets" | "clim" | "camera" | "serrure" | "solaire" | "eau";
type Etat = Record<Id, boolean>;
type Phase = "nuit" | "crepuscule" | "jour";

const DEVICES: { id: Id; nom: string; Icon: LucideIcon; IconOff?: LucideIcon; x: number; y: number; poids: number; on: string; off: string; utilite: string }[] = [
  { id: "lumiere", nom: "Éclairage", Icon: Lightbulb, x: 275, y: 215, poids: 2, on: "Allumé", off: "Éteint", utilite: "Il s’allume à la tombée de la nuit ou à votre arrivée et s’éteint quand la pièce est vide : fini les lampes oubliées." },
  { id: "volets", nom: "Volets motorisés", Icon: Blinds, x: 245, y: 265, poids: 1, on: "Fermés", off: "Ouverts", utilite: "Ils se ferment le soir et s’ouvrent au lever du jour, ou d’un geste, pour la sécurité, l’intimité et la fraîcheur." },
  { id: "clim", nom: "Climatisation pilotée", Icon: AirVent, x: 545, y: 228, poids: 5, on: "En marche", off: "Arrêtée", utilite: "Elle ne tourne que lorsque la pièce est occupée et se coupe quand une fenêtre est ouverte." },
  { id: "camera", nom: "Caméra de surveillance", Icon: Cctv, x: 655, y: 205, poids: 1, on: "Active", off: "Arrêtée", utilite: "Elle surveille l’extérieur et envoie une alerte sur votre téléphone en cas de mouvement inhabituel." },
  { id: "serrure", nom: "Serrure connectée", Icon: Lock, IconOff: LockOpen, x: 212, y: 378, poids: 0, on: "Verrouillée", off: "Déverrouillée", utilite: "Elle se verrouille seule en partant et s’ouvre pour une personne autorisée, sans clé à confier." },
  { id: "solaire", nom: "Solaire et batterie", Icon: BatteryCharging, x: 540, y: 112, poids: 0, on: "Alimente la maison", off: "Réseau seul", utilite: "Le système choisit la meilleure source d’énergie et bascule seul quand le courant est coupé." },
  { id: "eau", nom: "Réservoir et pompe", Icon: Droplets, x: 730, y: 350, poids: 2, on: "Niveau haut", off: "Niveau bas", utilite: "Le niveau est surveillé, la pompe démarre au bon moment et une alerte prévient en cas de fuite." },
];

const SCENARIOS: { id: string; label: string; heure: number; reseau: boolean; alerte: boolean; on: Etat; note: string }[] = [
  { id: "soiree", label: "Soirée", heure: 20, reseau: true, alerte: false, on: { lumiere: true, volets: false, clim: true, camera: true, serrure: true, solaire: true, eau: true }, note: "Ambiance, fraîcheur et sécurité réglées d’un seul geste." },
  { id: "depart", label: "Je pars", heure: 9, reseau: true, alerte: false, on: { lumiere: false, volets: true, clim: false, camera: true, serrure: true, solaire: true, eau: true }, note: "Tout s’éteint, se ferme et se verrouille en quittant la maison." },
  { id: "nuit", label: "Nuit", heure: 23, reseau: true, alerte: false, on: { lumiere: false, volets: true, clim: true, camera: true, serrure: true, solaire: true, eau: true }, note: "La maison se met au repos et reste sous surveillance." },
  { id: "coupure", label: "Coupure d’électricité", heure: 21, reseau: false, alerte: false, on: { lumiere: true, volets: false, clim: false, camera: true, serrure: true, solaire: true, eau: false }, note: "Bascule sur batterie et solaire : la climatisation est délestée, l’essentiel reste actif." },
  { id: "intrusion", label: "Alerte intrusion", heure: 2, reseau: true, alerte: true, on: { lumiere: true, volets: true, clim: false, camera: true, serrure: true, solaire: true, eau: true }, note: "Lumières allumées, sirène déclenchée et notification envoyée sur votre téléphone." },
];

const PALETTE: Record<Phase, Record<"ciel" | "sol" | "toit" | "mur" | "vitre" | "astre" | "trait", string>> = {
  nuit: { ciel: "#182436", sol: "#0B111A", toit: "#26364A", mur: "#1B2A3D", vitre: "#0B111A", astre: "#E9EDF2", trait: "#647084" },
  crepuscule: { ciel: "#3A4A66", sol: "#1B2636", toit: "#2E405A", mur: "#26364A", vitre: "#2A3650", astre: "#D59344", trait: "#8A97AB" },
  jour: { ciel: "#DCE6F0", sol: "#E8CBA8", toit: "#26364A", mur: "#FBF7F1", vitre: "#BFD4E6", astre: "#D59344", trait: "#647084" },
};

const ETOILES = [[60, 40], [140, 90], [230, 30], [330, 70], [450, 35], [560, 60], [760, 30], [700, 120], [90, 150]];
const CONSO_MAX = DEVICES.reduce((s, d) => s + d.poids, 0);
const phaseDe = (h: number): Phase => (h < 5 || h >= 20 ? "nuit" : h < 7 || h >= 18 ? "crepuscule" : "jour");
const borne = (v: number) => Math.max(-1, Math.min(1, v));
const fondu = { transition: "fill 700ms ease" } as const;

export default function HeroDomotique() {
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const [heure, setHeure] = useState(20);
  const [on, setOn] = useState<Etat>(SCENARIOS[0].on);
  const [reseau, setReseau] = useState(true);
  const [alerte, setAlerte] = useState(false);
  const [sc, setSc] = useState<string | null>("soiree");
  const [sel, setSel] = useState<Id>("lumiere");
  const [touche, setTouche] = useState(false);

  const phase = phaseDe(heure);
  const P = PALETTE[phase];
  const d = DEVICES.find((x) => x.id === sel)!;
  const SelIcon = !on[d.id] && d.IconOff ? d.IconOff : d.Icon;
  const lumiere = on.lumiere ? (phase === "jour" ? 0.22 : phase === "crepuscule" ? 0.6 : 0.9) : 0;
  const conso = Math.round((DEVICES.reduce((s, x) => s + (on[x.id] ? x.poids : 0), 0) / CONSO_MAX) * 100);
  const niveauConso = conso < 35 ? "Faible" : conso < 70 ? "Modérée" : "Élevée";
  const scenario = SCENARIOS.find((s) => s.id === sc);
  const astreX = 60 + (heure / 23) * 680;
  const astreY = 250 - 190 * Math.sin((Math.PI * heure) / 23);

  const appliquer = (s: (typeof SCENARIOS)[number]) => {
    setHeure(s.heure);
    setOn(s.on);
    setReseau(s.reseau);
    setAlerte(s.alerte);
    setSc(s.id);
    setTouche(true);
  };
  const agir = (id: Id) => {
    setOn((p) => ({ ...p, [id]: !p[id] }));
    setSel(id);
    setSc(null);
    setAlerte(false);
    setTouche(true);
  };

  const suivre = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const hero = heroRef.current;
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--pointer-x", `${e.clientX - r.left}px`);
    hero.style.setProperty("--pointer-y", `${e.clientY - r.top}px`);
    const s = sceneRef.current;
    if (s) {
      const q = s.getBoundingClientRect();
      s.style.setProperty("--tx", `${(-borne((e.clientY - (q.top + q.height / 2)) / q.height) * 4).toFixed(2)}deg`);
      s.style.setProperty("--ty", `${(borne((e.clientX - (q.left + q.width / 2)) / q.width) * 4).toFixed(2)}deg`);
    }
  };
  const reinitialiser = () => {
    const hero = heroRef.current;
    hero?.style.setProperty("--pointer-x", "70%");
    hero?.style.setProperty("--pointer-y", "40%");
    sceneRef.current?.style.setProperty("--tx", "0deg");
    sceneRef.current?.style.setProperty("--ty", "0deg");
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={suivre}
      onPointerLeave={reinitialiser}
      className="berem-hero relative isolate overflow-hidden bg-[#10161F] text-white"
    >
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#10161F_0%,rgba(16,22,31,0.92)_45%,rgba(38,54,74,0.55)_100%)]" />
      <div aria-hidden="true" className="berem-hero__spotlight" />
      <div aria-hidden="true" className="berem-hero__noise" />
      <div aria-hidden="true" className="berem-hero__grid"><span /><span /><span /><span /><span /></div>
      <div aria-hidden="true" className="berem-hero__technical">
        <div className="berem-hero__technical-circle"><span /><span /><span /></div>
        <div className="berem-hero__technical-cross berem-cross-one" />
        <div className="berem-hero__technical-cross berem-cross-two" />
      </div>

      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-5 pb-28 pt-32 sm:px-8 lg:min-h-[900px] lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-10 lg:px-16 xl:px-24">
        {/* TEXTE */}
        <div className="relative z-10">
          <div className="berem-hero__intro flex items-center gap-4">
            <span className="berem-hero__eyebrow-line" />
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#E6B36F] sm:text-xs">BEREM - Domotique & bâtiment connecté</span>
            <span className="berem-hero__eyebrow-dot" />
          </div>

          <h1 className="berem-hero__title mt-8" style={{ fontSize: "clamp(2.6rem, 5.4vw, 5.6rem)" }}>
            <span className="berem-title-line"><span>Connecter</span><span className="berem-title-period">.</span></span>
            <span className="berem-title-line berem-title-line--accent"><span>Sécuriser</span><span className="berem-title-period">.</span></span>
            <span className="berem-title-line"><span>Simplifier</span><span className="berem-title-period">.</span></span>
          </h1>

          <div className="berem-hero__description mt-8 flex max-w-xl items-start gap-5">
            <span className="mt-1 hidden h-[66px] w-[2px] shrink-0 bg-[#D59344] sm:block" />
            <p className="text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Une maison qui vous répond, câblée dès le chantier. Touchez les équipements, changez l’heure ou lancez un
              scénario : la maison réagit en direct.
            </p>
          </div>

          <div className="berem-hero__actions mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Bouton href="/devis?service=domotique">Parlons de votre projet</Bouton>
            <Bouton href="#domotique-composants" variante="secondary">Découvrir les composants</Bouton>
          </div>
        </div>

        {/* MAISON INTERACTIVE */}
        <div
          ref={sceneRef}
          className="relative z-10 rounded-sm border border-white/15 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm motion-reduce:!transform-none"
          style={{ transform: "perspective(1400px) rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg))", transition: "transform 250ms ease-out" }}
        >
          <div className="relative aspect-[8/5] w-full overflow-hidden">
            <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" role="img" aria-label="Maison en coupe dont les équipements réagissent à vos commandes">
              <rect width="800" height="500" style={{ ...fondu, fill: P.ciel }} />
              {phase === "nuit" && ETOILES.map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.6" fill="#E9EDF2" />)}
              <circle cx={astreX} cy={astreY} r="26" style={{ ...fondu, fill: P.astre }} />
              <rect y="420" width="800" height="80" style={{ ...fondu, fill: P.sol }} />

              <polygon points="130,190 400,95 670,190" strokeWidth="2" style={{ ...fondu, fill: P.toit, stroke: P.trait }} />
              <g transform="rotate(19.4 540 144)">
                <rect x="470" y="126" width="140" height="14" style={{ ...fondu, fill: on.solaire ? "#D59344" : "#647084" }} />
              </g>
              <rect x="150" y="190" width="500" height="230" strokeWidth="2" style={{ ...fondu, fill: P.mur, stroke: P.trait }} />
              <line x1="400" y1="190" x2="400" y2="420" strokeWidth="2" style={{ stroke: P.trait }} />
              <rect x="150" y="190" width="250" height="230" fill="#F0B866" style={{ opacity: lumiere, transition: "opacity 400ms ease" }} />
              <rect x="400" y="190" width="250" height="230" fill="#F0B866" style={{ opacity: lumiere * 0.6, transition: "opacity 400ms ease" }} />

              {[190, 440].map((x) => (
                <g key={x}>
                  <rect x={x} y="225" width="110" height="80" strokeWidth="2" style={{ ...fondu, fill: P.vitre, stroke: P.trait }} />
                  <rect x={x} y="225" width="110" fill="#647084" style={{ height: on.volets ? 80 : 0, transition: "height 500ms ease" }} />
                </g>
              ))}
              <rect x="300" y="385" width="80" height="35" fill="#647084" opacity="0.5" />
              <rect x="440" y="385" width="150" height="35" fill="#647084" opacity="0.5" />
              <rect x="170" y="330" width="50" height="90" strokeWidth="2" style={{ fill: P.toit, stroke: alerte ? "#BD4545" : P.trait }} className={alerte ? "motion-safe:animate-pulse" : ""} />
              <circle cx="212" cy="378" r="4" fill={on.serrure ? "#278052" : "#BD4545"} />

              <rect x="500" y="215" width="90" height="26" rx="3" fill="#E9EDF2" />
              {on.clim && (
                <g stroke="#9FC3E0" strokeWidth="2" fill="none" strokeLinecap="round">
                  <path d="M515 252 q8 8 0 16" /><path d="M545 252 q8 8 0 16" /><path d="M575 252 q8 8 0 16" />
                </g>
              )}

              <polygon points="650,205 745,165 745,255" style={{ fill: alerte ? "#BD4545" : "#D59344", opacity: on.camera ? 0.28 : 0, transition: "opacity 300ms ease" }} />
              <rect x="640" y="198" width="18" height="10" rx="2" fill="#E9EDF2" />

              <rect x="700" y="300" width="60" height="120" fill="none" strokeWidth="2" style={{ stroke: P.trait }} />
              <rect x="702" width="56" fill="#5B93BD" style={{ y: on.eau ? 318 : 380, height: on.eau ? 100 : 38, transition: "all 500ms ease" }} />
            </svg>

            {alerte && (
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-sm bg-[#BD4545] px-3 py-2 text-xs font-bold text-white shadow-lg">
                <Bell className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" /> Notification envoyée sur votre téléphone
              </div>
            )}

            {DEVICES.map((x) => {
              const Icon = !on[x.id] && x.IconOff ? x.IconOff : x.Icon;
              return (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={on[x.id]}
                  aria-label={`${x.nom} : ${on[x.id] ? x.on : x.off}`}
                  onClick={() => agir(x.id)}
                  style={{ left: `${x.x / 8}%`, top: `${x.y / 5}%` }}
                  className={`group absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border backdrop-blur transition-all duration-300 hover:scale-110 motion-reduce:transition-none ${
                    on[x.id] ? "border-[#D59344] bg-[#D59344] text-[#10161F]" : "border-white/40 bg-[#10161F]/70 text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                  {!touche && <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-[#D59344] motion-safe:animate-ping" />}
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#10161F] px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {x.nom}
                  </span>
                </button>
              );
            })}
          </div>

          {/* COMMANDES */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 p-4 sm:px-5">
            <label className="flex items-center gap-3 text-xs font-bold text-white/80">
              <Clock className="h-4 w-4 text-[#E6B36F]" aria-hidden="true" />
              <span className="w-12">{heure} h</span>
              <input
                type="range" min={0} max={23} value={heure}
                onChange={(e) => { setHeure(Number(e.target.value)); setSc(null); setAlerte(false); setTouche(true); }}
                aria-label="Heure de la journée" className="w-36 accent-[#D59344] sm:w-44"
              />
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Scénarios">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id} type="button" aria-pressed={sc === s.id} onClick={() => appliquer(s)}
                  className={`border px-3 py-1.5 text-xs font-bold transition-colors motion-reduce:transition-none ${
                    sc === s.id ? "border-[#D59344] bg-[#D59344] text-[#10161F]" : "border-white/25 text-white hover:border-[#D59344] hover:text-[#E6B36F]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ÉTAT EN DIRECT */}
          <div className="grid gap-5 border-t border-white/10 p-4 sm:px-5 md:grid-cols-2" aria-live="polite">
            <div className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#D59344]/40 bg-[#D59344]/10 text-[#E6B36F]">
                <SelIcon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-black">{d.nom} <span className="font-bold text-[#E6B36F]">· {on[d.id] ? d.on : d.off}</span></p>
                <p className="mt-1 text-xs leading-6 text-white/65">{d.utilite}</p>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-white/60"><PlugZap className="h-4 w-4" aria-hidden="true" /> Source d’énergie</span>
                <span className={`font-bold ${reseau ? "text-white" : "text-[#E6B36F]"}`}>{reseau ? "Réseau" : "Batterie et solaire"}</span>
              </div>
              <div>
                <div className="flex justify-between"><span className="text-white/60">Consommation</span><span className="font-bold">{niveauConso}</span></div>
                <div className="mt-1.5 h-1.5 bg-white/10"><div className="h-full bg-[#D59344] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${Math.max(conso, 4)}%` }} /></div>
              </div>
              {scenario && <p className="leading-6 text-white/75">{scenario.note}</p>}
            </div>
          </div>
          <p className="px-5 pb-3 text-[10px] text-white/40">Simulation illustrative.</p>
        </div>

        <a href="#domotique-importance" aria-label="Défiler vers la suite de la page" className="berem-hero__scroll absolute bottom-10 left-5 hidden items-center gap-4 sm:left-8 md:inline-flex lg:left-16 xl:left-24">
          <span className="berem-scroll-circle"><span /></span>
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/65">Explorer</span>
        </a>
      </div>

      <div className="berem-hero__progress"><span /></div>
    </section>
  );
}
