"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import * as React from "react";

interface ThemeProviderProps extends React.PropsWithChildren<{}> {}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemeProvider>
  );
}
