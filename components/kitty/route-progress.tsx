"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") as HTMLAnchorElement | null : null;
      if (!target || target.target === "_blank" || target.hasAttribute("download")) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin || (url.pathname === window.location.pathname && url.search === window.location.search)) return;
        setActive(true);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => setActive(false), 15000);
      } catch {}
    };
    window.addEventListener("click", onClick, true);
    return () => { window.removeEventListener("click", onClick, true); if (timeout) clearTimeout(timeout); };
  }, []);

  if (!active) return null;
  return <div className="route-progress" role="progressbar" aria-label="Loading page" aria-valuetext="Loading"><span /></div>;
}
