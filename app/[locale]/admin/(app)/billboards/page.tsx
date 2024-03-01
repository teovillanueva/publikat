import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillboardsTable } from "./_components/table";
import {
  findBillboardsByProviderId,
  findBillboardsByUserId,
} from "@/lib/server/data/billboards";
import { auth } from "@clerk/nextjs";
import { EmptyState } from "@/components/empty-state";
import { MessageSquareOff } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BillboardForm } from "./_components/billboard-form";
import { getTranslations } from "next-intl/server";
import { BillboardSheet } from "./_components/billboard-sheet";

export default async function Billboards() {
  const t = await getTranslations("Admin.Billboards");
  const billboards = await findBillboardsByUserId(auth().userId!);

  const createButton = (
    <BillboardSheet type="create">
      <Button>Crear cartel</Button>
    </BillboardSheet>
  );

  return (
    <div className="">
      <div className="py-6 flex items-center container">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        {billboards.length > 0 && createButton}
      </div>
      <Separator />
      <div className="pt-6 container">
        {billboards.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              icon={<MessageSquareOff />}
              title="No tienes carteles"
              description="Parece que no tienes ningún cartel. Puedes crear uno nuevo haciendo click en el boton de abajo."
            >
              {createButton}
            </EmptyState>
          </div>
        ) : (
          <BillboardsTable billboards={billboards} />
        )}
      </div>
    </div>
  );
}
