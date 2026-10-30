"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import {customerSignedIn,subscribeCustomerSession} from "@/lib/customer-session";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Play, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const navigation = [
  ["Services", "/services"],
  ["Pricing", "/pricing"],
  ["Our work", "/products"],
  ["Company", "/company"],
  ["Build Log", "/build-log"],
  ["Contact", "/contact"]
];

export function SiteHeader() {
  const pathname = usePathname();
  const signedIn = useSyncExternalStore(subscribeCustomerSession, customerSignedIn, () => false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header-navigation">
        <Link href="/" className="brand" aria-label="KITTY CORP home">
          <Image unoptimized loading="eager" src="/brand/monogram-small-v1.webp" alt="KITTY CORP monogram" width={34} height={34} />
          <span>KITTY CORP</span>
        </Link>
        <nav className="navigation" aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <Link
              href={href}
              key={label}
              aria-current={pathname === href || (href !== "/" && pathname.startsWith(href + "/")) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-account" href="/account" aria-label="Client Portal / Account">
            <UserRound size={15} />
            <span>{signedIn ? "Client Portal" : "Client Portal"}</span>
          </Link>
          <Link className="header-cta button button-gold" href="/projects" data-conversion="service_cta" data-context="navigation">
            Discuss a Project <ArrowUpRight size={15} />
          </Link>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="menu-toggle" aria-label="Open navigation">
              <Menu size={22} />
            </button>
          </DialogTrigger>
          <DialogContent className="mobile-navigation">
            <DialogTitle>KITTY CORP</DialogTitle>
            <DialogDescription>Services, software and engineering architecture.</DialogDescription>
            <nav aria-label="Mobile navigation">
              {navigation.map(([label, href]) => (
                <Link
                  onClick={() => setOpen(false)}
                  href={href}
                  key={label}
                  aria-current={pathname === href || (href !== "/" && pathname.startsWith(href + "/")) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
              <Link onClick={() => setOpen(false)} href="/account">Client Portal &amp; Google Sign-in</Link>
              <Link onClick={() => setOpen(false)} href="/team">Engineering Team</Link>
              <Link onClick={() => setOpen(false)} href="/products#early-access">Request Early Access</Link>
            </nav>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

export function FilmButton({ className = "" }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`film-button ${className}`}>
          <Play size={13} /> Watch identity reel
        </button>
      </DialogTrigger>
      <DialogContent className="film-dialog">
        <DialogTitle>KITTY CORP · Motion Architecture</DialogTitle>
        <DialogDescription>A short look at the KITTY CORP design system and identity.</DialogDescription>
        <video controls autoPlay playsInline preload="metadata" poster="/brand/wordmark-v1.webp">
          <source src="/brand/reveal.mp4" type="video/mp4" />
          Your browser cannot play this video. <a href="/brand/reveal.mp4">Download the video</a>.
        </video>
      </DialogContent>
    </Dialog>
  );
}
