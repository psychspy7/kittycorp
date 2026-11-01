"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function SiteToaster() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" || resolvedTheme === "light" ? resolvedTheme : "system";

  return <Toaster theme={theme} position="bottom-right" richColors />;
}
