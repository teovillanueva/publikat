import { Separator } from "@/components/ui/separator";
import { BillboardsTable } from "./_components/table";
import { EmptyState } from "@/components/empty-state";
import { MessageSquareOff } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";

export default async function Billboards() {
  const t = await getTranslations("Admin.Bookings");
  const billboards: any[] = [];

  return (
    <div className="">
      <div className="py-6 flex items-center container">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>
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
