"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Billboard } from "@/db/schema";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { DeleteBillboardAlertDialog } from "./delete-billboard-dialog";
import { BillboardSheet } from "./billboard-sheet";
import { updateBillboardStatus } from "@/actions/billboard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface BillboardsTableProps {
  billboards: Billboard[];
}

function useBillboardsTableColumns() {
  const t = useTranslations("Common");
  const router = useRouter();

  const columns: ColumnDef<Billboard>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "address",
      header: t("glossary.address"),
    },
    {
      accessorKey: "schedule",
      header: t("glossary.schedule"),
      cell({ row }) {
        const billboard = row.original;
        return <>{t(`schedule.${billboard.schedule}`)}</>;
      },
    },
    {
      accessorKey: "status",
      header: t("glossary.status"),
      cell({ row }) {
        const billboard = row.original;
        return <>{t(`billboard-status.${billboard.status}`)}</>;
      },
    },
    {
      header: t("glossary.measurements"),
      cell({ row }) {
        const billboard = row.original;
        return `${billboard.width} x ${billboard.height}`;
      },
    },
    {
      header: t("glossary.resolution"),
      cell({ row }) {
        const billboard = row.original;
        return `${billboard.resolutionWidth} x ${billboard.resolutionHeight}`;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const billboard = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <DotsVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <BillboardSheet billboard={billboard} type="update">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {t("billboard.update")}
                    </DropdownMenuItem>
                  </BillboardSheet>
                  <DropdownMenuItem
                    onClick={() => {
                      updateBillboardStatus(
                        billboard.id,
                        billboard.status === "active" ? "inactive" : "active"
                      ).then(() => {
                        router.refresh();
                        toast(t("update-billboard.success.title"), {
                          description: t(
                            "update-billboard.success.description"
                          ),
                        });
                      });
                    }}
                  >
                    {billboard.status === "active"
                      ? t("billboard.disable")
                      : t("billboard.enable")}
                  </DropdownMenuItem>
                  <DeleteBillboardAlertDialog>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                      className="text-destructive"
                    >
                      {t("billboard.delete")}
                    </DropdownMenuItem>
                  </DeleteBillboardAlertDialog>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return columns;
}

export function BillboardsTable({ billboards }: BillboardsTableProps) {
  const columns = useBillboardsTableColumns();

  return <DataTable columns={columns} data={billboards} />;
}
