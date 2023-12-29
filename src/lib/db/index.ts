import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http'

const databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL!

neonConfig.fetchConnectionCache = true;

if (!databaseUrl) {
  throw new Error("Database URL is not define");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql);
