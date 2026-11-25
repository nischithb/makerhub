import "dotenv/config";
import z from "zod";

const envVarsSchema = z.object({
  DATABASE_URL: z.url(),
  DIRECT_URL: z.url(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

function validateEnvVars() {
  const result = envVarsSchema.safeParse(process.env);

  if (!result.success) {
    console.error(z.prettifyError(result.error));
    throw new Error("environment variables validation failed");
  }

  return result.data;
}

export const env = validateEnvVars();
