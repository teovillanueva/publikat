"use server";

import { billboards } from "@/db/schema";
import {
  createBillboard as _createBillboard,
  updateBillboard as _updateBillboard,
  deleteBillboard as _deleteBillboard,
} from "@/lib/server/data/billboards";
import { auth } from "@clerk/nextjs";

export async function createBillboard(
  data: Omit<typeof billboards.$inferInsert, "status" | "providerId" | "userId">
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  return _createBillboard({
    ...data,
    userId,
  });
}

export async function updateBillboard(
  id: string,
  data: Omit<typeof billboards.$inferInsert, "status" | "providerId" | "userId">
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  return _updateBillboard(id, userId, data);
}

export async function updateBillboardStatus(
  id: string,
  status: "active" | "inactive"
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  return _updateBillboard(id, userId, {
    status,
  });
}

export async function deleteBillboard(id: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  return _deleteBillboard(id, userId);
}
