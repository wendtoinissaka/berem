import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  deleteAnnouncement,
  toggleAnnouncementPublication,
} from "./actions";

const typeLabels: Record<string, string> = {
  GENERAL: "Information",
  NEWS: "Actualité",
  BLOG: "Blog",
  PROJECT: "Projet",
  CONSTRUCTION: "Chantier",
  REAL_ESTATE: "Immobilier",
  DOMOTICS: "Domotique",
  PROMOTION: "Promotion",
};

function formatDate(date: Date | null) {
  if (!date) return "Non définie";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(date);
}

function isCurrentlyActive(
  announcement: {
    isPublished: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
  },
) {
  const now = new Date();

  return (
    announcement.isPublished &&
    (!announcement.startsAt || announcement.startsAt <= now) &&
    (!announcement.endsAt || announcement.endsAt >= now)
  );
}

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [
      { priority: "desc" },
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  const publishedCount = announcements.filter(
    (item) => item.isPublished,
  ).length;

  const tickerCount = announcements.filter(
    (item) => item.isPublished && item.showInTicker,
  ).length;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#D59344]">
            Communication du site
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#172033]">
            Annonces
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[#647084]">
            Gère les actualités, les informations et les messages diffusés
            sur le site de BEREM.
          </p>
        </div>

        <Link
          href="/admin/annonces/nouvelle"
          className="inline-flex items-center justify-center rounded-xl bg-[#D59344] px-5 py-3 text-sm font-bold text-[#10161F] transition hover:bg-[#BE7D32]"
        >
          + Nouvelle annonce
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#EAE1D7] bg-white p-5">
          <p className="text-sm text-[#647084]">Total des annonces</p>
          <p className="mt-2 text-3xl font-bold text-[#172033]">
            {announcements.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAE1D7] bg-white p-5">
          <p className="text-sm text-[#647084]">Annonces publiées</p>
          <p className="mt-2 text-3xl font-bold text-[#172033]">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAE1D7] bg-white p-5">
          <p className="text-sm text-[#647084]">Dans la barre Flash Info</p>
          <p className="mt-2 text-3xl font-bold text-[#D59344]">
            {tickerCount}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#EAE1D7] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE1D7] px-6 py-5">
          <div>
            <h2 className="font-bold text-[#172033]">
              Toutes les annonces
            </h2>
            <p className="mt-1 text-sm text-[#647084]">
              {announcements.length} annonce(s) enregistrée(s).
            </p>
          </div>
        </div>

        {announcements.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-bold text-[#172033]">
              Aucune annonce pour le moment
            </h3>
            <p className="mt-2 text-sm text-[#647084]">
              Crée ta première annonce pour communiquer avec les visiteurs.
            </p>
            <Link
              href="/admin/annonces/nouvelle"
              className="mt-5 inline-flex rounded-xl bg-[#D59344] px-5 py-3 text-sm font-bold text-[#10161F] hover:bg-[#BE7D32]"
            >
              Créer une annonce
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#EAE1D7]">
            {announcements.map((announcement) => {
              const active = isCurrentlyActive(announcement);

              return (
                <article
                  key={announcement.id}
                  className="flex flex-col gap-5 px-6 py-6 transition hover:bg-[#FBF7F1]/70 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#F6E7D2] px-3 py-1 text-xs font-semibold text-[#8A5A24]">
                        {typeLabels[announcement.type] ?? announcement.type}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          active
                            ? "bg-emerald-50 text-emerald-700"
                            : announcement.isPublished
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {active
                          ? "En diffusion"
                          : announcement.isPublished
                            ? "Programmée ou expirée"
                            : "Brouillon"}
                      </span>

                      {announcement.showInTicker && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          Flash Info
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 truncate font-bold text-[#172033]">
                      {announcement.title || "Sans titre"}
                    </h3>

                    <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-[#647084]">
                      {announcement.message}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#87909E]">
                      <span>
                        Début : {formatDate(announcement.startsAt)}
                      </span>
                      <span>
                        Fin : {formatDate(announcement.endsAt)}
                      </span>
                      <span>Priorité : {announcement.priority}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <Link
                      href={`/admin/annonces/${announcement.id}/modifier`}
                      className="rounded-lg border border-[#EAE1D7] px-3 py-2 text-xs font-semibold text-[#26364A] transition hover:border-[#D59344] hover:bg-[#FBF7F1]"
                    >
                      Modifier
                    </Link>

                    <form action={toggleAnnouncementPublication}>
                      <input
                        type="hidden"
                        name="id"
                        value={announcement.id}
                      />
                      <input
                        type="hidden"
                        name="isPublished"
                        value={String(!announcement.isPublished)}
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-[#EAE1D7] px-3 py-2 text-xs font-semibold text-[#26364A] transition hover:border-[#D59344] hover:bg-[#FBF7F1]"
                      >
                        {announcement.isPublished
                          ? "Dépublier"
                          : "Publier"}
                      </button>
                    </form>

                    <form action={deleteAnnouncement}>
                      <input
                        type="hidden"
                        name="id"
                        value={announcement.id}
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}