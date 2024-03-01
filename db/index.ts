import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema";

export const db = drizzle<typeof schema>(sql, {
  logger: true,
  schema,
});
