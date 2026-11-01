"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const isSystem = !theme || theme === "system";
  const activeTheme = mounted ? resolvedTheme : "system";
  const nextTheme = isSystem
    ? activeTheme === "dark" ? "light" : "dark"
    : theme === "light" ? "dark" : "system";
  const label = isSystem
    ? `System appearance. Switch to ${nextTheme} mode.`
    : `${theme === "dark" ? "Dark" : "Light"} appearance. Return to system appearance.`;
  const displayTheme = mounted ? (isSystem ? "System" : theme === "dark" ? "Dark" : "Light") : "System";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
    >
      {activeTheme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
      <span>{displayTheme}</span>
    </button>
  );
}
