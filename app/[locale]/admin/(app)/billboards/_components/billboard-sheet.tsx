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
import { BillboardForm } from "./billboard-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Billboard } from "@/db/schema";
import React from "react";
import { useRouter } from "next/navigation";

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
            type={type}
            defaultValues={{
              ...billboard,
              latitude: billboard?.location?.coordinates[1],
              longitude: billboard?.location?.coordinates[0],
            }}
            billboardId={billboard?.id}
            onComplete={onComplete}
          />
        </div>
        <SheetFooter className="px-6">
          <Button form="create-billboard-form" type="submit">
            {submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
