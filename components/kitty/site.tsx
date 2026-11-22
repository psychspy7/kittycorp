"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { customerSignedIn, subscribeCustomerSession } from "@/lib/customer-session";

const navigation = [
  ["Home", "/"],
  ["About", "/company"],
  ["Research", "/research"],
  ["Projects", "/projects"],
  ["Membership", "/memberships"],
  ["Contact", "/contact"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const signedIn = useSyncExternalStore(subscribeCustomerSession, customerSignedIn, () => false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Close mobile drawer and restore body scroll on route change or navigation
  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setOpen(false);
      document.body.style.overflow = "auto";
    }, 0);
    return () => clearTimeout(closeTimer);
  }, [pathname]);

  return (
    <header
      className={`site-header sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        scrolled
          ? "bg-[#FBFAF7]/95 backdrop-blur-md border-[#D9D6CF] shadow-[0_1px_6px_rgba(0,0,0,0.03)]"
          : "bg-[#FBFAF7] border-[#D9D6CF]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <Link
          href="/"
          className="brand flex items-center gap-3 text-[#191B1D] hover:opacity-85 transition-opacity"
          aria-label="KITTY CORP home"
        >
          <div className="relative w-14 h-14 flex-shrink-0 overflow-visible">
            <Image
              unoptimized
              src="/brand/monogram-v2.webp"
              alt="KITTY CORP"
              width={56}
              height={56}
              className="object-contain w-full h-full"
            />
          </div>
          <span className="font-[family-name:var(--font-display)] tracking-[0.22em] font-normal uppercase text-[15px] sm:text-[16px] text-[#191B1D]">
            KITTY CORP
          </span>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="navigation hidden xl:flex items-center gap-5 text-[13px] font-medium tracking-wide">
          {navigation.map(([label, href]) => {
            const isCurrent = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={label}
                href={href}
                className={`relative py-1 transition-colors ${
                  isCurrent
                    ? "text-[#2457D6] font-semibold"
                    : "text-[#62676D] hover:text-[#191B1D]"
                }`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {label}
                {isCurrent && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#2457D6] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/account"
            className="hidden xl:inline-flex text-[13px] font-medium text-[#62676D] hover:text-[#191B1D] px-3 py-1.5 transition-colors"
          >
            {signedIn ? "My account" : "Sign in"}
          </Link>

          <a
            href="https://demo.thekittycorp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[13px] font-medium transition-all shadow-sm"
            data-conversion="service_cta"
            data-context="navigation"
          >
            <span>Digital Solutions</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </a>

          {/* Mobile Menu Toggle Button: Active on mobile and tablet (< 1024px) */}
          <button
            type="button"
            className="menu-toggle kitty-mobile-menu xl:hidden flex items-center justify-center w-12 h-12 min-w-[48px] min-h-[48px] rounded-full border border-[#B8B4AA] bg-[#FBFAF7] text-[#191B1D] hover:bg-[#E9E6E0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] focus-visible:ring-offset-2 transition-all shadow-sm relative z-[60] ml-auto flex-shrink-0"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="w-5 h-5 text-[#191B1D]" /> : <Menu className="w-5 h-5 text-[#191B1D]" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Slide-Over Drawer with Backdrop */}
      {open && (
        <div className="lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out drawer panel */}
          <aside
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
            className="mobile-navigation fixed inset-y-0 right-0 z-[60] w-[88vw] max-w-[360px] h-[100dvh] bg-[#FBFAF7] border-l border-[#C2BEB5] shadow-2xl flex flex-col justify-between overflow-y-auto"
            style={{
              paddingTop: "max(1.5rem, env(safe-area-inset-top))",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
            }}
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-[#C2BEB5]">
                <div className="flex items-center gap-2.5">
                  <Image
                    unoptimized
                    src="/brand/monogram-v2.webp"
                    alt="KITTY CORP"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <span className="font-[family-name:var(--font-display)] tracking-[0.2em] font-normal uppercase text-[15px] text-[#191B1D]">
                    KITTY CORP
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center text-[#191B1D] border border-[#B8B4AA] bg-[#FBFAF7] hover:bg-[#E9E6E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] focus-visible:ring-offset-2 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-[#191B1D]" />
                </button>
              </div>

              <p className="text-xs text-[#191B1D] font-normal mt-3 mb-5">
                Engineering intelligence for the physical world.
              </p>

              {/* Navigation Links */}
              <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
                {navigation.map(([label, href]) => {
                  const isCurrent = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center min-h-[48px] rounded-lg text-[16px] transition-colors ${
                        isCurrent
                          ? "bg-[#E9E6E0] font-bold text-[#1D46B0] border-l-4 border-[#2457D6] pl-3"
                          : "text-[#191B1D] font-medium hover:text-[#1D46B0] hover:bg-[#E9E6E0]/80 pl-4"
                      }`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  );
                })}

                {/* Core Initiatives Group */}
                <div className="pt-3 pb-1 border-t border-[#C2BEB5] my-2">
                  <span className="px-3.5 text-[12px] font-mono uppercase tracking-widest text-[#191B1D] font-bold block mb-1.5">
                    Core Initiatives
                  </span>
                  {[
                    { href: "/agriyaan", label: "KITTY AgriYaan" },
                    { href: "/urjayaan", label: "KITTY UrjaYaan" },
                  ].map(({ href, label }) => {
                    const isCurrent = pathname === href || pathname.startsWith(href + "/");
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center min-h-[48px] rounded-lg text-[15px] transition-colors ${
                          isCurrent
                            ? "bg-[#E9E6E0] font-bold text-[#1D46B0] border-l-4 border-[#2457D6] pl-3"
                            : "text-[#191B1D] font-medium hover:text-[#1D46B0] hover:bg-[#E9E6E0]/80 pl-4"
                        }`}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>

                {/* Account & Research Support */}
                <div className="pt-2 border-t border-[#C2BEB5] my-2">
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className={`flex items-center min-h-[48px] rounded-lg text-[15px] transition-colors ${
                      pathname === "/account" || pathname.startsWith("/account/")
                        ? "bg-[#E9E6E0] font-bold text-[#1D46B0] border-l-4 border-[#2457D6] pl-3"
                        : "text-[#191B1D] font-medium hover:text-[#1D46B0] hover:bg-[#E9E6E0]/80 pl-4"
                    }`}
                    aria-current={pathname === "/account" || pathname.startsWith("/account/") ? "page" : undefined}
                  >
                    {signedIn ? "My Account" : "Sign In"}
                  </Link>
                  <Link
                    href="/support"
                    onClick={() => setOpen(false)}
                    className={`flex items-center min-h-[48px] rounded-lg text-[15px] transition-colors ${
                      pathname === "/support" || pathname.startsWith("/support/")
                        ? "bg-[#E9E6E0] font-bold text-[#1D46B0] border-l-4 border-[#2457D6] pl-3"
                        : "text-[#191B1D] font-semibold hover:text-[#1D46B0] hover:bg-[#E9E6E0]/80 pl-4"
                    }`}
                    aria-current={pathname === "/support" || pathname.startsWith("/support/") ? "page" : undefined}
                  >
                    Fuel Us ☕
                  </Link>
                </div>
              </nav>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-4 border-t border-[#C2BEB5] space-y-2 mt-6">
              <a
                href="https://demo.thekittycorp.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full min-h-[48px] py-3 px-4 rounded-full bg-[#2457D6] text-white text-[14px] font-semibold shadow-sm hover:bg-[#1D46B0] transition-colors"
              >
                <span>Digital Solutions Studio</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </a>
              <p className="text-center text-[11px] font-mono text-[#374151] font-semibold uppercase tracking-wider">
                India to the World
              </p>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

export function FilmButton({ className = "" }: { className?: string }) {
  return (
    <Dialog>
      <DialogContent className={`film-dialog max-w-2xl bg-[#FBFAF7] p-6 rounded-2xl border border-[#D9D6CF] ${className}`.trim()}>
        <DialogTitle className="text-xl font-medium text-[#191B1D] mb-1">KITTY, in motion.</DialogTitle>
        <DialogDescription className="text-sm text-[#62676D] mb-4 font-light">
          A short look at the KITTY CORP identity.
        </DialogDescription>
        <div className="overflow-hidden rounded-xl border border-[#D9D6CF] bg-black aspect-video relative">
          <video
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster="/brand/kitty-corp-logo-transparent.png"
            className="w-full h-full object-contain"
          >
            <source src="/brand/reveal.mp4" type="video/mp4" />
            Your browser cannot play this video. <a href="/brand/reveal.mp4">Download the film</a>.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
