/*
  Warnings:

  - You are about to drop the column `reason` on the `Blacklist` table. All the data in the column will be lost.
  - Added the required column `description` to the `Blacklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blacklist" DROP COLUMN "reason",
ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "title" DROP DEFAULT;
