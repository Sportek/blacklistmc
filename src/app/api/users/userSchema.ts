import { UserStatus } from "@prisma/client";
import { z } from "zod";

export const userSchema = z.object({
  discordId: z.string(),
  status: z.enum(Object.values(UserStatus) as [string, ...string[]]),
  imageUrl: z.string(),
  displayName: z.string(),
  username: z.string(),
});
