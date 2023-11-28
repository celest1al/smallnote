import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/better-sqlite3";

const databaseUrl = process.env.DATABASE_URL;

neonConfig.fetchConnectionCache = true;

if (!databaseUrl) {
  throw new Error("Database URL is not define");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql);
