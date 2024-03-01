import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local"] });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL_NON_POOLING!,
  },
  verbose: true,
  strict: true,
});
