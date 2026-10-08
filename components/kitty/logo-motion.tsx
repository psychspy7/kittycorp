"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

const MotionContext = createContext<{paused: boolean; toggle: () => void} | null>(null);
export function LogoMotionProvider({children}: {children: ReactNode}) {
  const [paused, setPaused] = useState(false);
  return <MotionContext.Provider value={{paused, toggle: () => setPaused(value => !value)}}>{children}</MotionContext.Provider>;
}
export function useLogoMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("Logo animations require their motion provider.");
  return context;
}
