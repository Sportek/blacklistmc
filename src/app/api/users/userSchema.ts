import { UserStatus } from "@prisma/client";
import { z } from "zod";

export const userSchema = z.object({
  discordId: z.string(),
  status: z.enum(Object.values(UserStatus) as [string, ...string[]]),
});
