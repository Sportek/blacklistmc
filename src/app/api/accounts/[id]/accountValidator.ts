import { AccountRole } from "@/prisma/generated/prisma/client";
import { z } from "zod";

const updateAccountValidator = z.object({
  role: z.enum(Object.values(AccountRole) as [string, ...string[]]),
});

export { updateAccountValidator };
