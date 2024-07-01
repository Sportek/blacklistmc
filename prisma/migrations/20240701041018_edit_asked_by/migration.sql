-- DropForeignKey
ALTER TABLE "Blacklist" DROP CONSTRAINT "Blacklist_askedBy_relation";

-- DropForeignKey
ALTER TABLE "UserHistory" DROP CONSTRAINT "UserHistory_userId_fkey";

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_askedByUserId_fkey" FOREIGN KEY ("askedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserHistory" ADD CONSTRAINT "UserHistory_user_relation" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
