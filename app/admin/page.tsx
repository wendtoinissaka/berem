import { Suspense } from "react";
import DashboardContent from "./dashboard-content";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
          Chargement des statistiques du tableau de bord…
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}