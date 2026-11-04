"use client";

import { useState } from "react";
import Link from "next/link";

const BIENS = ["Villa", "Immeuble", "Boutique ou bureau"] as const;

const FONCTIONS = [
  ["eclairage", "Éclairage et variateurs"],
  ["volets", "Volets motorisés"],
  ["clim", "Climatisation pilotée"],
  ["acces", "Contrôle d’accès et serrures"],
  ["cameras", "Caméras de surveillance"],
  ["alarme", "Alarme et sirène"],
  ["detection", "Détection fumée, gaz et fuite d’eau"],
  ["energie", "Bascule onduleur, solaire et suivi d’énergie"],
  ["eau", "Réservoir, pompe et forage"],
] as const;

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const focusWithin = "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2";

function niveau(n: number) {
  if (n <= 3) return "Essentiel";
  if (n <= 6) return "Confort";
  return "Complet";
}

export default function Configurateur() {
  const [bien, setBien] = useState<(typeof BIENS)[number]>("Villa");
  const [choix, setChoix] = useState<string[]>(["eclairage", "alarme"]);

  const toggle = (id: string) => setChoix((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const labels = FONCTIONS.filter(([id]) => choix.includes(id)).map(([, l]) => l);
  const devis = `/devis?service=domotique&bien=${encodeURIComponent(bien)}&fonctions=${choix.join(",")}`;
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = `Bonjour, je souhaite un devis domotique pour ${bien.toLowerCase()} : ${labels.join(", ")}.`;
  const whatsapp = numero ? `https://wa.me/${numero}?text=${encodeURIComponent(message)}` : null;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-7">
        <fieldset>
          <legend className="mb-3 font-semibold">Type de bien</legend>
          <div className="flex flex-wrap gap-2">
            {BIENS.map((b) => (
              <label
                key={b}
                className={`cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground ${focusWithin}`}
              >
                <input type="radio" name="bien" value={b} checked={bien === b} onChange={() => setBien(b)} className="sr-only" />
                {b}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-semibold">Fonctions souhaitées</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {FONCTIONS.map(([id, label]) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-3 rounded-md border bg-card px-4 py-3 text-sm text-card-foreground hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5 ${focusWithin}`}
              >
                <input type="checkbox" checked={choix.includes(id)} onChange={() => toggle(id)} className="h-4 w-4 accent-primary" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm" aria-live="polite">
          <h3 className="text-xl font-semibold tracking-tight">Votre sélection</h3>
          {choix.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Cochez au moins une fonction pour préparer votre demande.</p>
          ) : (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                {bien}, {choix.length} {choix.length > 1 ? "fonctions" : "fonction"}, niveau{" "}
                <strong className="text-foreground">{niveau(choix.length)}</strong>.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Nous affinons ensuite avec vous selon vos plans, le nombre de pièces et vos priorités. Le chiffrage se fait sur devis.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link href={devis} className={`inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 ${focus}`}>
                  Envoyer ma sélection avec une demande de devis
                </Link>
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${focus}`}>
                    En parler sur WhatsApp
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
