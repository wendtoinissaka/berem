"use client";

import { useEffect, useRef, useState } from "react";
import { BedDouble, Building2, ChevronLeft, ChevronRight, Home, Store, X, ZoomIn } from "lucide-react";
import Photo from "./photo";

type Cat = "Maisons" | "Chambres" | "Appartements" | "Places et commerces";

type Lieu = {
  id: string;
  cat: Cat;
  titre: string;
  description: string;
  equipements: string[];
  /** Chemin d’une vraie photo dans /public, par exemple "/images/domotique/lieux/villa.jpg". Sans photo, un emplacement provisoire s’affiche. */
  src?: string;
};

// À REMPLACER par les vrais projets de l’entreprise (photos, titres, équipements installés).
const LIEUX: Lieu[] = [
  { id: "villa", cat: "Maisons", titre: "Villa familiale connectée", description: "Scénarios jour et nuit, sécurité périmétrique et climatisation pilotée pièce par pièce.", equipements: ["Éclairage", "Volets", "Caméras", "Climatisation"] },
  { id: "solaire", cat: "Maisons", titre: "Maison solaire sans interruption", description: "Bascule automatique entre réseau, batterie et solaire, avec suivi de consommation.", equipements: ["Onduleur", "Batterie", "Délestage", "Compteur"] },
  { id: "parentale", cat: "Chambres", titre: "Chambre parentale", description: "Ambiance lumineuse, volets programmés et climatisation lancée avant le coucher.", equipements: ["Variateurs", "Volets", "Thermostat"] },
  { id: "enfant", cat: "Chambres", titre: "Chambre d’enfant sécurisée", description: "Veilleuse douce, capteur d’ouverture de fenêtre et alerte en cas de fumée.", equipements: ["Veilleuse", "Capteur fenêtre", "Détecteur de fumée"] },
  { id: "t3", cat: "Appartements", titre: "Appartement T3 pilotable", description: "Une seule application pour l’éclairage, les volets, l’accès et la consommation.", equipements: ["Application", "Serrure", "Éclairage", "Volets"] },
  { id: "studio", cat: "Appartements", titre: "Studio en location", description: "Accès par code temporaire pour les occupants et suivi à distance par le propriétaire.", equipements: ["Serrure à code", "Capteurs", "Compteur"] },
  { id: "boutique", cat: "Places et commerces", titre: "Boutique connectée", description: "Éclairage de vitrine programmé, alarme et caméras reliées au téléphone du gérant.", equipements: ["Alarme", "Caméras", "Éclairage"] },
  { id: "place", cat: "Places et commerces", titre: "Place et cour éclairées intelligemment", description: "Éclairage extérieur à la tombée de la nuit, avec renforcement automatique en cas de présence.", equipements: ["Éclairage extérieur", "Détecteurs de présence", "Solaire"] },
];

const CATS: ("Tous" | Cat)[] = ["Tous", "Maisons", "Chambres", "Appartements", "Places et commerces"];
const ICONES = { Maisons: Home, Chambres: BedDouble, Appartements: Building2, "Places et commerces": Store } as const;
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function Galerie() {
  const [filtre, setFiltre] = useState<"Tous" | Cat>("Tous");
  const [ouvert, setOuvert] = useState<number | null>(null);
  const piste = useRef<HTMLUListElement>(null);
  const dialogue = useRef<HTMLDialogElement>(null);

  const liste = filtre === "Tous" ? LIEUX : LIEUX.filter((l) => l.cat === filtre);
  const courant = ouvert !== null ? liste[ouvert] : null;

  useEffect(() => {
    const d = dialogue.current;
    if (!d) return;
    if (ouvert !== null && !d.open) d.showModal();
    if (ouvert === null && d.open) d.close();
  }, [ouvert]);

  const defiler = (sens: 1 | -1) => {
    const p = piste.current;
    if (!p) return;
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    p.scrollBy({ left: sens * p.clientWidth * 0.85, behavior: doux ? "smooth" : "auto" });
  };
  const naviguer = (sens: 1 | -1) => setOuvert((i) => (i === null ? null : (i + sens + liste.length) % liste.length));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type de lieu">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filtre === c}
              onClick={() => {
                setFiltre(c);
                piste.current?.scrollTo({ left: 0 });
              }}
              className={`h-9 rounded-md px-4 text-sm font-medium transition-colors motion-reduce:transition-none ${focus} ${
                filtre === c ? "bg-primary text-primary-foreground" : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => defiler(s)}
              aria-label={s === -1 ? "Voir les lieux précédents" : "Voir les lieux suivants"}
              className={`grid h-9 w-9 place-items-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground ${focus}`}
            >
              {s === -1 ? <ChevronLeft className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      <ul ref={piste} className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4" aria-label="Lieux connectés">
        {liste.map((l, i) => (
          <li key={l.id} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
            <button type="button" onClick={() => setOuvert(i)} aria-label={`Agrandir : ${l.titre}`} className={`block w-full rounded-lg text-left ${focus}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                <Photo src={l.src} alt={l.titre} Icon={ICONES[l.cat]} legende="Photo à ajouter" sizes="(min-width: 1024px) 31vw, 82vw" />
                <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md bg-background/90 text-foreground shadow-sm" aria-hidden="true">
                  <ZoomIn className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{l.cat}</p>
              <p className="font-semibold">{l.titre}</p>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogue}
        onClose={() => setOuvert(null)}
        onClick={(e) => e.target === e.currentTarget && setOuvert(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") naviguer(1);
          if (e.key === "ArrowLeft") naviguer(-1);
        }}
        aria-label={courant?.titre ?? "Aperçu"}
        className="m-auto w-[95vw] max-w-5xl overflow-hidden rounded-lg border bg-background p-0 text-foreground backdrop:bg-black/80"
      >
        {courant && (
          <div>
            <div className="relative aspect-[16/10] max-h-[70vh] w-full bg-muted">
              <Photo src={courant.src} alt={courant.titre} Icon={ICONES[courant.cat]} legende="Photo à ajouter" contain sizes="95vw" />
              <button
                type="button"
                onClick={() => setOuvert(null)}
                aria-label="Fermer"
                className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-md bg-background/90 shadow-sm hover:bg-accent ${focus}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              {(["Précédent", "Suivant"] as const).map((n, k) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => naviguer(k === 0 ? -1 : 1)}
                  aria-label={n}
                  className={`absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md bg-background/90 shadow-sm hover:bg-accent ${focus} ${k === 0 ? "left-3" : "right-3"}`}
                >
                  {k === 0 ? <ChevronLeft className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
                </button>
              ))}
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground">
                {courant.cat}, {ouvert! + 1} sur {liste.length}
              </p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{courant.titre}</h3>
              <p className="mt-2 max-w-2xl text-muted-foreground">{courant.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {courant.equipements.map((e) => (
                  <li key={e} className="rounded-md border bg-secondary px-2.5 py-1 text-sm text-secondary-foreground">{e}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
