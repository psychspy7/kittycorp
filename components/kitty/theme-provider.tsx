"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (localStorage.getItem("kittycorp-theme") !== "dark") {
          localStorage.setItem("kittycorp-theme", "dark");
        }
      }
    } catch {}
  }, []);

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
