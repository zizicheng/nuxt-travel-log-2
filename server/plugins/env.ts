import { z } from "zod";

const EnvSchema = z.object({
  NUXT_NODE_ENV: z.string(),
  NUXT_TURSO_DATABASE_URL: z.string().min(1, "NUXT_TURSO_DATABASE_URL is required"),
  NUXT_TURSO_AUTH_TOKEN: z.string().min(1, "NUXT_TURSO_AUTH_TOKEN is required"),
});

export default defineNitroPlugin(() => {
  // eslint-disable-next-line node/no-process-env
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    const fieldErrors = result.error.issues.map(
      issue => `${issue.path.join(".")}: ${issue.message}`,
    );

    console.error("❌ Invalid environment variables:\n", fieldErrors.join("\n"));
    throw new Error("Missing or invalid environment variables.");
  }
});
