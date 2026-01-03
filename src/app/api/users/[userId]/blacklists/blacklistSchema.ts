import prisma from "@/lib/prisma";
import { BlacklistStatus, BlacklistVoteState } from "@/prisma/generated/prisma/client";
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
  reasonId: z
    .string()
    .refine(reasonIdExists, {
      message: "Le reasonId n'existe pas dans la base de données",
    })
    .optional(),
  channelId: z.string().optional(),
  voteState: z.nativeEnum(BlacklistVoteState).optional(),
});

async function reasonIdExists(reasonId: string) {
  const reason = await prisma.reason.findUnique({ where: { id: reasonId } });
  return reason !== null;
}
