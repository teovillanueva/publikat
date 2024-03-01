import { createId } from "@paralleldrive/cuid2";
import { text } from "drizzle-orm/pg-core";

export function cuid() {
  return text("id")
    .$defaultFn(() => createId())
    .primaryKey();
}
