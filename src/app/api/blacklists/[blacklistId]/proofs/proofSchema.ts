import { ProofType } from "@/prisma/generated/prisma/client";
import { z } from "zod";

const proofTypeValues = Object.values(ProofType) as [string, ...string[]];

export const createProofSchema = z.object({
  type: z.enum(proofTypeValues),
  blacklistId: z.string(),
});
