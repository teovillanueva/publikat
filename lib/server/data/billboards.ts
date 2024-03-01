import { db } from "@/db";
import { billboards } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { BBox } from "geojson";
import { findProviderByUserId } from "./providers";

export function findBillboardById(id: string) {
  return db.query.billboards.findFirst({
    where: eq(billboards.id, id),
  });
}

export function findActiveBillboardById(id: string) {
  return db.query.billboards.findFirst({
    where: and(eq(billboards.id, id), eq(billboards.status, "active")),
  });
}

export function findBillboards() {
  return db.query.billboards.findMany({ limit: 100, with: { provider: true } });
}

export function findBillboardsByProviderId(providerId: string) {
  return db.query.billboards.findMany({
    where: eq(billboards.providerId, providerId),
    with: { provider: true },
  });
}

export function findBillboardsByUserId(userId: string) {
  return db.query.billboards.findMany({
    where: eq(billboards.userId, userId),
    with: { provider: true },
    orderBy: desc(billboards.createdAt),
  });
}

export function findBillboardsInArea(bbox: BBox) {
  return db.query.billboards.findMany({
    where: and(
      eq(billboards.status, "active"),
      sql`ST_Intersects(${billboards.location}, ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}, 4326))`
    ),
    limit: 100,
    with: { provider: true },
  });
}

export function updateBillboard(
  id: string,
  userId: string,
  data: Omit<Partial<typeof billboards.$inferInsert>, "userId" | "providerId">
) {
  return db
    .update(billboards)
    .set(data)
    .where(and(eq(billboards.id, id), eq(billboards.userId, userId)))
    .returning();
}

export function deleteBillboard(id: string, userId: string) {
  return db
    .delete(billboards)
    .where(and(eq(billboards.id, id), eq(billboards.userId, userId)))
    .returning();
}

export async function createBillboard(
  data: Omit<typeof billboards.$inferInsert, "status" | "providerId">
) {
  const provider = await findProviderByUserId(data.userId);

  if (!provider) {
    throw new Error("Provider not found");
  }

  return db
    .insert(billboards)
    .values({ ...data, providerId: provider.id })
    .returning();
}
