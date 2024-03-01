import { db } from "@/db";
import { providers } from "@/db/schema";
import { eq } from "drizzle-orm";

export function findProviderByUserId(userId: string) {
  return db.query.providers.findFirst({
    where: eq(providers.userId, userId),
  });
}

export async function createProvider(data: typeof providers.$inferInsert) {
  return db.insert(providers).values(data).returning();
}
