"use client";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, Play, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a href="/" className="brand" aria-label="Kitty Corp home">
        <img src="/brand/monogram.png" alt="" width="44" height="44" />
        <span>KITTY CORP</span>
      </a>
      <nav
        className={open ? "navigation is-open" : "navigation"}
        aria-label="Main navigation"
      >
        <a onClick={() => setOpen(false)} href="/#story">
          My story
        </a>
        <a onClick={() => setOpen(false)} href="/#vision">
          The vision
        </a>
        <a onClick={() => setOpen(false)} href="/#kitty-ai">
          Kitty AI <span className="nav-tag">IN THE MAKING</span>
        </a>
        <a onClick={() => setOpen(false)} href="/#updates">
          Updates
        </a>
      </nav>
      <a className="header-cta" href="/contact">
        Let’s talk <ArrowUpRight size={16} />
      </a>
      <button
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
export function FilmButton({ className = "" }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`film-button ${className}`}>
          <span className="play-circle">
            <Play size={13} fill="currentColor" />
          </span>
          <span>
            Watch the reveal
            <span className="film-caption">A FIRST LOOK AT KITTY CORP</span>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="film-dialog">
        <DialogTitle>The beginning of Kitty Corp.</DialogTitle>
        <DialogDescription>The Kitty Corp identity, in motion.</DialogDescription>
        <video
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster="/brand/wordmark.png"
        >
          <source src="/brand/reveal.mp4" type="video/mp4" />
          Your browser cannot play this video.{" "}
          <a href="/brand/reveal.mp4">Download the reveal film</a>.
        </video>
      </DialogContent>
    </Dialog>
  );
}
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-aura" aria-hidden="true" />
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="tiny-star">✳</span> INDEPENDENT MINDS. UNLIMITED
          POSSIBILITIES.
        </div>
        <h1 id="hero-title">
          Building
          <br />
          what comes
          <br />
          <em>next.</em>
          <span className="heading-star" aria-hidden="true">
            ✳
          </span>
        </h1>
        <p className="hero-description">
          A solo founder with a restless imagination.
          <br />
          Turning bold ideas into things that matter.
        </p>
        <div className="hero-actions">
          <a className="button button-gold" href="#kitty-ai">
            Explore what’s next <ArrowUpRight size={18} />
          </a>
          <FilmButton />
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbital orbital-one" />
        <div className="orbital orbital-two" />
        <span className="art-cross cross-one">+</span>
        <span className="art-cross cross-two">+</span>
        <div className="monogram-stage">
          <img
            className="hero-monogram"
            src="/brand/monogram.png"
            alt=""
            width="1024"
            height="1024"
            fetchPriority="high"
          />
        </div>
        <span className="art-coordinate">KC—001 / AN IDEA TAKES SHAPE</span>
        <span className="art-side">BUILT ON CURIOSITY.</span>
      </div>
      <div className="hero-bottom">
        <a href="#story" className="scroll-cue">
          <ArrowDown size={16} /> SCROLL TO DISCOVER
        </a>
        <span className="hero-note">
          One founder. Big vision. <span>Real work in progress.</span>
        </span>
        <span className="edition">EST. 2026</span>
      </div>
    </section>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <a className="brand" href="/">
          <img src="/brand/monogram.png" alt="" width="40" height="40" />
          <span>KITTY CORP</span>
        </a>
        <p>Curiosity is the starting point.</p>
        <a href="/contact">
          Say hello <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kitty Corp</span>
        <span>Independently built. Always in progress.</span>
        <a href="/admins">
          Studio access <ArrowUpRight size={12} />
        </a>
      </div>
    </footer>
  );
}
