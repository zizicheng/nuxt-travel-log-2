import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";

import db from "./db/index";
import * as schema from "./db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  socialProviders: {
    github: {
      // eslint-disable-next-line node/no-process-env
      clientId: process.env.GITHUB_CLIENT_ID as string,
      // eslint-disable-next-line node/no-process-env
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
