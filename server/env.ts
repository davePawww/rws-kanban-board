import { configDotenv as loadEnv } from "dotenv";
import { z } from "zod";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const isProd = () => process.env.NODE_ENV === "production";
export const isDev = () => process.env.NODE_ENV === "development";
export const isStaging = () => process.env.NODE_ENV === "staging";

if (isProd()) {
  loadEnv();
} else if (isStaging()) {
  loadEnv({ path: ".env.staging" });
} else if (isDev()) {
  loadEnv({ path: ".env.local" });
} else {
  throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
}

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z
    .enum(["development", "production", "staging"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("localhost"),
  CORS_ORIGIN: z
    .string()
    .or(z.array(z.string()))
    .transform((val) => {
      if (typeof val === "string") {
        return val.split(",").map((origin) => origin.trim());
      }
      return val;
    })
    .default([]),
  LOG_LEVEL: z
    .enum(["error", "info", "debug", "warn", "trace"])
    .default(isProd() ? "info" : "debug"),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error("Invalid environment variables:");
      console.error(z.treeifyError(e));
      process.exit(1);
    }
    throw e;
  }
}

export const env = parseEnv();
