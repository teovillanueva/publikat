import Image from "next/image";
import { UserNav } from "./user-nav";
import { auth } from "@clerk/nextjs";
import { ProviderNav } from "./provider-nav";

export async function ProviderTopBar() {
  const { userId } = auth();
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container">
        <Image
          className="mr-4"
          src="/logo.svg"
          alt="Logo"
          width={120}
          height={40}
        />

        <ProviderNav />

        <div className="ml-auto flex items-center space-x-4">
          <UserNav isSignedIn={!!userId} />
        </div>
      </div>
    </div>
  );
}
