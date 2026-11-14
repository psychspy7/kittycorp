import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Code2,
  Globe2,
  Leaf,
  Radio,
  Smartphone,
  Sparkles,
  Sun,
  Workflow,
} from "lucide-react";
import type { SitePageContent } from "@/lib/site-page-content";

const projects = [
  {
    number: "01",
    name: "AGRIYAAN",
    discipline: "AGRICULTURAL ROBOTICS",
    status: "IN DEVELOPMENT",
    icon: Leaf,
    description:
      "An autonomous field-robotics platform exploring crop monitoring, terrain mobility and practical AI for everyday agricultural work.",
    detail: "Autonomous rover · crop intelligence",
    tone: "agri",
  },
  {
    number: "02",
    name: "URJAYAAN",
    discipline: "SOLAR & ENERGY INTELLIGENCE",
    status: "CONCEPT DEVELOPMENT",
    icon: Sun,
    description:
      "An intelligent solar-energy direction focused on monitoring, smarter utilisation and extending the useful life of solar infrastructure.",
    detail: "Solar monitoring · energy optimisation",
    tone: "urja",
  },
  {
    number: "03",
    name: "KITTY BUDDY AI",
    discipline: "POCKET AI COMPANION",
    status: "IN DEVELOPMENT",
    icon: Bot,
    description:
      "A compact, voice-first AI companion that brings useful intelligence beyond the phone through connected hardware and software.",
    detail: "Pocket device · voice-first interaction",
    tone: "buddy",
  },
];

const ecosystem = [
  {
    name: "Examify",
    type: "EDUCATION",
    note: "COMPLETELY FREE FOR STUDENTS",
    description: "A simple place for students to prepare, practise and keep learning.",
    href: "/products",
    icon: Sparkles,
  },
  {
    name: "KITTY AI",
    type: "AI ASSISTANT",
    note: "INTELLIGENCE PLATFORM",
    description: "A conversational AI assistant built to make everyday digital tasks easier.",
    href: "/kitty-ai",
    icon: Bot,
  },
  {
    name: "UltraLink",
    type: "ACOUSTIC COMMUNICATION",
    note: "PROTOCOL R&D",
    description: "Experimental near-ultrasonic communication for short-range data transfer.",
    href: "/research",
    icon: Radio,
  },
  {
    name: "SecretChat",
    type: "PRIVATE COMMUNICATION",
    note: "MESSAGING PRODUCT",
    description: "A privacy-minded messaging experience with a dedicated Android release.",
    href: "/secretchat",
    icon: Code2,
  },
];

export function ObsidianHero({ copy }: { copy: SitePageContent }) {
  return (
    <section className="obsidian-hero page-gutter" aria-labelledby="obsidian-title" data-element="lightning">
      <div className="obsidian-hero-copy">
        <div className="obsidian-eyebrow"><span className="obsidian-pulse" /> INDEPENDENT TECHNOLOGY COMPANY · EST. 2026</div>
        <h1 id="obsidian-title">{copy.heroTitle}<br /><em>{copy.heroAccent}</em></h1>
        <p>{copy.heroDescription}</p>
        <div className="obsidian-actions">
          <Link className="obsidian-button obsidian-button-primary" href="/services">
            Explore services <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <Link className="obsidian-button obsidian-button-quiet" href="#intelligence-robotics">
            See what we&apos;re building <ArrowDownRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="obsidian-hero-bottomline" aria-label="KITTY CORP focus areas">
          <span><b>01</b> Software &amp; digital products</span>
          <span><b>02</b> Applied AI</span>
          <span><b>03</b> Robotics &amp; energy systems</span>
        </div>
      </div>
    </section>
  );
}

export function ObsidianServices({ copy }: { copy: SitePageContent }) {
  const services = [
    { icon: Globe2, number: "01", title: copy.websiteCapabilityTitle, text: copy.websiteCapabilityDescription, meta: "WEB DESIGN / DEVELOPMENT" },
    { icon: Smartphone, number: "02", title: copy.softwareCapabilityTitle, text: copy.softwareCapabilityDescription, meta: "FULL-STACK / ANDROID" },
    { icon: Workflow, number: "03", title: copy.automationCapabilityTitle, text: copy.automationCapabilityDescription, meta: "AI AGENTS / WORKFLOWS" },
    { icon: Sparkles, number: "04", title: "KITTY One", text: "A joined-up digital foundation combining a polished website, useful workflows and the tools a growing business needs.", meta: "BUNDLED DIGITAL SOLUTION" },
  ];
  return (
    <section id="digital-solutions" className="obsidian-services page-gutter" aria-labelledby="obsidian-services-title" data-element="water">
      <div className="obsidian-section-heading">
        <div><span className="obsidian-label">01 / DIGITAL SOLUTIONS</span><h2 id="obsidian-services-title">Make the digital<br /><em>side work harder.</em></h2></div>
        <p>From the first customer touchpoint to the software behind the operation, we build digital tools with a clear job to do.</p>
      </div>
      <div className="obsidian-service-grid">
        {services.map(({ icon: Icon, number, title, text, meta }) => (
          <article className="obsidian-service-card" key={number}>
            <div className="obsidian-card-top"><span>{number}</span><Icon size={21} strokeWidth={1.5} /></div>
            <div><span className="obsidian-card-meta">{meta}</span><h3>{title}</h3><p>{text}</p></div>
            <Link href="/services" aria-label={"Explore " + title}><ArrowUpRight size={17} /></Link>
          </article>
        ))}
      </div>
      <div className="obsidian-services-foot"><span>BUILT AROUND YOUR BUSINESS, NOT A TEMPLATE.</span><Link href="/services">View all services <ArrowUpRight size={15} /></Link></div>
    </section>
  );
}

export function ObsidianLab() {
  return (
    <section id="intelligence-robotics" className="obsidian-lab page-gutter" aria-labelledby="obsidian-lab-title" data-element="fire">
      <div className="obsidian-section-heading">
        <div><span className="obsidian-label obsidian-label-blue">02 / PRODUCTS IN DEVELOPMENT</span><h2 id="obsidian-lab-title">Ideas made<br /><em>to leave the screen.</em></h2></div>
        <p>Three directions we&apos;re actively exploring across agriculture, energy and personal AI. Each project is shown at its current stage — no inflated launch claims.</p>
      </div>
      <div className="obsidian-lab-grid">
        {projects.map(({ number, name, discipline, status, icon: Icon, description, detail, tone }) => (
          <article className={"obsidian-lab-card " + tone} key={name}>
            <div className="obsidian-lab-art" aria-hidden="true">
              <div className="lab-art-grid" />
              <div className="lab-art-orbit lab-art-orbit-a" />
              <div className="lab-art-orbit lab-art-orbit-b" />
              <div className="lab-art-symbol"><Icon size={48} strokeWidth={1} /></div>
              <span className="lab-art-index">{number} / 03</span>
              <span className="lab-art-status">{status}</span>
            </div>
            <div className="obsidian-lab-copy">
              <div className="obsidian-card-meta"><span>{discipline}</span><span>{status}</span></div>
              <h3>{name}</h3>
              <p>{description}</p>
              <span className="obsidian-lab-detail">{detail}</span>
              <Link href="/research">Project details <ArrowUpRight size={15} /></Link>
            </div>
          </article>
        ))}
      </div>
      <div className="obsidian-lab-foot"><span>BUILDING · TESTING · LEARNING</span><Link href="/research">Explore our research <ArrowUpRight size={15} /></Link></div>
    </section>
  );
}

export function ObsidianEcosystem() {
  return (
    <section id="ecosystem" className="obsidian-ecosystem page-gutter" aria-labelledby="obsidian-ecosystem-title" data-element="water">
      <div className="obsidian-section-heading">
        <div><span className="obsidian-label">03 / DIGITAL ECOSYSTEM</span><h2 id="obsidian-ecosystem-title">Useful tools.<br /><em>Open to everyone.</em></h2></div>
        <p>A compact collection of products and experiments from across the KITTY ecosystem.</p>
      </div>
      <div className="obsidian-ecosystem-list">
        {ecosystem.map(({ name, type, note, description, href, icon: Icon }) => (
          <Link className="obsidian-ecosystem-row" href={href} key={name}>
            <span className="obsidian-ecosystem-icon"><Icon size={19} strokeWidth={1.6} /></span>
            <span className="obsidian-ecosystem-main">
              <span className="obsidian-card-meta">{type}</span>
              <strong>{name}</strong>
            </span>
            <span className="obsidian-ecosystem-description">{description}</span>
            <span className="obsidian-ecosystem-note">{note}</span>
            <ArrowUpRight className="obsidian-ecosystem-arrow" size={17} />
          </Link>
        ))}
      </div>
    </section>
  );
}
