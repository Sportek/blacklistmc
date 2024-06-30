import { z } from "zod";

export const createBlacklistSchema = z.object({
  title: z.string(),
  description: z.string(),
  expireAt: z.preprocess((arg: unknown) => {
    if (typeof arg === "string" || arg instanceof String) {
      return new Date(String(arg));
    }
    return arg;
  }, z.date().optional()),
  isFinalized: z.boolean().optional(),
});
