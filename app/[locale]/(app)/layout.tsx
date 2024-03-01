import { TopBar } from "@/components/top-bar";
import { findProviderByUserId } from "@/lib/server/data/providers";
import { auth } from "@clerk/nextjs";
import React from "react";

interface AppLayoutProps extends React.PropsWithChildren<{}> {}

export default async function AppLayout({ children }: AppLayoutProps) {
  const { userId } = auth();
  const provider = userId ? await findProviderByUserId(userId) : null;

  return (
    <>
      <TopBar userId={userId} provider={provider} />
      {children}
    </>
  );
}
