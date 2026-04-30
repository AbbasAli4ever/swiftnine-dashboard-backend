-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "is_commented" BOOLEAN NOT NULL DEFAULT false;
