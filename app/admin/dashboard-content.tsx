import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  HardHat,
  Megaphone,
  MessageSquareQuote,
  Layers3,
  BriefcaseBusiness,
  Plus,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { ElementType } from "react";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  value: number;
  description: string;
  icon: ElementType;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#EAE1D7] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#D59344]/50 hover:shadow-lg hover:shadow-[#172033]/5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#647084]">{title}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-[#172033]">
            {value.toLocaleString("fr-FR")}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-[#F6E7D2] text-[#A66D2D] transition group-hover:bg-[#D59344] group-hover:text-[#10161F]">
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-[#647084]">{description}</p>

        <ArrowUpRight
          size={16}
          className="shrink-0 text-[#A66D2D] opacity-0 transition group-hover:opacity-100"
        />
      </div>
    </Link>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(date);
}

function getAnnouncementStatus(announcement: {
  isPublished: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
}) {
  const now = new Date();

  if (!announcement.isPublished) {
    return {
      label: "Brouillon",
      className: "bg-slate-100 text-slate-600",
    };
  }

  if (announcement.startsAt && announcement.startsAt > now) {
    return {
      label: "Programmée",
      className: "bg-blue-50 text-blue-700",
    };
  }

  if (announcement.endsAt && announcement.endsAt < now) {
    return {
      label: "Expirée",
      className: "bg-rose-50 text-rose-700",
    };
  }

  return {
    label: "Publiée",
    className: "bg-emerald-50 text-emerald-700",
  };
}

const announcementTypeLabels: Record<string, string> = {
  GENERAL: "Information",
  NEWS: "Actualité",
  BLOG: "Blog",
  PROJECT: "Réalisation",
  CONSTRUCTION: "Chantier",
  REAL_ESTATE: "Immobilier",
  DOMOTICS: "Domotique",
  PROMOTION: "Promotion",
};

const quoteStatusLabels: Record<string, string> = {
  NEW: "Nouvelle",
  IN_REVIEW: "En cours d'étude",
  ADDITIONAL_INFO_REQUIRED: "Informations requises",
  QUOTE_SENT: "Devis envoyé",
  CLOSED: "Clôturée",
};

export default async function DashboardContent() {
  const now = new Date();

  const [
    totalProjects,
    ongoingProjects,
    totalQuotes,
    newQuotes,
    activeServices,
    publishedTestimonials,
    totalAnnouncements,
    activeAnnouncements,
    recentQuotes,
    recentAnnouncements,
  ] = await Promise.all([
    prisma.project.count(),

    prisma.project.count({
      where: { status: "IN_PROGRESS" },
    }),

    prisma.quoteRequest.count(),

    prisma.quoteRequest.count({
      where: { status: "NEW" },
    }),

    prisma.service.count({
      where: { isActive: true },
    }),

    prisma.testimonial.count({
      where: { isPublished: true },
    }),

    prisma.announcement.count(),

    prisma.announcement.count({
      where: {
        isPublished: true,
        showInTicker: true,
        AND: [
          {
            OR: [
              { startsAt: null },
              { startsAt: { lte: now } },
            ],
          },
          {
            OR: [
              { endsAt: null },
              { endsAt: { gte: now } },
            ],
          },
        ],
      },
    }),

    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        projectType: true,
        location: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.announcement.findMany({
      orderBy: [
        { createdAt: "desc" },
      ],
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        isPublished: true,
        showInTicker: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="space-y-9">

      {/* PAGE HEADER */}

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A66D2D]">
            Espace de gestion
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
            Tableau de bord
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#647084]">
            Retrouvez ici les principales activités de BEREM et gérez
            les contenus de votre site depuis un seul espace.
          </p>
        </div>

        <div className="text-sm text-[#647084]">
          {new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "full",
          }).format(now)}
        </div>
      </section>

      {/* PRIORITY ALERT */}

      {newQuotes > 0 && (
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#D59344]/30 bg-[#F6E7D2]/50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#D59344] text-[#10161F]">
              <FileText size={21} />
            </div>

            <div>
              <p className="font-bold text-[#172033]">
                {newQuotes} demande{newQuotes > 1 ? "s" : ""} de devis en attente
              </p>

              <p className="mt-1 text-sm text-[#647084]">
                Consultez les nouvelles demandes et assurez leur suivi.
              </p>
            </div>
          </div>

          <Link
            href="/admin/devis"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#9B6428] transition hover:text-[#172033]"
          >
            Traiter les demandes
            <ArrowRight size={16} />
          </Link>
        </section>
      )}

      {/* STATISTICS */}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#172033]">
            Vue d'ensemble
          </h2>

          <span className="text-xs text-[#647084]">
            Indicateurs de gestion
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Projets enregistrés"
            value={totalProjects}
            description="Ensemble des projets"
            icon={HardHat}
            href="/admin/projets"
          />

          <StatCard
            title="Chantiers en cours"
            value={ongoingProjects}
            description="Projets en exécution"
            icon={BriefcaseBusiness}
            href="/admin/projets"
          />

          <StatCard
            title="Demandes de devis"
            value={totalQuotes}
            description={`${newQuotes} nouvelle(s) demande(s)`}
            icon={FileText}
            href="/admin/devis"
          />

          <StatCard
            title="Annonces"
            value={totalAnnouncements}
            description={`${activeAnnouncements} actuellement dans le Flash Info`}
            icon={Megaphone}
            href="/admin/annonces"
          />

          <StatCard
            title="Services actifs"
            value={activeServices}
            description="Services disponibles sur le site"
            icon={Layers3}
            href="/admin/services"
          />

          <StatCard
            title="Témoignages publiés"
            value={publishedTestimonials}
            description="Témoignages visibles sur le site"
            icon={MessageSquareQuote}
            href="/admin/temoignages"
          />
        </div>
      </section>

      {/* QUICK ACTIONS */}

      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-[#172033]">
            Accès rapides
          </h2>

          <p className="mt-1 text-sm text-[#647084]">
            Accédez directement aux opérations courantes.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/admin/annonces/nouvelle"
            className="group flex items-center justify-between rounded-xl bg-[#10161F] p-4 text-white transition hover:bg-[#26364A]"
          >
            <div>
              <p className="text-sm font-bold">Nouvelle annonce</p>
              <p className="mt-1 text-xs text-slate-400">
                Publier une information
              </p>
            </div>

            <Plus size={19} className="text-[#D59344]" />
          </Link>

          <Link
            href="/admin/projets"
            className="group flex items-center justify-between rounded-xl border border-[#EAE1D7] bg-white p-4 transition hover:border-[#D59344]/60"
          >
            <div>
              <p className="text-sm font-bold text-[#172033]">
                Gérer les chantiers
              </p>
              <p className="mt-1 text-xs text-[#647084]">
                Projets et réalisations
              </p>
            </div>

            <ArrowUpRight size={18} className="text-[#A66D2D]" />
          </Link>

          <Link
            href="/admin/devis"
            className="group flex items-center justify-between rounded-xl border border-[#EAE1D7] bg-white p-4 transition hover:border-[#D59344]/60"
          >
            <div>
              <p className="text-sm font-bold text-[#172033]">
                Consulter les devis
              </p>
              <p className="mt-1 text-xs text-[#647084]">
                Suivi des demandes
              </p>
            </div>

            <ArrowUpRight size={18} className="text-[#A66D2D]" />
          </Link>

          <Link
            href="/admin/solutions"
            className="group flex items-center justify-between rounded-xl border border-[#EAE1D7] bg-white p-4 transition hover:border-[#D59344]/60"
          >
            <div>
              <p className="text-sm font-bold text-[#172033]">
                Gérer les solutions
              </p>
              <p className="mt-1 text-xs text-[#647084]">
                Contenus et visibilité
              </p>
            </div>

            <ArrowUpRight size={18} className="text-[#A66D2D]" />
          </Link>
        </div>
      </section>

      {/* RECENT QUOTES */}

      <section className="overflow-hidden rounded-2xl border border-[#EAE1D7] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE1D7] px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-bold text-[#172033]">
              Dernières demandes de devis
            </h2>

            <p className="mt-1 text-xs text-[#647084]">
              Les cinq demandes les plus récentes.
            </p>
          </div>

          <Link
            href="/admin/devis"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#A66D2D] hover:text-[#172033]"
          >
            Tout consulter
            <ArrowRight size={15} />
          </Link>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-[#172033]">
              Aucune demande de devis pour le moment.
            </p>

            <p className="mt-2 text-sm text-[#647084]">
              Les nouvelles demandes apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[#FBF7F1] text-xs uppercase tracking-wide text-[#647084]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Projet</th>
                  <th className="px-6 py-4 font-semibold">Localisation</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EBE4]">
                {recentQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="transition hover:bg-[#FBF7F1]/70"
                  >
                    <td className="px-6 py-4 font-semibold text-[#172033]">
                      {quote.fullName}
                    </td>

                    <td className="px-6 py-4 text-[#647084]">
                      {quote.projectType}
                    </td>

                    <td className="px-6 py-4 text-[#647084]">
                      {quote.location}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-[#F6E7D2] px-3 py-1 text-xs font-semibold text-[#8C5B25]">
                        {quoteStatusLabels[quote.status] ?? quote.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-[#647084]">
                      {formatDate(quote.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* RECENT ANNOUNCEMENTS */}

      <section className="overflow-hidden rounded-2xl border border-[#EAE1D7] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE1D7] px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-bold text-[#172033]">
              Dernières annonces
            </h2>

            <p className="mt-1 text-xs text-[#647084]">
              Les dernières informations enregistrées.
            </p>
          </div>

          <Link
            href="/admin/annonces"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#A66D2D] hover:text-[#172033]"
          >
            Gérer les annonces
            <ArrowRight size={15} />
          </Link>
        </div>

        {recentAnnouncements.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Megaphone
              size={28}
              className="mx-auto text-[#C4B8A7]"
              strokeWidth={1.5}
            />

            <p className="mt-3 font-medium text-[#172033]">
              Aucune annonce enregistrée.
            </p>

            <p className="mt-2 text-sm text-[#647084]">
              Créez votre première annonce pour alimenter le Flash Info.
            </p>

            <Link
              href="/admin/annonces/nouvelle"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D59344] px-4 py-2.5 text-sm font-bold text-[#10161F] transition hover:bg-[#BE7D32]"
            >
              <Plus size={16} />
              Créer une annonce
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EBE4]">
            {recentAnnouncements.map((announcement) => {
              const status = getAnnouncementStatus(announcement);

              return (
                <div
                  key={announcement.id}
                  className="flex flex-col justify-between gap-3 px-5 py-4 transition hover:bg-[#FBF7F1]/70 sm:flex-row sm:items-center sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66D2D]">
                        {announcementTypeLabels[announcement.type] ??
                          announcement.type}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>

                      {announcement.showInTicker && (
                        <span className="rounded-full bg-[#F6E7D2] px-2.5 py-1 text-[10px] font-bold text-[#8C5B25]">
                          Flash Info
                        </span>
                      )}
                    </div>

                    <p className="mt-2 truncate text-sm font-semibold text-[#172033]">
                      {announcement.title || announcement.message}
                    </p>

                    <p className="mt-1 text-xs text-[#647084]">
                      Ajoutée le {formatDate(announcement.createdAt)}
                    </p>
                  </div>

                  <Link
                    href={`/admin/annonces/${announcement.id}`}
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#A66D2D] hover:text-[#172033]"
                  >
                    Modifier
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}