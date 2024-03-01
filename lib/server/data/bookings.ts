import { db } from "@/db";
import { bookings } from "@/db/schema";
import { findActiveBillboardById } from "./billboards";
import { and, eq, lt } from "drizzle-orm";
import dayJs from "dayjs";

export async function createBooking(
  data: Omit<typeof bookings.$inferInsert, "status" | "endDate" | "schedule">
) {
  const billboard = await findActiveBillboardById(data.billboardId);

  if (!billboard || billboard.userId === data.userId) {
    throw new Error("Billboard not found");
  }

  return db
    .insert(bookings)
    .values({
      ...data,
      schedule: billboard.schedule,
      endDate: dayJs(data.startDate)
        .add(1, billboard.schedule === "monthly" ? "month" : "week")
        .toDate(),
    })
    .returning();
}

export async function findBookingById(id: string, userId: string) {
  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, id),
    with: {
      billboard: true,
    },
  });

  if (
    !booking ||
    booking?.userId !== userId ||
    booking.billboard.userId !== userId
  ) {
    return null;
  }

  return booking;
}

export function endExpiredBookings() {
  return db
    .update(bookings)
    .set({ status: "ended" })
    .where(
      and(eq(bookings.status, "pending"), lt(bookings.endDate, new Date()))
    )
    .returning();
}

export function approveBooking(id: string) {
  return db
    .update(bookings)
    .set({ status: "approved" })
    .where(and(eq(bookings.id, id), eq(bookings.status, "pending")))
    .returning();
}

export function rejectBooking(id: string) {
  return db
    .update(bookings)
    .set({ status: "rejected" })
    .where(and(eq(bookings.id, id), eq(bookings.status, "pending")))
    .returning();
}
