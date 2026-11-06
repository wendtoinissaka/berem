import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const announcements = await prisma.announcement.findMany({
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
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        targetUrl: true,
        linkLabel: true,
        openInNewTab: true,
      },
      orderBy: [
        { priority: "desc" },
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(announcements, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces :", error);

    return NextResponse.json(
      { message: "Impossible de récupérer les annonces." },
      { status: 500 }
    );
  }
}