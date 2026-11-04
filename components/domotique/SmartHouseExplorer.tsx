"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Lightbulb,
  Thermometer,
  ShieldCheck,
  DoorOpen,
  Droplets,
  Sun,
  Camera,
} from "lucide-react";
import Link from "next/link";

const rooms = [
  {
    id: "salon",
    name: "Salon",
    number: "01",
    title: "Un confort qui s'adapte à vous.",
    description:
      "Pilotez votre éclairage, votre climatisation et vos équipements depuis une interface centralisée.",
    features: [
      { name: "Éclairage intelligent", icon: Lightbulb },
      { name: "Climatisation connectée", icon: Thermometer },
      { name: "Scénarios personnalisés", icon: Sun },
    ],
  },
  {
    id: "chambre",
    name: "Chambre",
    number: "02",
    title: "Un environnement pensé pour votre bien-être.",
    description:
      "Programmez votre ambiance lumineuse et votre température pour profiter d'un espace adapté à vos habitudes.",
    features: [
      { name: "Éclairage programmable", icon: Lightbulb },
      { name: "Régulation thermique", icon: Thermometer },
      { name: "Commandes centralisées", icon: Sun },
    ],
  },
  {
    id: "cuisine",
    name: "Cuisine",
    number: "03",
    title: "Une maison qui veille sur vos installations.",
    description:
      "Des capteurs peuvent surveiller certains risques domestiques et déclencher des alertes en cas d'anomalie.",
    features: [
      { name: "Détection de fuite d'eau", icon: Droplets },
      { name: "Détection de fumée", icon: ShieldCheck },
      { name: "Surveillance technique", icon: Camera },
    ],
  },
  {
    id: "entree",
    name: "Entrée",
    number: "04",
    title: "Gardez le contrôle de vos accès.",
    description:
      "Modernisez les accès de votre habitation grâce à des solutions de contrôle et de surveillance connectées.",
    features: [
      { name: "Serrure connectée", icon: DoorOpen },
      { name: "Interphone vidéo", icon: Camera },
      { name: "Contrôle d'accès", icon: ShieldCheck },
    ],
  },
  {
    id: "exterieur",
    name: "Extérieur",
    number: "05",
    title: "L'intelligence continue à l'extérieur.",
    description:
      "Automatisez vos accès et adaptez l'éclairage extérieur selon les horaires ou la détection de présence.",
    features: [
      { name: "Portail motorisé", icon: DoorOpen },
      { name: "Éclairage automatique", icon: Lightbulb },
      { name: "Vidéosurveillance", icon: Camera },
    ],
  },
];

export default function SmartHouseExplorer() {
  const [activeRoom, setActiveRoom] = useState("salon");

  const selectedRoom =
    rooms.find((room) => room.id === activeRoom) ?? rooms[0];

  return (
    <section
      id="solutions-domotiques"
      className="bg-[#FBF7F1] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* INTRODUCTION */}
        <div className="mb-14 max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-9 bg-berem-orange" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-berem-orange">
              Explorez les possibilités
            </span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-berem-primary sm:text-5xl">
            Une maison qui comprend
            <span className="text-berem-orange"> vos besoins.</span>
          </h2>

          <p className="mt-6 text-base leading-8 text-berem-muted">
            Chaque espace peut bénéficier de fonctionnalités intelligentes.
            Sélectionnez une pièce pour découvrir comment la technologie peut
            transformer votre quotidien.
          </p>
        </div>

        {/* EXPLORATEUR */}
        <div className="grid overflow-hidden rounded-3xl border border-berem-border bg-white lg:grid-cols-[1.05fr_0.95fr]">
          {/* VISUEL MAISON */}
          <div className="relative min-h-[420px] overflow-hidden bg-[#172331] lg:min-h-[580px]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-75 transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#10161F]/90 via-transparent to-[#10161F]/10" />

            <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-[#10161F]/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">
              Maison intelligente
            </div>

            {/* POINTS INTERACTIFS */}
            {[
              { id: "salon", top: "53%", left: "47%" },
              { id: "chambre", top: "28%", left: "70%" },
              { id: "cuisine", top: "55%", left: "77%" },
              { id: "entree", top: "72%", left: "35%" },
              { id: "exterieur", top: "83%", left: "75%" },
            ].map((point) => (
              <button
                key={point.id}
                type="button"
                aria-label={`Découvrir ${rooms.find((room) => room.id === point.id)?.name}`}
                aria-pressed={activeRoom === point.id}
                onClick={() => setActiveRoom(point.id)}
                style={{ top: point.top, left: point.left }}
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <span
                  className={`absolute h-12 w-12 rounded-full ${
                    activeRoom === point.id
                      ? "animate-ping bg-berem-orange/50"
                      : "bg-white/30"
                  }`}
                />
                <span
                  className={`relative h-4 w-4 rounded-full border-[3px] border-white shadow-lg transition-all ${
                    activeRoom === point.id
                      ? "scale-125 bg-berem-orange"
                      : "bg-white group-hover:scale-125 group-hover:bg-berem-orange"
                  }`}
                />
              </button>
            ))}

            <div className="absolute bottom-7 left-7 right-7 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-berem-orange">
                L'intelligence dans chaque espace
              </p>
              <p className="mt-2 max-w-sm text-xl font-bold">
                Une technologie discrète. Une expérience remarquable.
              </p>
            </div>
          </div>

          {/* INFORMATIONS */}
          <div className="flex flex-col p-6 sm:p-10 lg:p-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-berem-orange">
                Espace sélectionné · {selectedRoom.number}
              </p>

              <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-berem-primary">
                {selectedRoom.name}
              </h3>

              <h4 className="mt-6 text-xl font-bold leading-snug text-berem-primary">
                {selectedRoom.title}
              </h4>

              <p className="mt-4 text-sm leading-7 text-berem-muted">
                {selectedRoom.description}
              </p>
            </div>

            <div className="my-8 border-t border-berem-border" />

            <p className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-berem-muted">
              Fonctionnalités possibles
            </p>

            <div className="space-y-3">
              {selectedRoom.features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.name}
                    className="flex items-center gap-4 rounded-xl bg-[#FBF7F1] px-4 py-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-berem-orange">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <span className="text-sm font-semibold text-berem-primary">
                      {feature.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/devis"
                className="inline-flex items-center gap-3 text-sm font-bold text-berem-primary transition-colors hover:text-berem-orange"
              >
                Étudier cette installation
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* NAVIGATION DES PIÈCES */}
        <div className="mt-6 flex flex-wrap gap-3">
          {rooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => setActiveRoom(room.id)}
              aria-pressed={activeRoom === room.id}
              className={`rounded-full border px-5 py-3 text-sm font-semibold transition-all ${
                activeRoom === room.id
                  ? "border-berem-orange bg-berem-orange text-berem-primary"
                  : "border-berem-border bg-white text-berem-muted hover:border-berem-orange hover:text-berem-primary"
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs leading-6 text-berem-muted">
          Les fonctionnalités présentées sont des exemples de possibilités.
          Leur disponibilité dépend de l'étude technique et de la configuration
          retenue pour chaque projet.
        </p>
      </div>
    </section>
  );
}