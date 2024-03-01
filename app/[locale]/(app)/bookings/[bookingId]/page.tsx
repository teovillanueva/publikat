import { findBookingById } from "@/lib/server/data/bookings";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

interface BookingProps {
  params: {
    bookingId: string;
  };
}

export default async function Booking({ params }: BookingProps) {
  const booking = await findBookingById(params.bookingId, auth().userId!);

  return <></>;
}
