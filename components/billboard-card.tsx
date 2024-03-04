import { Billboard, Provider } from "@/db/schema";
import { Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface BillboardCardProps {
  billboard: Billboard & { provider: Provider };
  isAuthenticated: boolean;
}

export function BillboardCard({
  billboard,
  isAuthenticated,
}: BillboardCardProps) {
  const t = useTranslations("Common");

  return (
    <Card key={billboard.id}>
      <CardHeader className="pb-2">
        <div className="aspect-video relative">
          <Image src="/billboard.jpeg" alt={billboard.address} fill />
        </div>
        <CardTitle className="pt-2">{billboard.address}</CardTitle>
        <CardDescription>{billboard.provider.name}</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-4 justify-between">
        <Link
          href={
            isAuthenticated
              ? `/billboards/${billboard.id}/book`
              : `/sign-in?redirectUrl=/billboards/${billboard.id}/book`
          }
        >
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            {t("action.schedule")}
          </Button>
        </Link>
        <p className="text-lg font-semibold">
          $ 100 / {t(`schedule.price.${billboard.schedule}`)}
        </p>
      </CardFooter>
    </Card>
  );
}
