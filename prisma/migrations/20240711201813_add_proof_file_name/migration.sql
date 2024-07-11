/*
  Warnings:

  - Added the required column `extension` to the `Proof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Proof` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proof" ADD COLUMN     "extension" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
