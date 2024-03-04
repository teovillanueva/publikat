import { Separator } from "@/components/ui/separator";
import { BillboardsTable } from "./_components/table";
import { EmptyState } from "@/components/empty-state";
import { MessageSquareOff } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/header";

export const runtime = "edge";

export default async function Billboards() {
  const t = await getTranslations("Admin.Bookings");
  const billboards: any[] = [];

  return (
    <div>
      <Header title={t("title")} description={t("description")} />
      <Separator />
      <div className="pt-6 container">
        {billboards.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              icon={<MessageSquareOff />}
              title={t("empty.title")}
              description={t("empty.description")}
            />
          </div>
        ) : (
          <BillboardsTable billboards={billboards} />
        )}
      </div>
    </div>
  );
}
