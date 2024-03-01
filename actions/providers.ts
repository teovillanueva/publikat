"use server";

import { db } from "@/db";
import { providers } from "@/db/schema";
import { createProvider as _createProvider } from "@/lib/server/data/providers";
import { auth } from "@clerk/nextjs";

export async function createProvider(
  data: Omit<
    typeof providers.$inferInsert,
    "userId" | "createdAt" | "updatedAt"
  >
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  return _createProvider({
    ...data,
    userId,
  });
}
