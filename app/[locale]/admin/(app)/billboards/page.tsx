import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillboardsTable } from "./_components/table";
import { findBillboardsByUserId } from "@/lib/server/data/billboards";
import { auth } from "@clerk/nextjs";
import { EmptyState } from "@/components/empty-state";
import { MessageSquareOff } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BillboardSheet } from "./_components/billboard-sheet";
import { Header } from "@/components/header";

export const runtime = "edge";

export default async function Billboards() {
  const t = await getTranslations("Admin.Billboards");
  const billboards = await findBillboardsByUserId(auth().userId!);

  const createButton = (
    <BillboardSheet type="create">
      <Button>Crear cartel</Button>
    </BillboardSheet>
  );

  return (
    <div>
      <Header title={t("title")} description={t("description")}>
        {billboards.length > 0 && createButton}
      </Header>
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
