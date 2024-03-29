"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "./navigation";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  isProvider?: boolean;
  isAuthenticated?: boolean;
}

export function MainNav({
  className,
  isProvider,
  isAuthenticated,
  ...props
}: MainNavProps) {
  const t = useTranslations("Common.top-bar.main-nav");
  const pathname = usePathname();
  const items: {
    href: string;
    label: Parameters<typeof t>[0];
  }[] = [
    {
      href: "/billboards",
      label: "billboards",
    },
  ];

  if (isAuthenticated) {
    items.push({
      href: "/bookings",
      label: "bookings",
    });
  }

  if (isProvider) {
    items.push({
      href: "/admin/billboards",
      label: "admin-panel",
    });
  }

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item, index) => (
        <Link
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary justify-stretch",
            pathname.endsWith(item.href) || pathname.startsWith(item.href)
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
