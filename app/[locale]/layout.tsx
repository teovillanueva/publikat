import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { useClientMessages } from "@/lib/server/use-client-messages";
import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";

export const runtime = "edge";

interface RootLayoutProps extends React.PropsWithChildren<{}> {
  params: {
    locale: string;
  };
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const messages = useClientMessages();

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang={locale} suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased flex flex-col",
            fontSans.variable
          )}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
