import { prisma } from "@/lib/prisma";
import { StatisticSource } from "@/generated/prisma/client";

export async function getStatisticValue(
  source: StatisticSource,
  manualValue?: string | null,
): Promise<string> {
  if (source === "MANUAL") {
    return manualValue?.trim() || "0";
  }

  switch (source) {
    case "COMPLETED_PROJECTS": {
      const count = await prisma.project.count({
        where: {
          status: "COMPLETED",
          isPublished: true,
          archivedAt: null,
        },
      });
      return String(count);
    }

    case "ONGOING_PROJECTS": {
      const count = await prisma.project.count({
        where: {
          status: "IN_PROGRESS",
          isPublished: true,
          archivedAt: null,
        },
      });
      return String(count);
    }

    case "ACTIVE_SERVICES": {
      const count = await prisma.service.count({
        where: { isActive: true },
      });
      return String(count);
    }

    case "PUBLISHED_SOLUTIONS": {
      const count = await prisma.solution.count({
        where: { status: "PUBLISHED" },
      });
      return String(count);
    }

    case "PUBLISHED_TESTIMONIALS": {
      const count = await prisma.testimonial.count({
        where: { isPublished: true },
      });
      return String(count);
    }

    default:
      return "0";
  }
}

export async function getHomeStatistics() {
  const statistics = await prisma.homeStatistic.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });

  return Promise.all(
    statistics.map(async (statistic) => ({
      id: statistic.id,
      label: statistic.label,
      description: statistic.description,
      value: await getStatisticValue(
        statistic.source,
        statistic.manualValue,
      ),
      suffix: statistic.suffix,
      sortOrder: statistic.sortOrder,
    })),
  );
}
