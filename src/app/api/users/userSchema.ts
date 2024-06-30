import { UserStatus } from "@prisma/client";
import { z } from "zod";

export const userSchema = z.object({
  discordId: z.string(),
  status: z.enum(Object.values(UserStatus) as [string, ...string[]]).optional(),
  imageUrl: z.string().optional(),
  displayName: z.string().optional(),
  username: z.string().optional(),
});
