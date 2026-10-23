import "server-only";

import { prisma } from "@/lib/prisma";

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      media: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getPublishedProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      media: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      updates: {
        orderBy: {
          publishedAt: "desc",
        },
      },
    },
  });
}

export async function getOngoingProjects() {
  return prisma.project.findMany({
    where: {
      isPublished: true,
      status: "IN_PROGRESS",
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      media: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      updates: {
        orderBy: {
          publishedAt: "desc",
        },
        take: 1,
      },
    },
  });
}