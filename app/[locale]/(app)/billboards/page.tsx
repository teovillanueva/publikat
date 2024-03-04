import { BillboardCard } from "@/components/billboard-card";
import { BillboardsMap } from "@/components/billboards-map";
import { EmptyState } from "@/components/empty-state";
import { getBboxFromPoints } from "@/lib/geo";
import {
  findBillboards,
  findBillboardsInArea,
} from "@/lib/server/data/billboards";
import { auth } from "@clerk/nextjs";
import { MessageSquareOff } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";

interface BillboardsProps {
  searchParams: { bbox: string };
}

export default async function Billboards({ searchParams }: BillboardsProps) {
  const t = await getTranslations("Billboards");

  const { userId } = auth();

  const billboards = searchParams.bbox
    ? await findBillboardsInArea(JSON.parse(searchParams.bbox))
    : await findBillboards();

  const bbox = searchParams.bbox
    ? JSON.parse(searchParams.bbox)
    : getBboxFromPoints(
        billboards.map((b) => b.location),
        0
      );

  return (
    <div className="flex-1 grid grid-cols-4 relative">
      <div className="col-span-1 flex flex-col p-4 overflow-y-scroll space-y-4 max-h-[calc(100vh-64px)]">
        {billboards.length === 0 && (
          <EmptyState
            icon={<MessageSquareOff />}
            title={t("empty.title")}
            description={t("empty.description")}
          />
        )}
        {billboards.map((b) => (
          <BillboardCard isAuthenticated={!!userId} key={b.id} billboard={b} />
        ))}
      </div>
      <div className="flex col-span-3">
        <BillboardsMap initialBounds={bbox} billboards={billboards} />
      </div>
    </div>
  );
}
