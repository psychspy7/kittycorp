import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, AudioLines, Cpu, FolderOpen, FlaskConical, UserRound, ShieldCheck } from "lucide-react";
import { AssistantEntry } from "./assistant-entry";
import { AppIcon } from "./secretchat";
import type { Launch } from "@/lib/launches";
import { launchHref } from "@/lib/launches";
import { mediaHref, type CompanyProduct } from "@/lib/company-content";

export function FinalHero({ assistantEnabled }: { assistantEnabled: boolean }) {
  return (
    <section className="final-hero wrap" aria-labelledby="hero-title">
      <div className="final-hero-copy">
        <span className="eyebrow">KITTY CORP / INDEPENDENT TECHNOLOGY STUDIO</span>
        <h1 id="hero-title">
          We build the technology<br />
          <span>behind your next move.</span>
        </h1>
        <p>
          KITTY CORP designs, engineers and deploys websites, intelligent AI systems and business automation that help businesses move forward.
        </p>
        <div className="hero-actions">
          <Link className="button button-gold" href="/projects" data-conversion="service_cta" data-context="home">
            Start a project <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <a className="button button-outline" href="#services" data-conversion="service_cta" data-context="home">
            Explore our capabilities <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <nav className="hero-quick-links" aria-label="Project planning">
          <Link href="/pricing">View fixed packages <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <Link href="/appointments">Schedule strategy call <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <Link href="/projects">Inspect client case studies <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </nav>
        <div className="final-hero-notes">
          <span><Check size={15} aria-hidden="true" />Direct engineering access</span>
          <span><Check size={15} aria-hidden="true" />Fixed quote before development</span>
          <span><Check size={15} aria-hidden="true" />6-month inclusive maintenance</span>
        </div>
      </div>
      <div className="hero-guide">
        <div className="hero-guide-top">
          <span className="micro-label">STUDIO CAPABILITY MATRIX</span>
          <span className="guide-status">{assistantEnabled ? "KITTY ASSIST" : "ENTERPRISE SPEC"}</span>
        </div>
        <div className="hero-guide-brand">
          <Image src="/brand/silver-mark-v1.webp" sizes="145px" alt="KITTY CORP monogram" width={170} height={170} priority />
        </div>
        <h2>Architected for speed, clarity and conversion.</h2>
        <p>
          {assistantEnabled
            ? "Explore technical requirements with KITTY. We clarify architecture and scope; our engineering team validates the final deliverable."
            : "From high-conversion landing systems to complex internal portals, we construct robust software delivered with clean source code and complete client ownership."}
        </p>
        {assistantEnabled ? (
          <div className="hero-guide-prompts">
            <AssistantEntry className="guide-prompt" question="I need a modern, high-converting business website. What architecture and scope do you recommend?">
              Plan a modern web platform
            </AssistantEntry>
            <AssistantEntry className="guide-prompt" question="How can we implement practical workflow automation with humans approving critical steps?">
              Explore automated workflows
            </AssistantEntry>
          </div>
        ) : (
          <Link className="guide-prompt" href="/projects">
            Request an engineering proposal <ArrowUpRight size={17} />
          </Link>
        )}
        <div className="hero-guide-bottom">
          <ShieldCheck size={15} aria-hidden="true" />
          <span>Full IP &amp; repository handover. Agreed timeline and scope before code is committed.</span>
        </div>
      </div>
    </section>
  );
}

export function FlagshipCollection({ launches, products }: { launches: Launch[]; products: CompanyProduct[] }) {
  const kitty = launches.find(item => item.slug === "kitty-ai");
  const kittyProduct = products.find(item => item.slug === "kitty-ai");
  const lisa = products.find(item => item.slug === "lisa-ai");
  const icon = (product: CompanyProduct | undefined, fallback: React.ReactNode) => product?.icon_path ? <Image unoptimized src={mediaHref(product.icon_path)} width={48} height={48} alt="" /> : fallback;
  return (
    <section id="products" className="final-products wrap" aria-labelledby="flagship-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">INDEPENDENT LABS</span>
          <h2 id="flagship-heading">Proprietary products &amp; software.</h2>
        </div>
        <Link className="text-link" href="/products">
          All products &amp; releases <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="final-product-grid">
        <article className="final-product kitty-product">
          <div className="final-product-top">
            <span className="final-product-icon">{kitty ? <AppIcon launch={kitty} size={48} /> : icon(kittyProduct, <Cpu size={27} />)}</span>
            <span className="quiet-status">{kitty ? `ANDROID / V${kitty.version}` : "ANDROID RELEASE"}</span>
          </div>
          <span className="product-index">01 / MOBILE AI</span>
          <h3>KITTY AI</h3>
          <p>{kittyProduct?.description || "An intelligent mobile personal AI system with on-device memory, contextual awareness, and secure local storage."}</p>
          <ul>
            <li><Check size={15} />Local device memory and privacy preservation</li>
            <li><Check size={15} />Direct conversational voice engine</li>
            <li><Check size={15} />Free tier with optional enhanced quota</li>
          </ul>
          <div className="final-product-actions">
            <Link className="button button-gold" href="/kitty-ai">Explore KITTY AI <ArrowUpRight size={16} /></Link>
            <Link className="text-link" href="/memberships">Membership Plans <ArrowUpRight size={16} /></Link>
          </div>
          {kitty && <Link className="final-release-link" href={launchHref(kitty)}>Release notes &amp; Android APK <ArrowUpRight size={14} /></Link>}
        </article>
        <article className="final-product lisa-product">
          <div className="final-product-top">
            <span className="final-product-icon">{icon(lisa, <AudioLines size={27} />)}</span>
            <span className="quiet-status">DESKTOP COMPANION</span>
          </div>
          <span className="product-index">02 / INTERACTIVE AGENT</span>
          <h3>LISA AI</h3>
          <p>An interactive on-screen companion engineered with spatial awareness, expressive visual character design, and localized natural voice synthesis.</p>
          <div className="lisa-work-preview">
            <Image src="/lisa/lisa-character-2d-v1.webp" alt="LISA illustrated visual character design" width={600} height={400} loading="lazy" />
            <span>LISA / 2D SPATIAL CHARACTER</span>
          </div>
          <div className="final-product-actions">
            <Link className="button button-outline" href="/lisa-ai">Inspect LISA Build <ArrowUpRight size={16} /></Link>
            <Link className="text-link" href="/lisa-ai#lisa-plans-heading">Edition details <ArrowUpRight size={16} /></Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export function QuickDestinations() {
  return (
    <section className="final-destinations wrap" aria-label="Explore KITTY CORP">
      {[
        { icon: FolderOpen, title: "Shipped Software & Products", description: "SecretChat, EXAMIFY and production releases.", href: "/products" },
        { icon: FlaskConical, title: "Engineering Lab & Research", description: "Experimental robotics, computer vision, and applied AI systems.", href: "/research" },
        { icon: UserRound, title: "Client Account Portal", description: "Monitor project milestones, quotes, and deployment assets.", href: "/account" }
      ].map(({ icon: Icon, title, description, href }) => (
        <Link key={href} href={href}>
          <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      ))}
    </section>
  );
}

export function HelpfulAnswers() {
  return (
    <section className="final-faq wrap" aria-labelledby="faq-heading">
      <div>
        <span className="eyebrow">TRANSPARENT COLLABORATION</span>
        <h2 id="faq-heading">Frequently asked questions.</h2>
        <p>
          Have a specific technical question?<br />
          <Link className="text-link" href="/contact">Speak directly with an engineer <ArrowUpRight size={15} /></Link>
        </p>
      </div>
      <div>
        {[
          ["Do I need a finalized technical specification before reaching out?", "No. A plain-language summary of what you want to achieve, who your users are, and any core system integrations is sufficient. We conduct a preliminary technical review to establish exact scope, deliverables, and architecture before agreeing to a price."],
          ["How do billing milestones and project payment work?", "Every project receives an immutable, itemized project quote outlining milestones, timelines, and payment options. Full advance receives a 2.5% reduction; two-stage installment options (half upon project kickoff, half on staging verification) are available. All amounts and terms are agreed upfront."],
          ["What production maintenance and support is included?", "All qualifying bespoke development includes six months of complimentary production maintenance, covering bug fixes, security patch updates, and baseline monitoring within the project scope. Additional extended SLAs and hosting oversight are available."],
          ["Who owns the code, intellectual property, and infrastructure?", "You retain 100% ownership of your proprietary source code, assets, database, and deployments upon milestone settlement. We assist with complete deployment to your designated cloud provider (Vercel, Cloud Run, Firebase, AWS) with full administrative handover."],
          ["How can I track project progress in real time?", "Connect your verified Google account in the client portal to view project milestones, staging links, payment receipts, and direct builder communications. Guest submissions receive a cryptographically signed direct link."]
        ].map(([question, answer]) => (
          <details key={question}>
            <summary>{question}<span aria-hidden="true">+</span></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
