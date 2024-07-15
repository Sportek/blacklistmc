import { BlacklistStatus } from "@prisma/client";
import { z } from "zod";

export const searchParamsSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "10")),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  random: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "1")),
  search: z.string().optional().default(""),
  status: z.enum(Object.values(BlacklistStatus) as [string, ...string[]]).optional(),
});
