"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TechnologyMarquee } from "./technology-marquee";
const navigation = [["Services", "/services"], ["Products", "/products"], ["Payments", "/payments"], ["Company", "/company"], ["Build Log", "/build-log"], ["Contact", "/contact"]];
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <TechnologyMarquee mini/>
    <div className="site-header-navigation">
    <Link href="/" className="brand" aria-label="KITTY CORP home"><Image unoptimized loading="eager" src="/brand/monogram-small-v1.webp" alt="" width={36} height={36} /><span>KITTY CORP</span></Link>
    <nav className="navigation" aria-label="Main navigation">{navigation.map(([label, href]) => <Link href={href} key={label} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/projects">Start a project <ArrowUpRight size={15}/></Link>
    <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="menu-toggle" aria-label="Open navigation"><Menu size={22} /></button></DialogTrigger>
      <DialogContent className="mobile-navigation"><DialogTitle>KITTY CORP</DialogTitle><DialogDescription>Services, products and the people behind them.</DialogDescription><nav aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link onClick={() => setOpen(false)} href={href} key={label} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}<Link onClick={() => setOpen(false)} href="/team">Full team</Link><Link onClick={() => setOpen(false)} href="/#early-access">Join early access</Link></nav></DialogContent>
    </Dialog>
    </div>
  </header>;
}
export function FilmButton({ className = "" }: { className?: string }) {
  return <Dialog><DialogTrigger asChild><button className={`film-button ${className}`}><Play size={13} /> Watch the identity film</button></DialogTrigger><DialogContent className="film-dialog"><DialogTitle>KITTY, in motion.</DialogTitle><DialogDescription>A short look at the KITTY CORP identity.</DialogDescription><video controls autoPlay playsInline preload="metadata" poster="/brand/wordmark-v1.webp"><source src="/brand/reveal.mp4" type="video/mp4" />Your browser cannot play this video. <a href="/brand/reveal.mp4">Download the film</a>.</video></DialogContent></Dialog>;
}
