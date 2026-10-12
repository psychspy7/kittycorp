import Image from "next/image";
import { ecosystemCategories, technologyBrands } from "@/lib/technology-ecosystem";
import { TechnologyMarquee } from "./technology-marquee";

export function TechnologyEcosystem() {
  return <section id="technology-ecosystem" className="technology-ecosystem" aria-labelledby="ecosystem-heading"><div className="wrap">
    <div className="ecosystem-intro"><span className="ecosystem-signature"><Image unoptimized src="/brand/monogram-small-v1.webp" alt="" width={24} height={24} loading="lazy"/><span>KITTY CORP / TECHNOLOGY ECOSYSTEM</span></span><h2 id="ecosystem-heading">Powered by technology.<br/>Built with curiosity.</h2><p>From AI models to cloud infrastructure, these are some of the technologies and platforms helping us turn our ideas into real products.</p></div>
    <div className="ecosystem-tracks"><TechnologyMarquee brands={technologyBrands.slice(0,7)}/><TechnologyMarquee brands={technologyBrands.slice(7)} direction="right" controls={false}/></div>
    <details className="ecosystem-categories"><summary>Explore the ecosystem <span aria-hidden="true">+</span></summary><div className="ecosystem-category-grid">{ecosystemCategories.map(category => <div key={category.name}><h3>{category.name}</h3><ul>{category.ids.map(id => {const brand = technologyBrands.find(item => item.id === id)!; return <li key={id}><a href={brand.href} target="_blank" rel="noopener noreferrer">{brand.name} <span aria-hidden="true">↗</span></a></li>;})}</ul></div>)}</div></details>
    <p className="ecosystem-disclosure">KITTY CORP is independent. Tool and platform references describe our workflow. Digital India and Startup India are innovation initiatives shown for reference; their inclusion does not imply recognition, sponsorship or affiliation.</p>
  </div></section>;
}
