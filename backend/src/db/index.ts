import { neon } from "@neondatabase/serverless";
import { env } from "../../env.ts";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql });

export * from "./schema.ts";
