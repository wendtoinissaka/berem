-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('GENERAL', 'NEWS', 'BLOG', 'PROJECT', 'CONSTRUCTION', 'REAL_ESTATE', 'DOMOTICS', 'PROMOTION');

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL DEFAULT 'GENERAL',
    "targetUrl" TEXT,
    "linkLabel" TEXT,
    "openInNewTab" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "showInTicker" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Announcement_isPublished_showInTicker_idx" ON "Announcement"("isPublished", "showInTicker");

-- CreateIndex
CREATE INDEX "Announcement_startsAt_endsAt_idx" ON "Announcement"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Announcement_sortOrder_priority_idx" ON "Announcement"("sortOrder", "priority");
