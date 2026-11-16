import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SolutionStatus } from "@/generated/prisma/client";
import { connection } from "next/server";


export const metadata = {
  title: "Solutions | BEREM Admin",
};

export default async function SolutionsAdminPage() {
  await connection();

  const solutions = await prisma.solution.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: {
          features: true,
          media: true,
        },
      },
    },
  });

  const publishedCount = solutions.filter(
    (solution) => solution.status === SolutionStatus.PUBLISHED
  ).length;

  const draftCount = solutions.filter(
    (solution) => solution.status === SolutionStatus.DRAFT
  ).length;

  const archivedCount = solutions.filter(
    (solution) => solution.status === SolutionStatus.ARCHIVED
  ).length;

  const statusLabels: Record<SolutionStatus, string> = {
    DRAFT: "Brouillon",
    PUBLISHED: "Publiée",
    ARCHIVED: "Archivée",
  };

  const statusStyles: Record<SolutionStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-600 ring-slate-200",
    PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    ARCHIVED: "bg-amber-50 text-amber-700 ring-amber-200",
  };

  const stats = [
    {
      label: "Total des solutions",
      value: solutions.length,
      description: "Solutions enregistrées",
      color: "text-[#10161f]",
      accent: "bg-[#10161f]",
      icon: "grid",
    },
    {
      label: "Solutions publiées",
      value: publishedCount,
      description: "Visibles sur le site",
      color: "text-emerald-700",
      accent: "bg-emerald-500",
      icon: "check",
    },
    {
      label: "Brouillons",
      value: draftCount,
      description: "En attente de publication",
      color: "text-[#d59344]",
      accent: "bg-[#d59344]",
      icon: "edit",
    },
    {
      label: "Solutions archivées",
      value: archivedCount,
      description: "Non affichées sur le site",
      color: "text-slate-500",
      accent: "bg-slate-400",
      icon: "archive",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-7 rounded-full bg-[#d59344]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d59344]">
              Gestion du contenu
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#10161f] sm:text-4xl">
            Solutions
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#172033]/65 sm:text-base">
            Gérez les solutions numériques de BEREM, leur contenu et leur
            visibilité sur le site.
          </p>
        </div>

        <Link
          href="/admin/solutions/nouveau"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d59344] px-5 py-3.5 text-sm font-bold text-[#10161f] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#e1a653] hover:shadow-md"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Ajouter une solution
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-[#10161f]/[0.07] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`absolute inset-y-0 left-0 w-1 ${stat.accent}`}
            />

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#172033]/60">
                  {stat.label}
                </p>

                <p className={`mt-3 text-3xl font-black ${stat.color}`}>
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-[#172033]/45">
                  {stat.description}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fbf7f1] text-[#d59344]">
                {stat.icon === "grid" && (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                )}

                {stat.icon === "check" && (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                )}

                {stat.icon === "edit" && (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="m16 4 4 4L9 19H5v-4L16 4Z" />
                    <path d="m14 6 4 4" />
                  </svg>
                )}

                {stat.icon === "archive" && (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="4" rx="1" />
                    <path d="M5 8v11h14V8M10 12h4" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Liste des solutions */}
      <section className="overflow-hidden rounded-2xl border border-[#10161f]/[0.08] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#10161f]/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#10161f]">
              Toutes les solutions
            </h2>
            <p className="mt-1 text-sm text-[#172033]/55">
              Consultez et gérez les solutions enregistrées.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-[#fbf7f1] px-3 py-1.5 text-xs font-bold text-[#10161f]">
            {solutions.length} solution(s)
          </span>
        </div>

        {solutions.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fbf7f1] text-[#d59344]">
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#10161f]">
              Aucune solution pour le moment
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#172033]/60">
              Votre espace ne contient pas encore de solution. Commencez par
              en créer une, puis ajoutez ses descriptions, fonctionnalités et
              médias.
            </p>

            <Link
              href="/admin/solutions/nouveau"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d59344] px-5 py-3 text-sm font-bold text-[#10161f] transition hover:bg-[#e1a653]"
            >
              <span>+</span>
              Créer ma première solution
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#fbf7f1]/80 text-xs uppercase tracking-wider text-[#172033]/55">
                <tr>
                  <th className="px-6 py-4 font-bold">Solution</th>
                  <th className="px-5 py-4 font-bold">Statut</th>
                  <th className="px-5 py-4 font-bold">Accueil</th>
                  <th className="px-5 py-4 font-bold">Contenu</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#10161f]/[0.06]">
                {solutions.map((solution) => (
                  <tr
                    key={solution.id}
                    className="group transition-colors hover:bg-[#fbf7f1]/60"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10161f] text-sm font-black text-[#d59344]">
                          {solution.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-[#10161f] transition group-hover:text-[#d59344]">
                            {solution.name}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-xs text-[#172033]/45">
                            /solutions/{solution.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${statusStyles[solution.status]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {statusLabels[solution.status]}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      {solution.isFeatured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d59344]/10 px-3 py-1.5 text-xs font-bold text-[#9a6122]">
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="m12 2 3.1 6.3 7 .9-5.1 4.9 1.2 7-6.2-3.3-6.2 3.3 1.2-7L2 9.2l7-.9L12 2Z" />
                          </svg>
                          En vedette
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-[#172033]/40">
                          Non mise en avant
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-5">
                      <div className="space-y-1.5 text-xs text-[#172033]/65">
                        <p>
                          <span className="font-bold text-[#10161f]">
                            {solution._count.features}
                          </span>{" "}
                          fonctionnalité(s)
                        </p>

                        <p>
                          <span className="font-bold text-[#10161f]">
                            {solution._count.media}
                          </span>{" "}
                          média(s)
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/solutions/${solution.id}/modifier`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#10161f]/10 px-3.5 py-2.5 text-xs font-bold text-[#10161f] transition hover:border-[#d59344] hover:bg-[#d59344] hover:text-[#10161f]"
                      >
                        Modifier
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {solutions.length > 0 && (
          <div className="border-t border-[#10161f]/[0.06] bg-[#fbf7f1]/50 px-6 py-3">
            <p className="text-xs text-[#172033]/50">
              Les solutions sont classées selon leur ordre d'affichage, puis
              leur date de création.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}