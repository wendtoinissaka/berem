export const instant = false;

import { Suspense } from "react";
import DevisContent from "./devis-content";

export default function DevisPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
          Chargement des demandes de devis...
        </div>
      }
    >
      <DevisContent />
    </Suspense>
  );
}