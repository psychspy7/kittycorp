import Link from "next/link";
import { ArrowUpRight, Globe2, Smartphone, Workflow, Layers, Bot, Check, ShieldCheck, Zap, Code2, Users, Compass } from "lucide-react";
import { type Launch, isWebsiteLaunch, launchHref } from "@/lib/launches";
import { AppIcon } from "./secretchat";

export function ProfessionalHero({ launches }: { launches: Launch[] }) {
  const selected = launches.slice(0, 3);
  return (
    <section className="professional-hero wrap" aria-labelledby="hero-title">
      <div className="professional-hero-copy">
        <span className="eyebrow">INDEPENDENT SOFTWARE STUDIO</span>
        <h1 id="hero-title">Your business.<br /><span>Better online.</span></h1>
        <p>We design and build websites, web applications and Android apps. Tell us what you need. We’ll help you plan it, build it and look after it.</p>
        <div className="hero-actions">
          <Link className="button button-gold" href="/projects">Start a project <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <a className="text-link" href="#services">Explore our services <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="hero-reassurance">
          <span><Check size={14} aria-hidden="true" />Work directly with the builders</span>
          <span><Check size={14} aria-hidden="true" />Maintenance agreed in your quote</span>
        </div>
      </div>
      <aside className="hero-work hero-work-compact" aria-label="Selected KITTY CORP projects">
        <div className="hero-work-label">
          <span className="micro-label">OUR OWN PRODUCTS</span>
          <Link href="/products">View all <ArrowUpRight size={13} aria-hidden="true" /></Link>
        </div>
        <h2>Made by KITTY.</h2>
        <p className="hero-work-description">A few things we’ve built alongside our client services.</p>
        <div className="hero-project-list">
          {selected.map(project => (
            <Link href={launchHref(project)} key={project.id}>
              <AppIcon launch={project} size={40} />
              <span>
                <strong>{project.name}</strong>
                <small>{isWebsiteLaunch(project) ? "Website · View project" : "Android app · View release"}</small>
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
        {!selected.length && <Link className="text-link" href="/products">Explore our products <ArrowUpRight size={16} aria-hidden="true" /></Link>}
        <div className="hero-work-footer">
          <span>Looking for a plan or payment?</span>
          <a href="#payments">Find it here <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </aside>
    </section>
  );
}

const services = [
  {
    title: "Websites & Digital Experiences",
    icon: Globe2,
    body: "Stripe-grade aesthetics, sharp typography, and instant load times that turn curious visitors into qualified project leads.",
    details: "High-conversion landing pages · Technical SEO · Responsive brand systems",
    href: "/services/website-development",
    action: "Explore web architecture"
  },
  {
    title: "AI Agents & Intelligent Systems",
    icon: Bot,
    body: "Applied domain AI agents with strict safety bounds, retrieval on your company data, and human review for high-impact decisions.",
    details: "Custom knowledge retrieval · Guardrailed tool use · Audit trails",
    href: "/services/ai-agents",
    action: "Explore applied AI"
  },
  {
    title: "Business Automation & Workflows",
    icon: Workflow,
    body: "Connect your website, inboxes, CRMs, and accounting into self-healing, automated background workflows that never drop a lead.",
    details: "Event-driven orchestration · Lead triage · Webhook pipelines",
    href: "/services/business-automation",
    action: "Explore automation"
  },
  {
    title: "Mobile Applications",
    icon: Smartphone,
    body: "Native Android applications engineered with offline SQLite persistence, fast local caching, and reliable background operations.",
    details: "Jetpack Compose · Hardware integrations · Play Store packaging",
    href: "/services/mobile-apps",
    action: "Explore mobile apps"
  },
  {
    title: "Digital Transformation & Portals",
    icon: Layers,
    body: "Replace brittle manual spreadsheets with tailored customer portals, role-based dashboards, and scalable database backends.",
    details: "Customer account portals · Role-based access (RBAC) · Cloud deployment",
    href: "/services/digital-transformation",
    action: "Explore custom portals"
  }
];

export function ServiceOverview() {
  return (
    <section id="services" className="home-services wrap" aria-labelledby="services-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">WHAT WE BUILD FOR CLIENTS</span>
          <h2 id="services-heading">Five core engineering capabilities.</h2>
        </div>
        <p>
          Whether starting from scratch or re-architecting an existing system,<br />
          we design and engineer software that drives measurable business growth.
        </p>
      </div>
      <div className="home-services-grid">
        {services.map(({ title, icon: Icon, body, details, href, action }, i) => (
          <Link className="home-service" href={href} data-conversion="service_cta" data-context="home" key={title}>
            <div className="home-service-top">
              <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
              <span>0{i + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
            <span className="home-service-details">{details}</span>
            <span className="home-service-action">
              {action} <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HomeProcess() {
  const steps = [
    { number: "01", phase: "Discover", summary: "We clarify your target audience, business goals, and technical boundaries in plain language." },
    { number: "02", phase: "Design", summary: "High-fidelity wireframes, content hierarchy, and design tokens engineered for conversion and clarity." },
    { number: "03", phase: "Build", summary: "Clean TypeScript and Next.js architecture with zero AI slop, strict typing, and modular components." },
    { number: "04", phase: "Test", summary: "End-to-end regression testing, bot security verification, and performance audits across all device sizes." },
    { number: "05", phase: "Deploy", summary: "Production launch to client cloud infrastructure (Vercel, Firebase, Cloud Run) with full IP handover." },
    { number: "06", phase: "Improve", summary: "6 months of included production maintenance, telemetry monitoring, and iterative enhancements." }
  ];

  return (
    <section id="how-we-work" className="home-process wrap" aria-labelledby="process-heading">
      <div className="home-process-intro">
        <span className="eyebrow">ENGINEERING DELIVERY PROCESS</span>
        <h2 id="process-heading">Discover → Design → Build → Test → Deploy → Improve.</h2>
        <p>Every milestone has transparent deliverables, agreed timelines, and fixed upfront costs.</p>
        <Link className="text-link" href="/services#how-we-work">
          The delivery methodology in detail <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <ol className="process-timeline-grid">
        {steps.map(({ number, phase, summary }) => (
          <li key={phase} className="process-timeline-step">
            <span className="step-number">{number}</span>
            <h3>{phase}</h3>
            <p>{summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function WhyKittyCorp() {
  const pillars = [
    {
      title: "Direct Builder Access",
      icon: Users,
      description: "You partner directly with the senior engineers writing your code. No account manager layers, no handoff games, no miscommunication."
    },
    {
      title: "Custom Engineering, No Slop",
      icon: Code2,
      description: "We don't use brittle no-code templates or AI-generated junk. Every component is custom-crafted in clean, documented TypeScript."
    },
    {
      title: "Practical AI Implementation",
      icon: Bot,
      description: "We focus on applied intelligence with human review boundaries and deterministic tool invocation, solving real workflow bottlenecks."
    },
    {
      title: "End-to-End Ownership",
      icon: ShieldCheck,
      description: "You receive 100% intellectual property ownership, clean source repositories, and deployment directly to your own cloud infrastructure."
    },
    {
      title: "6-Month Inclusive Warranty",
      icon: Zap,
      description: "Every qualifying project includes six months of complimentary production maintenance, security patching, and bug fixes."
    },
    {
      title: "Fixed Scope & Pricing",
      icon: Compass,
      description: "No surprise invoices. You receive an immutable, itemized project quote outlining scope, timing, and payment milestones upfront."
    }
  ];

  return (
    <section id="why-kitty" className="why-kitty wrap" aria-labelledby="why-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE KITTY CORP ADVANTAGE</span>
          <h2 id="why-heading">Why forward-thinking teams choose us.</h2>
        </div>
        <p>
          We build software like a long-term engineering partner,<br />
          combining technical rigor with honest business transparency.
        </p>
      </div>
      <div className="why-kitty-grid">
        {pillars.map(({ title, icon: Icon, description }) => (
          <article key={title} className="why-card">
            <div className="why-card-icon">
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
