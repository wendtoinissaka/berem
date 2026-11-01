-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "coverPublicId" TEXT,
ADD COLUMN     "logoPublicId" TEXT;

-- AlterTable
ALTER TABLE "SolutionMedia" ADD COLUMN     "publicId" TEXT;
