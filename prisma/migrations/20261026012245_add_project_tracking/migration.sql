-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('BUILDING', 'ROAD', 'SANITATION', 'ENGINEERING_STRUCTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectStageStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

-- DropIndex
DROP INDEX "ProjectUpdate_projectId_publishedAt_idx";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "ProjectUpdate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stageId" TEXT,
ALTER COLUMN "publishedAt" DROP NOT NULL,
ALTER COLUMN "publishedAt" DROP DEFAULT;

-- Preserve existing project update history
UPDATE "ProjectUpdate"
SET "eventDate" = "publishedAt"
WHERE "publishedAt" IS NOT NULL;

UPDATE "ProjectUpdate"
SET "isPublished" = true
WHERE "publishedAt" IS NOT NULL;


-- CreateTable
CREATE TABLE "ProjectStage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStageStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpdateMedia" (
    "id" TEXT NOT NULL,
    "projectUpdateId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUpdateMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectStage_projectId_sortOrder_idx" ON "ProjectStage"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProjectStage_projectId_status_idx" ON "ProjectStage"("projectId", "status");

-- CreateIndex
CREATE INDEX "ProjectUpdateMedia_projectUpdateId_sortOrder_idx" ON "ProjectUpdateMedia"("projectUpdateId", "sortOrder");

-- CreateIndex
CREATE INDEX "Project_type_status_idx" ON "Project"("type", "status");

-- CreateIndex
CREATE INDEX "Project_archivedAt_idx" ON "Project"("archivedAt");

-- CreateIndex
CREATE INDEX "ProjectUpdate_projectId_eventDate_idx" ON "ProjectUpdate"("projectId", "eventDate");

-- CreateIndex
CREATE INDEX "ProjectUpdate_projectId_isPublished_eventDate_idx" ON "ProjectUpdate"("projectId", "isPublished", "eventDate");

-- CreateIndex
CREATE INDEX "ProjectUpdate_stageId_idx" ON "ProjectUpdate"("stageId");

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ProjectStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpdateMedia" ADD CONSTRAINT "ProjectUpdateMedia_projectUpdateId_fkey" FOREIGN KEY ("projectUpdateId") REFERENCES "ProjectUpdate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
