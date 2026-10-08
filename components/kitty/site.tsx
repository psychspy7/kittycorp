"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TechnologyMarquee } from "./technology-marquee";
const navigation = [["Services", "/services"], ["Products", "/products"], ["Company", "/company"], ["Build Log", "/build-log"], ["Contact", "/contact"]];
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
    <Link className="header-cta" href="/services#project-enquiry">Start a project <ArrowUpRight size={15}/></Link>
    <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="menu-toggle" aria-label="Open navigation"><Menu size={22} /></button></DialogTrigger>
      <DialogContent className="mobile-navigation"><DialogTitle>KITTY CORP</DialogTitle><DialogDescription>Services, products and the people behind them.</DialogDescription><nav aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link onClick={() => setOpen(false)} href={href} key={label} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}<Link onClick={() => setOpen(false)} href="/team">Full team</Link><Link onClick={() => setOpen(false)} href="/#early-access">Join early access</Link></nav></DialogContent>
    </Dialog>
    </div>
  </header>;
}
export function FilmButton({ className = "" }: { className?: string }) {
  return <Dialog><DialogTrigger asChild><button className={`film-button ${className}`}><Play size={13} /> Watch the identity film</button></DialogTrigger><DialogContent className="film-dialog"><DialogTitle>KITTY, in motion.</DialogTitle><DialogDescription>A short look at the KITTY CORP identity.</DialogDescription><video controls autoPlay playsInline preload="metadata" poster="/brand/wordmark-v1.webp"><source src="/brand/reveal.mp4" type="video/mp4" />Your browser cannot play this video. <a href="/brand/reveal.mp4">Download the film</a>.</video></DialogContent></Dialog>;
}
export function Hero() {
  return <section className="home-hero wrap" aria-labelledby="hero-title">
    <div className="home-hero-copy"><span className="eyebrow">WEBSITE & APP DEVELOPMENT / KITTY CORP</span><h1 id="hero-title">Your business.<br/><span>Built for the web.</span></h1><p>Need a better website, a tool for your team or an app of your own? We design and build it with you, from the first conversation to a working release.</p><div className="hero-actions"><Link className="button button-gold" href="/services#project-enquiry">Discuss your project <ArrowUpRight size={17}/></Link><Link className="text-link" href="#work">See the work <ArrowUpRight size={16}/></Link></div><p className="hero-small-note">Work directly with the builders. Scope agreed before we start.</p></div>
    <aside className="hero-services" aria-labelledby="hero-services-title"><div className="hero-services-heading"><span className="micro-label">SMALL TEAM. DIRECT ACCESS.</span><span aria-hidden="true">↗</span></div><h2 id="hero-services-title">What do you<br/>need to build?</h2><div className="hero-service-links">{[["01","A business website","Make your offer clear. Give visitors a next step.","/services#websites"],["02","A web application","Replace a manual process or test a product idea.","/services#applications"],["03","An Android app","Bring a useful service to your customers’ phones.","/services#applications"]].map(([number,title,description,href])=><Link key={number} href={href}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={17}/></Link>)}</div><Link className="hero-service-contact" href="/services#project-enquiry">Tell us what you have in mind <ArrowUpRight size={17}/></Link></aside>
  </section>;
}
