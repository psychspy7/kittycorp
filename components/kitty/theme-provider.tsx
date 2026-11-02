"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      forcedTheme="dark"
      storageKey="kittycorp-theme"
      scriptProps={{ "data-cfasync": "false" }}
    >
      {children}
    </NextThemesProvider>
  );
}
