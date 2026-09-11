import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string(),
});

export default defineNitroPlugin(() => {
  // eslint-disable-next-line node/no-process-env
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const fieldErrors = result.error.issues.map(
      issue => `${issue.path.join(".")}: ${issue.message}`,
    );

    console.error("❌ Invalid environment variables:\n", fieldErrors.join("\n"));
    throw new Error("Missing or invalid environment variables.");
  }
});
