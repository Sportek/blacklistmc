import { z } from "zod";

export const createBlacklistSchema = z.object({
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  isFinalized: z.boolean().optional(),
});
