"use client";

import { useState } from "react";
import { Camera, Cpu, Droplets, Radio, SlidersHorizontal, Thermometer, ToggleRight, Zap, type LucideIcon } from "lucide-react";
import Photo from "./photo";

type Composant = {
  id: string;
  nom: string;
  Icon: LucideIcon;
  /** Déposez la photo dans /public avec ce nom (JPG ou WebP). Tant qu’elle est absente, un emplacement provisoire s’affiche. */
  image: string;
  quoi: string;
  utilite: string;
  exemple: string;
};

const DOSSIER = "/images/domotique/composants";

const COMPOSANTS: Composant[] = [
  {
    id: "cerveau", nom: "Serveur local", Icon: Cpu, image: `${DOSSIER}/serveur-local.png`,
    quoi: "Le cerveau de la maison : il reçoit les informations des capteurs et commande tous les équipements.",
    utilite: "Il fait tourner les scénarios même sans internet et réunit tout dans une seule application.",
    exemple: "Vous appuyez sur « Je pars » : il éteint les lumières, ferme les volets et arme l’alarme.",
  },
  {
    id: "capteurs", nom: "Capteurs", Icon: Radio, image: `${DOSSIER}/capteurs.png`,
    quoi: "De petits détecteurs de mouvement, d’ouverture de porte, de température, de fumée, de gaz et de fuite d’eau.",
    utilite: "Ils observent ce qui se passe dans le bâtiment pour déclencher la bonne réaction au bon moment.",
    exemple: "Une fuite sous l’évier coupe l’arrivée d’eau et vous alerte aussitôt.",
  },
  {
    id: "modules", nom: "Modules et variateurs", Icon: ToggleRight, image: `${DOSSIER}/modules-variateurs.png`,
    quoi: "Des relais, variateurs et moteurs cachés derrière vos interrupteurs, vos lampes et vos volets.",
    utilite: "Ils rendent l’éclairage et les volets pilotables à distance et programmables.",
    exemple: "Les volets se ferment à la tombée de la nuit et s’ouvrent au lever du jour.",
  },
  {
    id: "commandes", nom: "Interrupteurs et tableaux tactiles", Icon: SlidersHorizontal, image: `${DOSSIER}/commandes-tactiles.jpg`,
    quoi: "Des commandes murales, des écrans tactiles et l’application mobile.",
    utilite: "Ils donnent à chacun, y compris aux invités, un moyen simple de piloter la maison.",
    exemple: "Un bouton « Soirée » à l’entrée du salon règle lumières, volets et climatisation.",
  },
  {
    id: "securite", nom: "Caméras et serrures", Icon: Camera, image: `${DOSSIER}/cameras-serrures.jpg`,
    quoi: "Des caméras intérieures et extérieures, des serrures et lecteurs d’accès connectés.",
    utilite: "Ils protègent le bâtiment et gèrent qui peut entrer, et quand.",
    exemple: "Vous ouvrez à distance pour un livreur, puis la porte se verrouille seule.",
  },
  {
    id: "energie", nom: "Onduleur, batterie et compteur", Icon: Zap, image: `${DOSSIER}/onduleur-batterie.jpg`,
    quoi: "Des équipements qui produisent, stockent et mesurent l’énergie, avec un délesteur qui coupe les charges non essentielles.",
    utilite: "Ils assurent la continuité lors des coupures et montrent où va l’électricité.",
    exemple: "Au moment d’une coupure, la maison bascule sur batterie et garde l’éclairage et le réfrigérateur.",
  },
  {
    id: "eau", nom: "Capteur de niveau et électrovanne", Icon: Droplets, image: `${DOSSIER}/niveau-eau-vanne.jpg`,
    quoi: "Un capteur dans le réservoir, un relais de pompe et une vanne pilotable.",
    utilite: "Ils évitent les manques d’eau, les débordements et les fuites qui passent inaperçues.",
    exemple: "La pompe démarre quand le réservoir est bas et s’arrête avant qu’il déborde.",
  },
  {
    id: "clim", nom: "Thermostat et commande de clim", Icon: Thermometer, image: `${DOSSIER}/thermostat-clim.jpg`,
    quoi: "Des sondes de température et des interfaces qui pilotent les climatiseurs.",
    utilite: "Elles gardent une température agréable en évitant de refroidir une pièce vide.",
    exemple: "La chambre est rafraîchie quelques minutes avant l’heure du coucher.",
  },
];

export default function Composants() {
  const [id, setId] = useState(COMPOSANTS[0].id);
  const c = COMPOSANTS.find((x) => x.id === id) ?? COMPOSANTS[0];

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div role="tablist" aria-label="Composants domotiques" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0">
        {COMPOSANTS.map(({ id: cid, nom, Icon }) => (
          <button
            key={cid}
            id={`tab-${cid}`}
            role="tab"
            type="button"
            aria-selected={cid === id}
            aria-controls="composant-detail"
            onClick={() => setId(cid)}
            className={`flex shrink-0 items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              cid === id ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {nom}
          </button>
        ))}
      </div>

      <div id="composant-detail" role="tabpanel" aria-labelledby={`tab-${c.id}`} className="overflow-hidden rounded-lg border bg-card text-card-foreground lg:col-span-8">
        <div className="relative aspect-[16/9] border-b">
          <Photo key={c.id} src={c.image} alt={c.nom} Icon={c.Icon} legende={`Photo « ${c.nom} » à ajouter`} />
        </div>
        <div className="p-6 lg:p-8">
          <h3 className="text-2xl font-semibold tracking-tight">{c.nom}</h3>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="font-semibold">Ce que c’est</dt>
              <dd className="mt-1 max-w-xl text-muted-foreground">{c.quoi}</dd>
            </div>
            <div>
              <dt className="font-semibold">À quoi ça sert</dt>
              <dd className="mt-1 max-w-xl text-muted-foreground">{c.utilite}</dd>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <dt className="font-semibold">Exemple concret</dt>
              <dd className="mt-1 max-w-xl text-muted-foreground">{c.exemple}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
