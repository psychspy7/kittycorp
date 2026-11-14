"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {customerSignedIn,subscribeCustomerSession} from "@/lib/customer-session";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnimatedTopDock } from "@/src/shaders/animated-top-dock/AnimatedTopDock";
const navigation = [["Services", "/services"], ["Intelligence & Labs", "/research"], ["Ecosystem", "/products"], ["Products", "/products"], ["Company", "/company"], ["Contact", "/contact"]];
export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const signedIn=useSyncExternalStore(subscribeCustomerSession,customerSignedIn,()=>false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [actionTarget, setActionTarget] = useState<HTMLElement | null>(null);
  const commandBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const root = commandBarRef.current;
    if (!root) return;

    // The registered ThreeUI component is intentionally kept byte-for-byte;
    // adapt only its fixed demo copy and button destinations for this site.
    const brand = root.querySelector<HTMLElement>(".atd-modern__word");
    brand?.replaceChildren("KITTY CORP");
    const brandLink = root.querySelector<HTMLAnchorElement>(".atd-modern__brand");
    brandLink?.setAttribute("href", "/");
    brandLink?.setAttribute("aria-label", "KITTY CORP home");

    const dock = root.querySelector<HTMLElement>(".atd-modern__dock");
    dock?.setAttribute("aria-label", "Main navigation");
    const items = dock ? Array.from(dock.querySelectorAll<HTMLButtonElement>("[data-dock-item]")) : [];
    items.forEach((item, index) => {
      const destination = navigation[index];
      if (!destination) return;
      const [label, href] = destination;
      item.querySelector("span:last-child")?.replaceChildren(label);
      item.setAttribute("aria-label", label);
      item.setAttribute("title", label);
      const isCurrent = pathname === href || pathname.startsWith(`${href}/`);
      if (isCurrent) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
      item.setAttribute("aria-pressed", String(isCurrent));
    });

    const signIn = root.querySelector<HTMLButtonElement>(".atd-modern__ghost");
    if (signIn) {
      signIn.replaceChildren(signedIn ? "My account" : "Sign in");
      signIn.setAttribute("aria-label", signedIn ? "Open my account" : "Sign in with Google");
    }
    const cta = root.querySelector<HTMLButtonElement>(".atd-modern__cta");
    cta?.querySelector("span")?.replaceChildren("Discuss a project");
    cta?.setAttribute("aria-label", "Discuss a project with KITTY CORP");
    cta?.setAttribute("data-conversion", "service_cta");
    cta?.setAttribute("data-context", "navigation");

    const actions = root.querySelector<HTMLElement>(".atd-modern__actions");
    if (actions) setActionTarget(actions);
    root.dataset.kittyReady = "true";

    const onCommandClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest(".atd-modern__brand")) {
        event.preventDefault();
        router.push("/");
        return;
      }
      const navItem = target.closest<HTMLButtonElement>(".atd-modern__item");
      if (navItem) {
        const index = items.indexOf(navItem);
        const destination = navigation[index];
        if (destination) router.push(destination[1]);
        return;
      }
      if (target.closest(".atd-modern__ghost")) {
        router.push("/account");
        return;
      }
      if (target.closest(".atd-modern__cta")) router.push("/projects");
    };
    root.addEventListener("click", onCommandClick, true);
    return () => root.removeEventListener("click", onCommandClick, true);
  }, [pathname, router, signedIn]);

  return <div className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <div className="site-header-navigation">
      <div className="shader-frame kitty-command-shell" ref={commandBarRef}>
        <AnimatedTopDock
          variant="modern"
          proximity={122}
          spring={0.19}
          damping={0.70}
          widthGrowth={17}
          heightGrowth={16}
          drop={3.5}
          className="kitty-command-bar"
        />
      </div>
      {actionTarget && createPortal(<>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><button className="kitty-mobile-menu" aria-label="Open navigation"><Menu size={20} /></button></DialogTrigger>
          <DialogContent className="mobile-navigation">
            <DialogTitle>KITTY CORP</DialogTitle>
            <DialogDescription>Services, products and the people behind them.</DialogDescription>
            <nav aria-label="Mobile navigation">
              {navigation.map(([label, href]) => <Link onClick={() => setOpen(false)} href={href} key={label} aria-current={pathname === href || (href!=="/" && pathname.startsWith(href+"/")) ? "page" : undefined}>{label}</Link>)}
              <Link onClick={() => setOpen(false)} href="/account">Google sign-in</Link>
              <Link onClick={() => setOpen(false)} href="/team">Full team</Link>
              <Link onClick={() => setOpen(false)} href="/products#early-access">Join early access</Link>
            </nav>
          </DialogContent>
        </Dialog>
      </>, actionTarget)}
    </div>
  </div>;
}
export function FilmButton({ className = "" }: { className?: string }) {
  return <Dialog><DialogTrigger asChild><button className={`film-button ${className}`}><Play size={13} /> Watch the identity film</button></DialogTrigger><DialogContent className="film-dialog"><DialogTitle>KITTY, in motion.</DialogTitle><DialogDescription>A short look at the KITTY CORP identity.</DialogDescription><video controls autoPlay playsInline preload="metadata" poster="/brand/wordmark-v1.webp"><source src="/brand/reveal.mp4" type="video/mp4" />Your browser cannot play this video. <a href="/brand/reveal.mp4">Download the film</a>.</video></DialogContent></Dialog>;
}
