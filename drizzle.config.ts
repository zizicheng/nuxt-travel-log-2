/// <reference types="node" />
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./app/lib/db/migrations",
  schema: "./app/lib/db/schema/index.ts",
  dialect: "turso",
  dbCredentials: {
    // eslint-disable-next-line node/no-process-env
    url: process.env.NUXT_TURSO_DATABASE_URL!,
    // eslint-disable-next-line node/no-process-env
    authToken: process.env.NUXT_NODE_ENV === "development" ? undefined : process.env.NUXT_TURSO_AUTH_TOKEN!,
  },
});
