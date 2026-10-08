"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { technologyBrands } from "@/lib/technology-ecosystem";
import { useLogoMotion } from "./logo-motion";

export function TechnologyMarquee({mini = false}: {mini?: boolean}) {
  const {paused, toggle} = useLogoMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(mini);
  useEffect(() => {
    if (mini || !viewport.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {rootMargin: "100px"});
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, [mini]);
  const isPaused = paused || !visible;
  function group(duplicate: boolean) {
    return <div className="technology-marquee-group" aria-hidden={duplicate || mini ? true : undefined}>
      {technologyBrands.map(brand => <a className={`technology-logo ${brand.wordmark ? "is-wordmark" : ""} ${brand.id === "kitty" ? "is-kitty" : ""}`} key={brand.id} href={brand.href} target="_blank" rel="noopener noreferrer" tabIndex={duplicate || mini ? -1 : undefined} onMouseDown={duplicate || mini ? event => event.preventDefault() : undefined} aria-label={`${brand.name} official website`} title={brand.name}>
        <Image className="technology-logo-image" unoptimized src={brand.src} alt="" width={brand.width} height={brand.height} loading={mini ? "eager" : "lazy"} decoding="async"/>
        {!brand.wordmark && <span className="technology-logo-name">{brand.name}</span>}
      </a>)}
    </div>;
  }
  return <div className={`technology-marquee-region ${mini ? "technology-marquee-mini" : "technology-marquee-full"}`}>
    <div className="technology-marquee-viewport" ref={viewport} aria-label={mini ? undefined : "Technology platforms and innovation initiatives"}>
      <div className={`technology-marquee-track ${isPaused ? "is-paused" : ""} ${visible ? "is-visible" : ""}`}>{group(false)}{group(true)}</div>
    </div>
    <button className="logo-motion-button" type="button" onClick={toggle} aria-label={paused ? "Resume logo animations" : "Pause logo animations"} aria-pressed={paused} title={paused ? "Resume logo animations" : "Pause logo animations"}>
      {paused ? <Play size={mini ? 11 : 14} aria-hidden="true"/> : <Pause size={mini ? 11 : 14} aria-hidden="true"/>}{!mini && <span>{paused ? "Resume animation" : "Pause animation"}</span>}
    </button>
  </div>;
}
