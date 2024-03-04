import { Header } from "@/components/header";
import { Note } from "@/components/note";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { findBillboardById } from "@/lib/server/data/billboards";
import { findExistingBookingForUser } from "@/lib/server/data/bookings";
import { auth } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookBillboardForm } from "./_components/book-billboard-form";

export const runtime = "edge";

interface BookBillboardProps {
  params: {
    billboardId: string;
  };
}

export default async function BookBillboard({ params }: BookBillboardProps) {
  const t = await getTranslations("Book-Billboard");
  const billboard = await findBillboardById(params.billboardId);

  if (!billboard) {
    return redirect("/billboards");
  }

  const existingBooking = await findExistingBookingForUser(
    params.billboardId,
    auth().userId!
  );

  return (
    <div>
      <Header title={t("title")} description={t("description")} />
      <Separator />
      <div className="pt-6 container">
        {existingBooking && (
          <Note
            title="Ya tienes una reserva para este cartel"
            description="Puedes ver los detalles de tu reserva en el siguiente enlace"
          >
            <Link href={`/bookings/${existingBooking.id}`}>
              <Button>Ver reserva</Button>
            </Link>
          </Note>
        )}
        <div className="grid grid-cols-2 gap-4 [&>.col-span-1]:min-h-0">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Datos de la reserva</CardTitle>
              <CardDescription>
                Completa el siguiente formulario para reservar este cartel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookBillboardForm billboardId={params.billboardId} />
            </CardContent>
          </Card>
          <Card className="col-span-1"></Card>
        </div>
      </div>
    </div>
  );
}
