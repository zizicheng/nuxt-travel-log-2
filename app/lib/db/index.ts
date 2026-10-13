import { drizzle } from "drizzle-orm/libsql";

const config = useRuntimeConfig();

const db = drizzle({
  connection: {
    url: config.tursoDatabaseUrl,
    authToken: config.nodeEnv === "development" ? undefined : config.tursoAuthToken,
  },
});

export default db;
