-- CreateEnum
CREATE TYPE "StatisticSource" AS ENUM ('MANUAL', 'COMPLETED_PROJECTS', 'ONGOING_PROJECTS', 'ACTIVE_SERVICES', 'PUBLISHED_SOLUTIONS', 'PUBLISHED_TESTIMONIALS');

-- CreateTable
CREATE TABLE "HomeStatistic" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "source" "StatisticSource" NOT NULL DEFAULT 'MANUAL',
    "manualValue" TEXT,
    "suffix" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomeStatistic_isVisible_sortOrder_idx" ON "HomeStatistic"("isVisible", "sortOrder");
