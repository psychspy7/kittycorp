import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, AudioLines, Cpu, FolderOpen, FlaskConical, UserRound, ShieldCheck } from "lucide-react";
import { AssistantEntry } from "./assistant-entry";
import { AppIcon } from "./secretchat";
import type { Launch } from "@/lib/launches";
import { launchHref } from "@/lib/launches";
import { mediaHref, type CompanyProduct } from "@/lib/company-content";

export function FinalHero({ assistantEnabled }: { assistantEnabled: boolean }) {
  return <section className="final-hero wrap" aria-labelledby="hero-title">
    <div className="final-hero-copy">
      <span className="eyebrow">KITTY CORP / INDEPENDENT TECHNOLOGY</span>
      <h1 id="hero-title">Better websites.<br />Smarter workflows.<br /><span>Built for your business.</span></h1>
      <p>We work directly with businesses to design, develop and maintain websites, applications and practical AI automation. Tell us what needs to work better; we’ll help you decide what to build.</p>
      <div className="hero-actions"><Link className="button button-gold" href="/projects" data-conversion="service_cta" data-context="home">Discuss Your Project <ArrowUpRight size={17} aria-hidden="true" /></Link><Link className="button button-outline" href="#work" data-conversion="portfolio_view" data-context="home">View our work <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      <div className="final-hero-notes"><span><Check size={15} aria-hidden="true" />Free first conversation</span><span><Check size={15} aria-hidden="true" />Direct contact with the builders</span></div>
    </div>
    <div className="hero-guide">
      <div className="hero-guide-top"><span className="micro-label">PLAN YOUR NEXT STEP</span><span className="guide-status">{assistantEnabled ? "KITTY AI" : "PROJECT PLANNING"}</span></div>
      <div className="hero-guide-brand"><Image src="/brand/silver-mark-v1.webp" sizes="145px" alt="KITTY CORP" width={190} height={190} priority /></div>
      <h2>What would make<br />your work easier?</h2>
      <p>{assistantEnabled ? "Use KITTY to explore the shape of your project. It can suggest questions; the team confirms the scope and quote." : "Start with your goal, your customers and the task that needs to improve. We’ll discuss the options with you."}</p>
      {assistantEnabled ? <div className="hero-guide-prompts"><AssistantEntry className="guide-prompt" question="I need a website for my business. Help me figure out what to include.">Help me plan a website</AssistantEntry><AssistantEntry className="guide-prompt" question="How could an AI agent help organise business enquiries, with a person approving important actions?">Explore a business workflow</AssistantEntry></div> : <Link className="guide-prompt" href="/projects">Discuss your project <ArrowUpRight size={17} /></Link>}
      <div className="hero-guide-bottom"><ShieldCheck size={14} aria-hidden="true" /><span>{assistantEnabled ? "No account needed. Share ideas, not private details." : "Scope, cost and timing are agreed before development."}</span></div>
    </div>
  </section>;
}

export function FlagshipCollection({ launches, products }: { launches: Launch[]; products: CompanyProduct[] }) {
  const kitty = launches.find(item => item.slug === "kitty-ai");
  const kittyProduct = products.find(item => item.slug === "kitty-ai");
  const lisa = products.find(item => item.slug === "lisa-ai");
  const icon = (product: CompanyProduct | undefined, fallback: React.ReactNode) => product?.icon_path ? <Image unoptimized src={mediaHref(product.icon_path)} width={48} height={48} alt="" /> : fallback;
  return <section id="products" className="final-products wrap" aria-labelledby="flagship-heading">
    <div className="section-heading"><div><span className="eyebrow">OUR OWN PRODUCTS</span><h2 id="flagship-heading">Two ways to make AI personal.</h2></div><Link className="text-link" href="/products">All products &amp; shipped work <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    <div className="final-product-grid">
      <article className="final-product kitty-product">
        <div className="final-product-top"><span className="final-product-icon">{kitty ? <AppIcon launch={kitty} size={48} /> : icon(kittyProduct, <Cpu size={27} />)}</span><span className="quiet-status">{kitty ? `ANDROID / V${kitty.version}` : "ANDROID APP"}</span></div>
        <span className="product-index">01 / PERSONAL AI</span><h3>KITTY AI</h3><p>{kittyProduct?.description || "A personal AI app for conversations, voice and the things you want it to remember."}</p>
        <ul><li><Check size={15} />Personal memory and saved context</li><li><Check size={15} />Chat history stays on your device</li><li><Check size={15} />A free daily window to get started</li></ul>
        <div className="final-product-actions"><Link className="button button-gold" href="/kitty-ai">Explore KITTY AI <ArrowUpRight size={16} /></Link><Link className="text-link" href="/memberships">Free &amp; Plus plans <ArrowUpRight size={16} /></Link></div>
        {kitty && <Link className="final-release-link" href={launchHref(kitty)}>Release notes &amp; Android download <ArrowUpRight size={14} /></Link>}
      </article>
      <article className="final-product lisa-product">
        <div className="final-product-top"><span className="final-product-icon">{icon(lisa, <AudioLines size={27} />)}</span><span className="quiet-status">WINDOWS COMPANION</span></div>
        <span className="product-index">02 / ON-SCREEN AI</span><h3>LISA AI</h3><p>An illustrated AI character for your desktop, with conversation, voice and a room to explore. Meet LISA and see what the current build can do.</p>
        <div className="lisa-work-preview"><Image src="/lisa/lisa-character-2d-v1.webp" alt="Illustrated LISA character artwork" width={600} height={400} loading="lazy" /><span>LISA / 2D CHARACTER ART</span></div>
        <div className="final-product-actions"><Link className="button button-outline" href="/lisa-ai">Meet LISA <ArrowUpRight size={16} /></Link><Link className="text-link" href="/lisa-ai#lisa-plans-heading">$99 purchase details <ArrowUpRight size={16} /></Link></div>
      </article>
    </div>
  </section>;
}

export function QuickDestinations() {
  return <section className="final-destinations wrap" aria-label="More from KITTY CORP">
    {[{ icon: FolderOpen, title: "Products & shipped work", description: "SecretChat, EXAMIFY and our published releases.", href: "/products" }, { icon: FlaskConical, title: "Inside the lab", description: "Research, robotics and experiments in progress.", href: "/research" }, { icon: UserRound, title: "Your KITTY account", description: "Track project requests, payments and product access.", href: "/account" }].map(({ icon: Icon, title, description, href }) => <Link key={href} href={href}><Icon size={23} strokeWidth={1.5} aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={18} aria-hidden="true" /></Link>)}
  </section>;
}

export function HelpfulAnswers() {
  return <section className="final-faq wrap" aria-labelledby="faq-heading"><div><span className="eyebrow">BEFORE WE START</span><h2 id="faq-heading">A few useful answers.</h2><p>Have something else in mind?<br /><Link className="text-link" href="/contact">Talk to us <ArrowUpRight size={15} /></Link></p></div><div>
    {[["Do I need a finished brief?", "No. Tell us what your business does, who the software is for and what you want it to help with. We’ll review the request before agreeing the scope, price and timing."], ["How do project payments work?", "Review the quote attached to your project before paying. Full advance has a 2.5% discount; new half-and-half requests have a 1% discount. These choices are discussed after qualification. Your quote page shows the exact amount, milestones and conditions."], ["What maintenance is included?", "Eligible projects include six months of agreed maintenance. A successful paid referral adds three months. New features, domains, hosting and API costs are separate."], ["Are all KITTY products available now?", "KITTY AI and SecretChat have Android releases. LISA has a $99 assisted purchase offer; installer delivery and activation are confirmed before payment. Earlier reservations keep their accepted terms. Sentinel is a physical prototype in the lab."], ["Can I track my request?", "Yes. Connect Google under the form’s optional context section before submitting to see the request in your account. Older guest requests use their private project link; keep that link safe."]].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
  </div></section>;
}
