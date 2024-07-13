-- AlterTable
ALTER TABLE "Blacklist" ADD COLUMN     "reasonId" TEXT;

-- CreateTable
CREATE TABLE "Reason" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reason_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "Reason"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
