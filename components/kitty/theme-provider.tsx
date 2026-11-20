"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-theme", "warm");
        if (localStorage.getItem("kittycorp-theme") !== "warm") {
          localStorage.setItem("kittycorp-theme", "warm");
        }
      }
    } catch {}
  }, []);

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="warm"
      forcedTheme="warm"
      storageKey="kittycorp-theme"
      scriptProps={{ "data-cfasync": "false" }}
    >
      {children}
    </NextThemesProvider>
  );
}
