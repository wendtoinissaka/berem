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
        where: {
          isPublished: true,
        },
        orderBy: [
          {
            eventDate: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        include: {
          stage: {
            select: {
              name: true,
            },
          },
          media: {
            orderBy: {
              sortOrder: "asc",
            },
          },
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
      archivedAt: null,
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
        where: {
          isPublished: true,
        },
        orderBy: [
          {
            eventDate: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        take: 1,
        include: {
          media: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  });
}


export async function getCompletedProjects() {
  return prisma.project.findMany({
    where: {
      isPublished: true,
      status: "COMPLETED",
      archivedAt: null,
    },
    orderBy: { completedAt: "desc" },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
    },
  });
}