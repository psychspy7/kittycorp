import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Cpu, FolderOpen, FlaskConical, UserRound, ShieldCheck } from "lucide-react";
import { mediaHref, type CompanyProduct } from "@/lib/company-content";

export function FinalHero(_props?: { assistantEnabled?: boolean }) {
  return <section className="final-hero wrap" aria-labelledby="hero-title">
    <div className="final-hero-copy">
      <span className="eyebrow">KITTY CORP · PHYSICAL-WORLD ENGINEERING</span>
      <h1>Intelligence that<br/>works beyond screens.</h1>
      <p>We develop robotics, agricultural systems and clean-energy engineering, alongside commercial digital solutions that support our research.</p>
      <div className="hero-actions"><Link className="button button-gold" href="/projects">Explore our initiatives <ArrowUpRight size={17} aria-hidden="true" /></Link><a className="button button-outline" href="https://demo.thekittycorp.com" target="_blank" rel="noopener noreferrer">Digital Solutions Studio <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      <div className="final-hero-notes"><span><Check size={15} aria-hidden="true" />Engineering-led development</span><span><Check size={15} aria-hidden="true" />Research and practical testing</span></div>
    </div>
    <div className="hero-guide">
      <div className="hero-guide-top"><span className="micro-label">OUR DIRECTION</span><span className="guide-status">PHYSICAL SYSTEMS</span></div>
      <div className="hero-guide-brand"><Image src="/brand/silver-mark-v1.webp" sizes="145px" alt="KITTY CORP" width={190} height={190} priority /></div>
      <h2>Build for the<br/>real world.</h2>
      <p>Our focus is on machines and software that help people work with agriculture, energy and physical environments.</p>
      <Link className="guide-prompt" href="/research">Explore our research <ArrowUpRight size={17} /></Link>
      <div className="hero-guide-bottom"><ShieldCheck size={14} aria-hidden="true" /><span>We distinguish concepts, prototypes and deployed systems.</span></div>
    </div>
  </section>;
}

export function FlagshipCollection({ products }: { products: CompanyProduct[]; launches?: unknown[] }) {
  const agriyaanProduct = products.find(item => item.slug === "agriyaan");
  const urjayaanProduct = products.find(item => item.slug === "urjayaan");
  const icon = (product: CompanyProduct | undefined, fallback: ReactNode) => product?.icon_path ? <Image unoptimized src={mediaHref(product.icon_path)} width={48} height={48} alt="" /> : fallback;
  return <section id="initiatives" className="final-products wrap" aria-labelledby="flagship-heading">
    <div className="section-heading"><div><span className="eyebrow">OUR ENGINEERING INITIATIVES</span><h2 id="flagship-heading">Physical-world systems.</h2></div><Link className="text-link" href="/projects">Explore initiatives <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    <div className="final-product-grid">
      <article className="final-product agriyaan-product">
        <div className="final-product-top"><span className="final-product-icon">{icon(agriyaanProduct, <Cpu size={27} />)}</span><span className="quiet-status">AGRICULTURAL ROBOTICS</span></div>
        <span className="product-index">PRECISION AGRICULTURE</span><h3>KITTY AgriYaan</h3><p>Autonomous agricultural robotics for crop monitoring, field scouting and resilient operations.</p>
        <ul><li><Check size={15} />Field navigation research</li><li><Check size={15} />Crop monitoring systems</li><li><Check size={15} />Edge-based perception</li></ul>
        <div className="final-product-actions"><Link className="button button-outline" href="/agriyaan">Explore AgriYaan <ArrowUpRight size={16} /></Link></div>
      </article>
      <article className="final-product urjayaan-product">
        <div className="final-product-top"><span className="final-product-icon">{icon(urjayaanProduct, <Cpu size={27} />)}</span><span className="quiet-status">CLEAN ENERGY SYSTEMS</span></div>
        <span className="product-index">ENERGY INTELLIGENCE</span><h3>KITTY UrjaYaan</h3><p>Software and engineering research for solar telemetry, equipment diagnostics and clean-energy optimization.</p>
        <ul><li><Check size={15} />Solar performance monitoring</li><li><Check size={15} />Predictive diagnostics</li><li><Check size={15} />Energy utilization research</li></ul>
        <div className="final-product-actions"><Link className="button button-outline" href="/urjayaan">Explore UrjaYaan <ArrowUpRight size={16} /></Link></div>
      </article>
    </div>
  </section>;
}

export function QuickDestinations() {
  return <section className="final-destinations wrap" aria-label="More from KITTY CORP">
    {[{ icon: FolderOpen, title: "Research projects", description: "Our engineering initiatives and prototypes.", href: "/projects" }, { icon: FlaskConical, title: "Inside the lab", description: "Research, robotics and experiments in progress.", href: "/research" }, { icon: UserRound, title: "Company & team", description: "The people and mission behind KITTY CORP.", href: "/company" }].map(({ icon: Icon, title, description, href }) => <Link key={href} href={href}><Icon size={23} strokeWidth={1.5} aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={18} aria-hidden="true" /></Link>)}
  </section>;
}

export function HelpfulAnswers() {
  return <section data-element="lightning" className="final-faq wrap" aria-labelledby="faq-heading"><div><span className="eyebrow">ABOUT KITTY CORP</span><h2 id="faq-heading">A few useful answers.</h2><p>Have something else in mind?<br/><Link className="text-link" href="/contact">Talk to us <ArrowUpRight size={15} /></Link></p></div><div>
    {[["What does KITTY CORP work on?", "Our focus is physical-world engineering: agricultural robotics, clean-energy systems, embedded computing and applied research."], ["Are the initiatives available now?", "Some are concepts or prototypes in development. We describe their stage on each initiative page and do not present research as a deployed product."], ["What is the Digital Solutions Studio?", "It is our commercial software work for businesses. Visit demo.thekittycorp.com to see the business website and examples."], ["How can I collaborate?", "We welcome conversations with researchers, agricultural operators, clean-energy teams, engineers and potential partners. Contact us with your idea or context." ]].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
  </div></section>;
}
