/*
  Warnings:

  - You are about to drop the column `moderatorId` on the `Blacklist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blacklist" DROP CONSTRAINT "Blacklist_moderator_relation";

-- AlterTable
ALTER TABLE "Blacklist" DROP COLUMN "moderatorId",
ADD COLUMN     "blacklistUntil" TIMESTAMP(3),
ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" VARCHAR(255) NOT NULL DEFAULT 'Title not defined',
ALTER COLUMN "reason" SET DEFAULT 'Reason not defined';

-- AlterTable
ALTER TABLE "Proof" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ModeratorVote" (
    "id" TEXT NOT NULL,
    "blacklistId" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModeratorVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModeratorVote" ADD CONSTRAINT "ModeratorVote_blacklistId_fkey" FOREIGN KEY ("blacklistId") REFERENCES "Blacklist"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ModeratorVote" ADD CONSTRAINT "ModeratorVote_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
