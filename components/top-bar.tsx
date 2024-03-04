"use client";

import { MainNav } from "./main-nav";
import Image from "next/image";
import { UserNav } from "./user-nav";
import { Button } from "./ui/button";
import { Link, usePathname } from "./navigation";
import { Provider } from "@/db/schema";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface TopBarProps {
  provider?: Provider | null;
  userId?: string | null;
}

export function TopBar({ provider, userId }: TopBarProps) {
  const pathname = usePathname();
  const t = useTranslations("Common.top-bar");
  // const billingPortalSessionUrl = await getBillingPortalSessionUrl();

  return (
    <div className="border-b">
      <div
        className={cn(
          "flex h-16 items-center px-4",
          pathname !== "/billboards" && "container"
        )}
      >
        <Image
          className="mr-4"
          src="/logo.svg"
          alt="Logo"
          width={120}
          height={40}
        />

        <MainNav isAuthenticated={!!userId} isProvider={!!provider} />

        <div className="ml-auto flex items-center space-x-4">
          <Link
            href={
              !userId
                ? `/sign-up?redirectUrl=/admin/billboards/new`
                : provider
                ? "/admin/billboards/new"
                : "/admin/onboarding"
            }
          >
            <Button>{t("create-billboard")}</Button>
          </Link>
          <UserNav isSignedIn={!!userId} />
        </div>
      </div>
    </div>
  );
}
