"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "./navigation";

interface ProviderNavProps extends React.HTMLAttributes<HTMLElement> {}

export function ProviderNav({ className, ...props }: ProviderNavProps) {
  const t = useTranslations("Common.provider-top-bar.nav");
  const pathname = usePathname();
  const items: {
    href: string;
    label: Parameters<typeof t>[0];
  }[] = [
    {
      href: "/billboards",
      label: "billboards",
    },
    {
      href: "/bookings",
      label: "bookings",
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item, index) => (
        <Link
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.endsWith(item.href)
              ? "text-foreground"
              : "text-muted-foreground"
          )}
          href={item.href}
          key={index}
        >
          {t(item.label)}
        </Link>
      ))}
    </nav>
  );
}
