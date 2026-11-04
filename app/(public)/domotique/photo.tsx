"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, type LucideIcon } from "lucide-react";

type Props = {
  src?: string;
  alt: string;
  Icon?: LucideIcon;
  legende?: string;
  contain?: boolean;
  sizes?: string;
};

/**
 * Affiche l’image si elle existe dans /public. Sinon (pas encore ajoutée ou introuvable),
 * affiche un emplacement provisoire. Le parent doit être en `relative` avec une hauteur ou un ratio.
 */
export default function Photo({ src, alt, Icon = ImageIcon, legende = "Image à ajouter", contain, sizes = "(min-width: 1024px) 50vw, 100vw" }: Props) {
  const [erreur, setErreur] = useState(false);

  if (!src || erreur) {
    return (
      <div role="img" aria-label={`Image provisoire : ${alt}`} className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
        <Icon className="h-10 w-10" aria-hidden="true" />
        <span className="px-4 text-center text-sm">{legende}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setErreur(true)}
      className={contain ? "object-contain" : "object-cover"}
    />
  );
}
