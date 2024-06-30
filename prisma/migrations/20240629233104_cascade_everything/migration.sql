-- DropForeignKey
ALTER TABLE "Blacklist" DROP CONSTRAINT "Blacklist_user_relation";

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_user_relation" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
