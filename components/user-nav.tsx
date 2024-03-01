"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/format";
import { Laptop, LogOut, Moon, Sun, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "./navigation";

interface UserNavProps {
  isSignedIn: boolean;
}

export function UserNav({ isSignedIn }: UserNavProps) {
  const t = useTranslations("Common.user-nav");
  const { setTheme, theme } = useTheme();
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!isSignedIn) {
    return (
      <Link href={`/sign-in/?redirectUrl=${pathname}`}>
        <Button variant="secondary">{t("sign-in")}</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage
              alt={user?.firstName || "User"}
              className="object-cover"
              src={user?.imageUrl}
            />
            <AvatarFallback>
              {getInitials(`${user?.firstName} ${user?.lastName}`)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">
              {user?.fullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/user-profile/")}>
            <User className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/create-organization/");
            }}
          >
            <Icon className="mr-2" name="Add_Plus_Circle" />
            <span>Create Organization</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">
            {t("theme.title")}
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={theme === "light"}
            onCheckedChange={() => setTheme("light")}
          >
            {/* <Icon className="mr-2" name="Sun" /> */}
            <Sun className=" w-4 h-4 mr-2" />
            <span>{t("theme.light")}</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === "dark"}
            onCheckedChange={() => setTheme("dark")}
          >
            <Moon className=" w-4 h-4 mr-2" />
            <span>{t("theme.dark")}</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === "system"}
            onCheckedChange={() => setTheme("system")}
          >
            <Laptop className=" w-4 h-4 mr-2" />
            <span>{t("theme.system")}</span>
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            router.push("/sign-in/");
          }}
        >
          <LogOut className=" w-4 h-4 mr-2" />
          <span>{t("sign-out")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
