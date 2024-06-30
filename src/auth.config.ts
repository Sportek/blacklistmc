import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";

export default { providers: [Discord], trustHost: true } satisfies NextAuthConfig;
