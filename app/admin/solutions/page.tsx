import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SolutionStatus } from "@/generated/prisma/client";

export const metadata = {
  title: "Solutions | BEREM Admin",
};

export default async function SolutionsAdminPage() {
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

  const statusLabels: Record<SolutionStatus, string> = {
    DRAFT: "Brouillon",
    PUBLISHED: "Publiée",
    ARCHIVED: "Archivée",
  };

  const statusStyles: Record<SolutionStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    PUBLISHED: "bg-emerald-100 text-emerald-800",
    ARCHIVED: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-[#102A43]">
            Solutions
          </h1>

          <p className="mt-2 text-slate-600">
            Gérez les solutions numériques présentées par BEREM.
          </p>
        </div>

        <Link
          href="/admin/solutions/nouveau"
          className="inline-flex items-center justify-center rounded-xl bg-[#102A43] px-5 py-3 font-semibold text-white transition hover:bg-[#183d5d]"
        >
          + Ajouter une solution
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total des solutions</p>
          <p className="mt-2 text-3xl font-black text-[#102A43]">
            {solutions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Solutions publiées</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {
              solutions.filter(
                (solution) => solution.status === SolutionStatus.PUBLISHED
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Brouillons</p>
          <p className="mt-2 text-3xl font-black text-slate-700">
            {
              solutions.filter(
                (solution) => solution.status === SolutionStatus.DRAFT
              ).length
            }
          </p>
        </div>
      </div>

      {solutions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-[#102A43]">
            Aucune solution pour le moment
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-slate-600">
            Commencez par ajouter votre première solution. Vous pourrez
            ensuite renseigner sa description, ses fonctionnalités et
            ses médias.
          </p>

          <Link
            href="/admin/solutions/nouveau"
            className="mt-6 inline-flex rounded-xl bg-amber-500 px-5 py-3 font-bold text-[#102A43] transition hover:bg-amber-400"
          >
            Créer ma première solution
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Solution</th>
                  <th className="px-5 py-4 font-semibold">Statut</th>
                  <th className="px-5 py-4 font-semibold">Accueil</th>
                  <th className="px-5 py-4 font-semibold">Contenu</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {solutions.map((solution) => (
                  <tr key={solution.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#102A43]">
                        {solution.name}
                      </p>

                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                        /solutions/{solution.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[solution.status]}`}
                      >
                        {statusLabels[solution.status]}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {solution.isFeatured ? (
                        <span className="font-medium text-emerald-700">
                          Oui
                        </span>
                      ) : (
                        <span className="text-slate-500">Non</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      <p>{solution._count.features} fonctionnalité(s)</p>
                      <p className="mt-1 text-xs">
                        {solution._count.media} média(s)
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/solutions/${solution.id}/modifier`}
                        className="inline-flex rounded-lg border border-slate-200 px-3 py-2 font-semibold text-[#102A43] transition hover:border-[#102A43] hover:bg-slate-50"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
