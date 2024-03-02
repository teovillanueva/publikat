"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BillboardForm, billboardSchema } from "./billboard-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Billboard } from "@/db/schema";
import React from "react";
import { useRouter } from "next/navigation";
import { useTransitionWithPendingState } from "@/hooks/use-transition-with-pending-state";
import { z } from "zod";
import { Point } from "geojson";
import { createBillboard, updateBillboard } from "@/actions/billboard";
import { toast } from "sonner";

interface BillboardSheetProps extends React.PropsWithChildren<{}> {
  type: "create" | "update";
  billboard?: Billboard;
}

export function BillboardSheet({
  children,
  type,
  billboard,
}: BillboardSheetProps) {
  const t = useTranslations("Admin.Billboards");

  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const { loading, setLoading, startTransition } =
    useTransitionWithPendingState();

  const title =
    type === "create"
      ? t("Create-Billboard.title")
      : t("Update-Billboard.title");
  const description =
    type === "create"
      ? t("Create-Billboard.description")
      : t("Update-Billboard.description");
  const submitLabel =
    type === "create"
      ? t("Create-Billboard.submit")
      : t("Update-Billboard.submit");

  const onComplete = React.useCallback(() => {
    setOpen(false);
    router.refresh();
  }, [router]);

  const onSubmit = React.useCallback(
    async ({
      latitude,
      longitude,
      ...data
    }: z.infer<typeof billboardSchema>) => {
      setLoading(true);

      const location: Point = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      if (type === "update" && billboard) {
        await updateBillboard(billboard.id, {
          ...data,
          location,
        });
      } else {
        await createBillboard({
          ...data,
          location,
        });
      }

      startTransition(() => {
        onComplete?.();

        toast(t("Billboard-Form.success.title"), {
          description: t("Billboard-Form.success.description"),
        });
      });
      try {
      } catch (err: any) {
        setLoading(false);
        toast(t("Billboard-Form.error.title"), {
          description: t("Billboard-Form.error.description"),
        });
      } finally {
        setLoading(false);
      }
    },
    [billboard, onComplete, setLoading, startTransition, t, type]
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="px-0 flex flex-col">
        <SheetHeader className="px-6">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-6 flex-1 overflow-y-scroll">
          <BillboardForm
            onSubmit={onSubmit}
            defaultValues={{
              ...billboard,
              latitude: billboard?.location?.coordinates[1],
              longitude: billboard?.location?.coordinates[0],
            }}
          />
        </div>
        <SheetFooter className="px-6">
          <Button loading={loading} form="create-billboard-form" type="submit">
            {submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
