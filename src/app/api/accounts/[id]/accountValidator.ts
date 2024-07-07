import { AccountRole } from "@prisma/client";
import { z } from "zod";

const updateAccountValidator = z.object({
  role: z.enum(Object.values(AccountRole) as [string, ...string[]]),
});

export { updateAccountValidator };
