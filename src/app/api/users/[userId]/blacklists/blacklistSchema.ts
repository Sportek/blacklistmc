import { BlacklistStatus } from "@prisma/client";
import { z } from "zod";

export const createBlacklistSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  reasonId: z.string().optional(),
  status: z.nativeEnum(BlacklistStatus).optional(),
  askedByUserId: z.string(),
  expireAt: z.preprocess((arg: unknown) => {
    if (typeof arg === "string" || arg instanceof String) {
      return new Date(String(arg));
    }
    return arg;
  }, z.date().optional()),
  channelId: z.string().optional(),
});

export const updateBlacklistSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(BlacklistStatus).optional(),
  askedByUserId: z.string().optional(),
  expireAt: z.preprocess((arg: unknown) => {
    if (typeof arg === "string" || arg instanceof String) {
      return new Date(String(arg));
    }
    return arg;
  }, z.date().optional()),
  channelId: z.string().optional(),
});
