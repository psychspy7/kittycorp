"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import { AppIcon } from "./secretchat";
import { downloadHref, launchHref, type Launch } from "@/lib/launches";

export function LaunchAnnouncement({ launch }: { launch: Launch }) {
  const [open, setOpen] = useState(false);
  const titleId=useId();
  const visitKey = `kitty-launch-${launch.id}-${launch.updated_at}`;
  useEffect(() => {
    try { if (sessionStorage.getItem(visitKey)) return; } catch { /* Optional session memory. */ }
    const timer = window.setTimeout(() => {
      if (document.querySelector('[role="dialog"]') || document.activeElement?.matches('input, textarea, select')) return;
      setOpen(true);
      try { sessionStorage.setItem(visitKey, "seen"); } catch { /* Downloads work without storage. */ }
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [visitKey]);
  useEffect(()=>{if(!open)return;const dismiss=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false);};window.addEventListener("keydown",dismiss);return()=>window.removeEventListener("keydown",dismiss);},[open]);
  if(!open)return null;
  return <aside className="launch-toast" aria-labelledby={titleId} aria-live="polite"><button className="launch-toast-close" onClick={()=>setOpen(false)} aria-label="Dismiss launch announcement"><X size={17}/></button><div className="launch-toast-heading"><AppIcon launch={launch} size={44}/><div><span className="micro-label">NEW RELEASE · ANDROID</span><h2 id={titleId}>{launch.name}</h2></div></div><p>{launch.tagline} <span>v{launch.version}</span></p><div className="launch-toast-actions"><Link href={launchHref(launch)} className="text-link">View the app <ArrowUpRight size={14}/></Link><a href={downloadHref(launch)} className="text-link" download>Download APK <ArrowUpRight size={14}/></a></div></aside>;
}
