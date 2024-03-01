import { ProviderTopBar } from "@/components/provider-top-bar";
import React from "react";

interface AdminAppLayoutProps extends React.PropsWithChildren<{}> {}

export default function AdminAppLayout({ children }: AdminAppLayoutProps) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <ProviderTopBar />
      {children}
    </>
  );
}
