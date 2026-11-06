import { drizzle } from "drizzle-orm/libsql";

import { relations } from "./relations";

const db = drizzle({
  connection: {
    // eslint-disable-next-line node/no-process-env
    url: process.env.NUXT_TURSO_DATABASE_URL!,
    // eslint-disable-next-line node/no-process-env
    authToken: process.env.NUXT_NODE_ENV === "development" ? undefined : process.env.NUXT_TURSO_AUTH_TOKEN!,
  },
  relations,
});

export default db;
