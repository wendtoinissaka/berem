-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `type` ENUM('BUILDING', 'ROAD', 'SANITATION', 'ENGINEERING_STRUCTURE', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `status` ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD') NOT NULL DEFAULT 'PLANNED',
    `progress` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NULL,
    `expectedEndDate` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `archivedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_slug_key`(`slug`),
    INDEX `Project_status_isPublished_idx`(`status`, `isPublished`),
    INDEX `Project_type_status_idx`(`type`, `status`),
    INDEX `Project_archivedAt_idx`(`archivedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectMedia` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NULL,
    `type` ENUM('IMAGE', 'VIDEO') NOT NULL,
    `caption` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectStage` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD') NOT NULL DEFAULT 'NOT_STARTED',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProjectStage_projectId_sortOrder_idx`(`projectId`, `sortOrder`),
    INDEX `ProjectStage_projectId_status_idx`(`projectId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectUpdate` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `stageId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `progress` INTEGER NOT NULL,
    `eventDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publishedAt` DATETIME(3) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,

    INDEX `ProjectUpdate_projectId_eventDate_idx`(`projectId`, `eventDate`),
    INDEX `ProjectUpdate_projectId_isPublished_eventDate_idx`(`projectId`, `isPublished`, `eventDate`),
    INDEX `ProjectUpdate_stageId_idx`(`stageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectUpdateMedia` (
    `id` VARCHAR(191) NOT NULL,
    `projectUpdateId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NULL,
    `type` ENUM('IMAGE', 'VIDEO') NOT NULL,
    `caption` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectUpdateMedia_projectUpdateId_sortOrder_idx`(`projectUpdateId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuoteRequest` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `projectType` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `estimatedBudget` VARCHAR(191) NULL,
    `desiredDate` DATETIME(3) NULL,
    `status` ENUM('NEW', 'IN_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'QUOTE_SENT', 'CLOSED') NOT NULL DEFAULT 'NEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `QuoteRequest_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `projectName` VARCHAR(191) NULL,
    `photoUrl` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuoteActivity` (
    `id` VARCHAR(191) NOT NULL,
    `quoteRequestId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `oldStatus` ENUM('NEW', 'IN_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'QUOTE_SENT', 'CLOSED') NULL,
    `newStatus` ENUM('NEW', 'IN_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'QUOTE_SENT', 'CLOSED') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `QuoteActivity_quoteRequestId_createdAt_idx`(`quoteRequestId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Solution` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `summary` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `logoPublicId` VARCHAR(191) NULL,
    `coverImageUrl` VARCHAR(191) NULL,
    `coverPublicId` VARCHAR(191) NULL,
    `websiteUrl` VARCHAR(191) NULL,
    `actionLabel` VARCHAR(191) NULL DEFAULT 'Découvrir la solution',
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Solution_slug_key`(`slug`),
    INDEX `Solution_status_sortOrder_idx`(`status`, `sortOrder`),
    INDEX `Solution_isFeatured_status_idx`(`isFeatured`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SolutionFeature` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `solutionId` VARCHAR(191) NOT NULL,

    INDEX `SolutionFeature_solutionId_sortOrder_idx`(`solutionId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SolutionMedia` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NULL,
    `type` ENUM('IMAGE', 'VIDEO') NOT NULL DEFAULT 'IMAGE',
    `caption` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `solutionId` VARCHAR(191) NOT NULL,

    INDEX `SolutionMedia_solutionId_sortOrder_idx`(`solutionId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeStatistic` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `source` ENUM('MANUAL', 'COMPLETED_PROJECTS', 'ONGOING_PROJECTS', 'ACTIVE_SERVICES', 'PUBLISHED_SOLUTIONS', 'PUBLISHED_TESTIMONIALS') NOT NULL DEFAULT 'MANUAL',
    `manualValue` VARCHAR(191) NULL,
    `suffix` VARCHAR(191) NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HomeStatistic_isVisible_sortOrder_idx`(`isVisible`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` ENUM('GENERAL', 'NEWS', 'BLOG', 'PROJECT', 'CONSTRUCTION', 'REAL_ESTATE', 'DOMOTICS', 'PROMOTION') NOT NULL DEFAULT 'GENERAL',
    `targetUrl` VARCHAR(191) NULL,
    `linkLabel` VARCHAR(191) NULL,
    `openInNewTab` BOOLEAN NOT NULL DEFAULT false,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `showInTicker` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `startsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Announcement_isPublished_showInTicker_idx`(`isPublished`, `showInTicker`),
    INDEX `Announcement_startsAt_endsAt_idx`(`startsAt`, `endsAt`),
    INDEX `Announcement_sortOrder_priority_idx`(`sortOrder`, `priority`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectMedia` ADD CONSTRAINT `ProjectMedia_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectStage` ADD CONSTRAINT `ProjectStage_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectUpdate` ADD CONSTRAINT `ProjectUpdate_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectUpdate` ADD CONSTRAINT `ProjectUpdate_stageId_fkey` FOREIGN KEY (`stageId`) REFERENCES `ProjectStage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectUpdateMedia` ADD CONSTRAINT `ProjectUpdateMedia_projectUpdateId_fkey` FOREIGN KEY (`projectUpdateId`) REFERENCES `ProjectUpdate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuoteActivity` ADD CONSTRAINT `QuoteActivity_quoteRequestId_fkey` FOREIGN KEY (`quoteRequestId`) REFERENCES `QuoteRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolutionFeature` ADD CONSTRAINT `SolutionFeature_solutionId_fkey` FOREIGN KEY (`solutionId`) REFERENCES `Solution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolutionMedia` ADD CONSTRAINT `SolutionMedia_solutionId_fkey` FOREIGN KEY (`solutionId`) REFERENCES `Solution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
