"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
const navigation = [["Products", "/#products"], ["Research", "/research"], ["Build Log", "/build-log"], ["About", "/#about"]];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <Link href="/" className="brand" aria-label="KITTY CORP home"><Image unoptimized src="/brand/monogram-small-v1.webp" alt="" width={36} height={36} /><span>KITTY CORP</span></Link>
    <nav className="navigation" aria-label="Main navigation">{navigation.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/#early-access">Join early access</Link>
    <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="menu-toggle" aria-label="Open navigation"><Menu size={22} /></button></DialogTrigger>
      <DialogContent className="mobile-navigation"><DialogTitle>KITTY CORP</DialogTitle><DialogDescription>Explore the company and our work.</DialogDescription><nav aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link onClick={() => setOpen(false)} href={href} key={label}>{label}</Link>)}<Link onClick={() => setOpen(false)} href="/#early-access">Join early access</Link></nav></DialogContent>
    </Dialog>
  </header>;
}
export function FilmButton({ className = "" }: { className?: string }) {
  return <Dialog><DialogTrigger asChild><button className={`film-button ${className}`}><Play size={13} /> Watch the identity film</button></DialogTrigger><DialogContent className="film-dialog"><DialogTitle>KITTY, in motion.</DialogTitle><DialogDescription>A short look at the KITTY CORP identity.</DialogDescription><video controls autoPlay playsInline preload="metadata" poster="/brand/wordmark-v1.webp"><source src="/brand/reveal.mp4" type="video/mp4" />Your browser cannot play this video. <a href="/brand/reveal.mp4">Download the film</a>.</video></DialogContent></Dialog>;
}
export function Hero() {
  return <section className="company-hero wrap" aria-labelledby="hero-title">
    <div className="hero-topline"><span className="eyebrow">INDEPENDENT TECHNOLOGY COMPANY</span><span className="hero-location">Ideas into working things.</span></div>
    <div className="company-hero-grid"><div><h1 id="hero-title">We build technology<br className="desktop-break" /> we actually<br className="desktop-break" /> <span>want to use.</span></h1><p className="hero-description">KITTY CORP is an independent technology company working on personal AI, autonomous systems and intelligent software.</p><div className="hero-actions"><Link className="button button-gold" href="#products">Explore what we’re building</Link><Link className="button button-outline" href="#currently">Follow our progress</Link></div><p className="hero-small-note">Built by a small team. Still early. Shipping constantly.</p></div><div className="company-mark" aria-hidden="true"><Image unoptimized src="/brand/silver-mark-v1.webp" alt="" width={800} height={800} preload /><span>KEEP BUILDING.</span></div></div>
    <div className="hero-baseline"><span>AI / AUTONOMOUS SYSTEMS / INTELLIGENT SOFTWARE</span><FilmButton /></div>
  </section>;
}
