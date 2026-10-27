import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import SolutionForm from "@/components/admin/solutions/solution-form";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Modifier une solution | BEREM Admin",
};

export default async function EditSolutionPage({ params }: Props) {
  await connection();
  await requireAdmin();

  const { id } = await params;

  const solution = await prisma.solution.findUnique({
    where: { id },
    include: {
      features: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!solution) {
    notFound();
  }

  const initialData = {
    id: solution.id,
    name: solution.name,
    summary: solution.summary,
    description: solution.description,
    logoUrl: solution.logoUrl,
    coverImageUrl: solution.coverImageUrl,
    websiteUrl: solution.websiteUrl,
    actionLabel: solution.actionLabel,
    status: solution.status,
    isFeatured: solution.isFeatured,
    sortOrder: solution.sortOrder,
    features: solution.features.map((feature) => ({
      title: feature.title,
      description: feature.description ?? "",
    })),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <Link
          href="/admin/solutions"
          className="text-sm font-semibold text-slate-500 transition hover:text-[#102A43]"
        >
          ← Retour aux solutions
        </Link>

        <h1 className="mt-4 text-3xl font-black text-[#102A43]">
          Modifier la solution
        </h1>

        <p className="mt-2 text-slate-600">
          Modifiez les informations, les fonctionnalités et les médias de cette
          solution numérique.
        </p>
      </header>

      <SolutionForm initialData={initialData} />
    </div>
  );
}