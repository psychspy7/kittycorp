import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  Bot,
  Code2,
  Cpu,
  Globe2,
  Leaf,
  Radio,
  Smartphone,
  Sparkles,
  Sun,
  Workflow,
} from "lucide-react";
import type { SitePageContent } from "@/lib/site-page-content";

const labs = [
  {
    number: "01",
    name: "AGRIYAAN",
    discipline: "AGRICULTURAL ROBOTICS",
    status: "RESEARCH CONCEPT",
    icon: Leaf,
    description:
      "A field-oriented autonomous rover concept exploring crop monitoring, modular mobility and practical machine intelligence for agriculture.",
    detail: "3D-printable platform · ESP32 control experiments",
    tone: "agri",
  },
  {
    number: "02",
    name: "ULTRALINK",
    discipline: "ACOUSTIC COMMUNICATION",
    status: "PROTOCOL R&D",
    icon: Radio,
    description:
      "An experimental near-ultrasonic acoustic communication protocol investigating short-range data transfer through sound.",
    detail: "17–19 kHz research band · experimental",
    tone: "signal",
  },
  {
    number: "03",
    name: "LISA AI",
    discipline: "PERSONAL INTELLIGENCE",
    status: "IN DEVELOPMENT",
    icon: Bot,
    description:
      "A personal AI companion direction focused on natural interaction, useful assistance and a more tangible relationship with software.",
    detail: "Voice-first companion · assisted availability",
    tone: "lisa",
  },
];

const ecosystem = [
  {
    name: "Examify",
    type: "EDUCATION",
    description: "A focused digital learning and exam-preparation experience.",
    href: "/products",
    icon: Sparkles,
  },
  {
    name: "SecretChat",
    type: "PRIVATE COMMUNICATION",
    description: "A privacy-minded messaging product with a dedicated Android release.",
    href: "/secretchat",
    icon: Radio,
  },
  {
    name: "KITTY AI",
    type: "AI ASSISTANT",
    description: "The intelligence layer behind a more useful, conversational KITTY experience.",
    href: "/kitty-ai",
    icon: Bot,
  },
  {
    name: "Hydra",
    type: "DEVELOPER TOOLING",
    description: "An open-source developer utility maintained by the KITTY CORP ecosystem.",
    href: "https://github.com/psychspy7/hydra",
    icon: Code2,
  },
];

export function ObsidianHero({ copy }: { copy: SitePageContent }) {
  return (
    <section className="obsidian-hero page-gutter" aria-labelledby="obsidian-title" data-element="lightning">
      <div className="obsidian-hero-copy">
        <div className="obsidian-eyebrow"><span className="obsidian-pulse" /> {copy.heroEyebrow}</div>
        <h1 id="obsidian-title">{copy.heroTitle}<br /><em>{copy.heroAccent}</em></h1>
        <p>{copy.heroDescription}</p>
        <div className="obsidian-actions">
          <Link className="obsidian-button obsidian-button-primary" href="/services">
            Explore services <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <Link className="obsidian-button obsidian-button-quiet" href="#intelligence-robotics">
            Enter the lab <ArrowDownRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="obsidian-proofline">
          <span><i /> INDEPENDENT TECHNOLOGY COMPANY</span>
          <span>BUILT IN INDIA · WORKING EVERYWHERE</span>
        </div>
      </div>
      <aside className="obsidian-hero-console" aria-label="KITTY CORP studio overview">
        <div className="console-topline"><span>KC / STUDIO OVERVIEW</span><span>EST. 2026</span></div>
        <div className="console-orbit" aria-hidden="true">
          <div className="console-orbit-ring console-orbit-ring-one" />
          <div className="console-orbit-ring console-orbit-ring-two" />
          <div className="console-core"><span>KC</span><small>INTELLIGENCE<br />IN MOTION</small></div>
          <span className="console-node console-node-a" />
          <span className="console-node console-node-b" />
          <span className="console-node console-node-c" />
        </div>
        <div className="console-readouts">
          <div><span>01 / DIGITAL</span><strong>Software &amp; systems</strong><small><Globe2 size={13} /> Client engineering</small></div>
          <div><span>02 / RESEARCH</span><strong>AI &amp; robotics</strong><small><Cpu size={13} /> Experimental systems</small></div>
        </div>
        <div className="console-footer"><span><Activity size={13} /> STUDIO STATUS</span><strong>ACTIVE <i /></strong></div>
      </aside>
      <div className="obsidian-scroll-note" aria-hidden="true"><span>SCROLL TO EXPLORE</span><div /></div>
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
        <div><span className="obsidian-label obsidian-label-blue">02 / INTELLIGENCE &amp; ROBOTICS</span><h2 id="obsidian-lab-title">Beyond the screen.<br /><em>Into the physical world.</em></h2></div>
        <p>Our lab explores how intelligent software can move into devices, machines and environments. We publish the stage honestly: research, concept and prototype are not the same as a shipped product.</p>
      </div>
      <div className="obsidian-lab-grid">
        {labs.map(({ number, name, discipline, status, icon: Icon, description, detail, tone }) => (
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
              <Link href="/research">Explore research <ArrowUpRight size={15} /></Link>
            </div>
          </article>
        ))}
      </div>
      <div className="obsidian-lab-foot"><span>RESEARCH NOTES · ITERATION · VALIDATION</span><Link href="/research">Visit Intelligence &amp; Labs <ArrowUpRight size={15} /></Link></div>
    </section>
  );
}

export function ObsidianEcosystem() {
  return (
    <section id="ecosystem" className="obsidian-ecosystem page-gutter" aria-labelledby="obsidian-ecosystem-title" data-element="water">
      <div className="obsidian-section-heading">
        <div><span className="obsidian-label">03 / ECOSYSTEM</span><h2 id="obsidian-ecosystem-title">Made in the<br /><em>KITTY ecosystem.</em></h2></div>
        <p>Products and tools shaped by the same curiosity: make technology more useful, more accessible and more thoughtfully built.</p>
      </div>
      <div className="obsidian-ecosystem-grid">
        {ecosystem.map(({ name, type, description, href, icon: Icon }) => (
          <Link className="obsidian-ecosystem-card" href={href} key={name} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
            <div className="obsidian-ecosystem-icon"><Icon size={20} strokeWidth={1.5} /></div>
            <span className="obsidian-card-meta">{type}</span>
            <h3>{name}</h3>
            <p>{description}</p>
            <span className="obsidian-ecosystem-link">Explore <ArrowUpRight size={15} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
