-- CreateEnum
CREATE TYPE "SolutionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "websiteUrl" TEXT,
    "actionLabel" TEXT DEFAULT 'Découvrir la solution',
    "status" "SolutionStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionFeature" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "solutionId" TEXT NOT NULL,

    CONSTRAINT "SolutionFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionMedia" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solutionId" TEXT NOT NULL,

    CONSTRAINT "SolutionMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solution_slug_key" ON "Solution"("slug");

-- CreateIndex
CREATE INDEX "Solution_status_sortOrder_idx" ON "Solution"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "Solution_isFeatured_status_idx" ON "Solution"("isFeatured", "status");

-- CreateIndex
CREATE INDEX "SolutionFeature_solutionId_sortOrder_idx" ON "SolutionFeature"("solutionId", "sortOrder");

-- CreateIndex
CREATE INDEX "SolutionMedia_solutionId_sortOrder_idx" ON "SolutionMedia"("solutionId", "sortOrder");

-- AddForeignKey
ALTER TABLE "SolutionFeature" ADD CONSTRAINT "SolutionFeature_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionMedia" ADD CONSTRAINT "SolutionMedia_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
