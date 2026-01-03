import * as dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env file explicitly
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.POSTGRES_PRISMA_URL!,
  },
});
