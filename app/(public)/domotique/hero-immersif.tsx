"use client";

import { useRef, useState } from "react";
import { AirVent, BatteryCharging, Blinds, Cctv, Droplets, Lightbulb, Lock, LockOpen, Moon, Sun, type LucideIcon } from "lucide-react";

type Id = "lumiere" | "volets" | "clim" | "camera" | "serrure" | "solaire" | "eau";

const DEVICES: { id: Id; nom: string; Icon: LucideIcon; IconOff?: LucideIcon; x: number; y: number; on: string; off: string; utilite: string }[] = [
  { id: "lumiere", nom: "Éclairage", Icon: Lightbulb, x: 275, y: 215, on: "Allumé", off: "Éteint", utilite: "Il s’allume à la tombée de la nuit ou à votre arrivée et s’éteint quand la pièce est vide : fini les lampes oubliées." },
  { id: "volets", nom: "Volets motorisés", Icon: Blinds, x: 245, y: 265, on: "Fermés", off: "Ouverts", utilite: "Ils se ferment le soir et s’ouvrent au lever du jour, ou d’un geste, pour la sécurité, l’intimité et la fraîcheur." },
  { id: "clim", nom: "Climatisation pilotée", Icon: AirVent, x: 545, y: 228, on: "En marche", off: "Arrêtée", utilite: "Elle ne tourne que lorsque la pièce est occupée et se coupe quand une fenêtre est ouverte." },
  { id: "camera", nom: "Caméra de surveillance", Icon: Cctv, x: 655, y: 205, on: "Active", off: "Arrêtée", utilite: "Elle surveille l’extérieur et envoie une alerte sur votre téléphone en cas de mouvement inhabituel." },
  { id: "serrure", nom: "Serrure connectée", Icon: Lock, IconOff: LockOpen, x: 212, y: 378, on: "Verrouillée", off: "Déverrouillée", utilite: "Elle se verrouille seule en partant et s’ouvre pour une personne autorisée, sans clé à confier." },
  { id: "solaire", nom: "Solaire et batterie", Icon: BatteryCharging, x: 540, y: 112, on: "Alimente la maison", off: "Réseau seul", utilite: "Le système choisit la meilleure source d’énergie et bascule seul quand le courant est coupé." },
  { id: "eau", nom: "Réservoir et pompe", Icon: Droplets, x: 730, y: 350, on: "Niveau haut", off: "Niveau bas", utilite: "Le niveau est surveillé, la pompe démarre au bon moment et une alerte prévient en cas de fuite." },
];

const ETOILES = [[60, 40], [140, 90], [230, 30], [330, 70], [450, 35], [560, 60], [760, 30], [700, 120], [90, 150]];

export default function HeroImmersif() {
  const [nuit, setNuit] = useState(true);
  const [sel, setSel] = useState<Id>("lumiere");
  const [touche, setTouche] = useState(false);
  const [on, setOn] = useState<Record<Id, boolean>>({
    lumiere: true, volets: false, clim: false, camera: true, serrure: true, solaire: true, eau: true,
  });
  const scene = useRef<HTMLDivElement>(null);

  const agir = (id: Id) => {
    setOn((p) => ({ ...p, [id]: !p[id] }));
    setSel(id);
    setTouche(true);
  };
  const suivre = (e: React.PointerEvent) => {
    const r = scene.current?.getBoundingClientRect();
    if (!r) return;
    scene.current?.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    scene.current?.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const d = DEVICES.find((x) => x.id === sel)!;
  const SelIcon = !on[d.id] && d.IconOff ? d.IconOff : d.Icon;
  const lumiere = on.lumiere ? (nuit ? 0.9 : 0.3) : 0;
  // La scène a sa propre palette (jour/nuit) pour rester lisible quel que soit le thème du site.
  const c = nuit
    ? { ciel: "fill-slate-900", sol: "fill-slate-950", toit: "fill-slate-600", mur: "fill-slate-800", vitre: "fill-slate-950", astre: "fill-slate-200" }
    : { ciel: "fill-sky-300", sol: "fill-stone-400", toit: "fill-slate-500", mur: "fill-stone-100", vitre: "fill-sky-200", astre: "fill-amber-300" };
  const t = "transition-[fill,opacity] duration-300 motion-reduce:transition-none";

  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Entrez dans une maison qui vous répond.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Touchez les icônes pour commander la maison, puis passez du jour à la nuit. C’est la domotique que nous
              préparons dès le chantier.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={nuit}
            onClick={() => setNuit((n) => !n)}
            className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:self-auto"
          >
            {nuit ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
            {nuit ? "Nuit" : "Jour"}
          </button>
        </div>

        <div ref={scene} onPointerMove={suivre} className="relative mt-8 aspect-[8/5] w-full overflow-hidden rounded-lg border">
          <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" role="img" aria-label="Maison en coupe dont les équipements réagissent à vos commandes">
            <rect width="800" height="500" className={`${c.ciel} ${t}`} />
            {nuit && ETOILES.map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.6" className="fill-slate-200" />)}
            <circle cx="690" cy="70" r="26" className={`${c.astre} ${t}`} />
            <rect y="420" width="800" height="80" className={`${c.sol} ${t}`} />

            <polygon points="130,190 400,95 670,190" className={`${c.toit} stroke-slate-400 ${t}`} strokeWidth="2" />
            <g transform="rotate(19.4 540 144)">
              <rect x="470" y="126" width="140" height="14" className={`${on.solaire ? "fill-amber-400" : "fill-slate-500"} ${t}`} />
            </g>
            <rect x="150" y="190" width="500" height="230" className={`${c.mur} stroke-slate-400 ${t}`} strokeWidth="2" />
            <line x1="400" y1="190" x2="400" y2="420" className="stroke-slate-400" strokeWidth="2" />
            <rect x="150" y="190" width="250" height="230" className={`fill-amber-300 ${t}`} style={{ opacity: lumiere }} />
            <rect x="400" y="190" width="250" height="230" className={`fill-amber-300 ${t}`} style={{ opacity: lumiere * 0.6 }} />

            {[190, 440].map((x) => (
              <g key={x}>
                <rect x={x} y="225" width="110" height="80" className={`${c.vitre} stroke-slate-400 ${t}`} strokeWidth="2" />
                <rect x={x} y="225" width="110" style={{ height: on.volets ? 80 : 0 }} className="fill-slate-500 transition-[height] duration-500 motion-reduce:transition-none" />
              </g>
            ))}
            <rect x="300" y="385" width="80" height="35" className="fill-slate-400/60" />
            <rect x="440" y="385" width="150" height="35" className="fill-slate-400/60" />
            <rect x="170" y="330" width="50" height="90" className="fill-slate-600 stroke-slate-400" strokeWidth="2" />
            <circle cx="212" cy="378" r="4" className={on.serrure ? "fill-emerald-400" : "fill-red-400"} />

            <rect x="500" y="215" width="90" height="26" rx="4" className="fill-slate-200" />
            {on.clim && (
              <g className="stroke-sky-300" strokeWidth="2" fill="none" strokeLinecap="round">
                <path d="M515 252 q8 8 0 16" /><path d="M545 252 q8 8 0 16" /><path d="M575 252 q8 8 0 16" />
              </g>
            )}

            <polygon points="650,205 745,165 745,255" className={`fill-amber-300 ${t}`} style={{ opacity: on.camera ? 0.25 : 0 }} />
            <rect x="640" y="198" width="18" height="10" rx="2" className="fill-slate-200" />

            <rect x="700" y="300" width="60" height="120" className="fill-none stroke-slate-400" strokeWidth="2" />
            <rect x="702" width="56" style={{ y: on.eau ? 318 : 380, height: on.eau ? 100 : 38 }} className="fill-sky-500 transition-all duration-500 motion-reduce:transition-none" />
          </svg>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${nuit ? "opacity-100" : "opacity-0"}`}
            style={{ background: "radial-gradient(circle 150px at var(--mx, 50%) var(--my, 50%), rgba(251,191,36,0.22), transparent 70%)" }}
          />

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
                className={`absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border shadow-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  on[x.id] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {!touche && <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-primary motion-safe:animate-ping" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-12" aria-live="polite">
          <div className="flex gap-4 md:col-span-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <SelIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">{d.nom}</h2>
              <p className="text-sm font-medium text-primary">{on[d.id] ? d.on : d.off}</p>
              <p className="mt-2 max-w-lg text-muted-foreground">{d.utilite}</p>
            </div>
          </div>
          <ul className="grid gap-x-6 text-sm sm:grid-cols-2 md:col-span-6">
            {DEVICES.map((x) => (
              <li key={x.id} className="flex justify-between gap-3 border-b py-1.5">
                <span className="text-muted-foreground">{x.nom}</span>
                <span className="font-medium">{on[x.id] ? x.on : x.off}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Simulation illustrative.</p>
      </div>
    </section>
  );
}
