import { isValidCronExecution } from "@/lib/server/cron";
import { endExpiredBookings } from "@/lib/server/data/bookings";

export const runtime = "edge";

export async function GET() {
  if (!isValidCronExecution()) {
    return new Response("unauthorized", { status: 401 });
  }

  await endExpiredBookings();

  return new Response("ok");
}
