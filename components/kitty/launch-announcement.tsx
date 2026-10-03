"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Rocket } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SecretChatDownload, SecretChatMark } from "./secretchat";
import { fileSize, launchHref, type Launch } from "@/lib/launches";

export function LaunchAnnouncement({ launch }: { launch: Launch }) {
  const [open, setOpen] = useState(false);
  const visitKey = `kitty-launch-${launch.id}-${launch.updated_at}`;

  useEffect(() => {
    try { if (sessionStorage.getItem(visitKey)) return; } catch { /* The announcement also works with storage disabled. */ }
    const timer = window.setTimeout(() => {
      // Do not interrupt a film, notice, or menu already opened by the visitor.
      if (document.querySelector('[role="dialog"], .navigation.is-open')) return;
      setOpen(true);
      try { sessionStorage.setItem(visitKey, "seen"); } catch { /* No storage is required to download. */ }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [visitKey]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="launch-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); document.getElementById("secretchat-launch-link")?.focus(); }}>
        <span className="micro-label">CHECK OUT OUR NEW LAUNCH</span>
        {launch.slug === "secretchat" ? <SecretChatMark size={88} /> : <span className="launch-generic-icon"><Rocket size={42} /></span>}
        <DialogTitle>Meet <em>{launch.name}.</em></DialogTitle>
        <DialogDescription>{launch.description}</DialogDescription>
        <SecretChatDownload launch={launch} />
        <span className="download-meta">v{launch.version} · {fileSize(launch.apk_bytes)} · {launch.android}</span>
        <a className="text-link" href={launchHref(launch)}>Explore the app & installation guide <ArrowUpRight size={16} /></a>
        <DialogClose asChild><button className="launch-dismiss">Keep exploring Kitty Corp</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
