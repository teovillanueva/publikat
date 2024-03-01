import path from "path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { db } from ".";

console.log("Migrating database...");

migrate(db, { migrationsFolder: path.join(__dirname, "migrations") }).then(() =>
  console.log("Database migrated successfully")
);
