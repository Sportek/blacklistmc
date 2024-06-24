import { z } from "zod";

export const createBlacklistSchema = z.object({
  userId: z.string(),
  moderatorId: z.string(),
  reason: z.string(),
});
