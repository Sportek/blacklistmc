/*
  Warnings:

  - The values [MODERATOR] on the enum `AccountRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountRole_new" AS ENUM ('USER', 'SUPPORT', 'SUPERVISOR', 'ADMIN');
ALTER TABLE "Account" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Account" ALTER COLUMN "role" TYPE "AccountRole_new" USING ("role"::text::"AccountRole_new");
ALTER TYPE "AccountRole" RENAME TO "AccountRole_old";
ALTER TYPE "AccountRole_new" RENAME TO "AccountRole";
DROP TYPE "AccountRole_old";
ALTER TABLE "Account" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;
