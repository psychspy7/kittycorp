import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bot, Code2, Sprout, Sun, Workflow } from "lucide-react";

export const roboticsProjects = [
  {
    id: "kitty-buddy",
    name: "KITTY BUDDY",
    field: "PERSONAL ROBOTICS",
    status: "CONCEPT",
    description: "An AI companion robot idea for everyday interaction. A physical prototype is still ahead.",
    icon: Bot,
  },
  {
    id: "agriyaan",
    name: "AGRIYAAN",
    field: "AGRICULTURE",
    status: "RESEARCH CONCEPT",
    description: "An autonomous agricultural rover concept shaped around practical needs in the field. Field testing has not started.",
    icon: Sprout,
  },
  {
    id: "kitty-urjayaan",
    name: "URJAYAAN",
    field: "SOLAR & ENERGY",
    status: "EARLY CONCEPT",
    description: "Exploring intelligent software and controls for solar generation and energy management.",
    icon: Sun,
  },
] as const;

const digitalCapabilities = [
  { title: "Websites", description: "Clear, fast websites that help people understand your business and take the next step.", icon: Code2 },
  { title: "Apps & software", description: "Customer applications and internal tools designed around the work they need to do.", icon: Code2 },
  { title: "AI & automation", description: "Useful AI features and connected workflows, with people in control of important actions.", icon: Workflow },
] as const;

export function CompanyHero() {
  return <section className="company-hero page-gutter" aria-labelledby="company-hero-title">
    <div className="company-hero-copy">
      <span className="company-kicker">INDEPENDENT TECHNOLOGY COMPANY · INDIA</span>
      <h1 id="company-hero-title">Built for business.<br /><em>Curious about what’s next.</em></h1>
      <p>We build websites, software and AI workflows for businesses. In our own lab, we explore intelligent systems and robotics.</p>
      <div className="company-hero-actions">
        <Link className="company-button company-button-light" href="/projects">Start a project <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <Link className="company-text-link" href="#divisions">Explore what we build <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <p className="company-hero-note">Independent by design. Robotics ideas are still early.</p>
    </div>
    <aside className="company-hero-index" aria-label="KITTY CORP’s two divisions">
      <div className="company-index-heading"><span className="company-kicker">ONE STUDIO · TWO DIVISIONS</span><span className="company-index-code">KC&nbsp; 01—02</span></div>
      <div className="company-hero-mark-stage">
        <span className="company-stage-coordinate">KITTY CORP · INDIA</span>
        <Image className="company-hero-mark" src="/brand/monogram-v1.webp" width={512} height={512} sizes="(max-width: 850px) 164px, 210px" loading="eager" alt="KITTY CORP blue and gold monogram" />
        <span className="company-stage-caption">INDEPENDENT TECHNOLOGY</span>
      </div>
      <nav className="company-hero-index-links" aria-label="Explore our divisions">
        <a className="company-index-link" href="#digital-solutions"><span className="company-index-number">01</span><span className="company-index-link-copy"><strong>Digital Solutions</strong><small>Web · software · AI</small></span><ArrowUpRight size={16} aria-hidden="true" /></a>
        <a className="company-index-link" href="#intelligence-robotics"><span className="company-index-number">02</span><span className="company-index-link-copy"><strong>Intelligence &amp; Robotics</strong><small>KITTY BUDDY · AGRIYAAN · URJAYAAN</small></span><ArrowUpRight size={16} aria-hidden="true" /></a>
      </nav>
      <div className="company-index-foot"><span>INDEPENDENT</span><span>BUILT IN INDIA</span></div>
    </aside>
  </section>;
}

export function CompanyDivisions() {
  return <section className="company-divisions page-gutter" id="divisions" aria-label="KITTY CORP divisions">
    <article className="division-block digital-division" id="digital-solutions">
      <div className="division-heading">
        <span className="company-kicker">01 &nbsp; DIGITAL SOLUTIONS</span>
        <h2>Technology for<br /><em>the work you do.</em></h2>
        <p>We design and build digital tools around real business needs, from a first website to software and AI workflows.</p>
      </div>
      <ul className="capability-list">
        {digitalCapabilities.map(({ title, description, icon: Icon }, index) => <li key={title}>
          <span className="capability-number">0{index + 1}</span>
          <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
          <div><h3>{title}</h3><p>{description}</p></div>
        </li>)}
      </ul>
      <Link className="company-text-link" href="/services">Explore digital services <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </article>

    <article className="division-block robotics-division" id="intelligence-robotics">
      <div className="division-heading">
        <span className="company-kicker">02 &nbsp; INTELLIGENCE &amp; ROBOTICS</span>
        <h2>Ideas moving<br /><em>into the world.</em></h2>
        <p>Our early research looks at how intelligent systems might help people in daily life, agriculture and energy.</p>
      </div>
      <ol className="robotics-project-list" aria-label="Robotics and intelligent systems in development">
        {roboticsProjects.map(({ id, name, field, status, description, icon: Icon }) => <li id={id} key={id}>
          <span className="robotics-project-icon"><Icon size={20} strokeWidth={1.45} aria-hidden="true" /></span>
          <div className="robotics-project-copy"><div className="robotics-project-meta"><span>{field}</span><span>{status}</span></div><h3>{name}</h3><p>{description}</p></div>
        </li>)}
      </ol>
      <div className="robotics-foot"><span>EARLY IDEAS · PROTOTYPES AND FIELD VALIDATION ARE PENDING</span><Link className="company-text-link" href="/research">Inside the lab <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </article>
  </section>;
}

export function ResearchProjects() {
  return <section className="research-projects" aria-labelledby="research-projects-title">
    <div className="research-projects-heading"><span className="company-kicker">INTELLIGENCE &amp; ROBOTICS</span><h2 id="research-projects-title">Three ideas.<br /><em>Early by design.</em></h2><p>These are directions we are exploring, not finished products. We’ll update each page as the engineering becomes real.</p></div>
    <ol className="robotics-project-list robotics-project-list-full">
      {roboticsProjects.map(({ id, name, field, status, description, icon: Icon }) => <li id={id} key={id}>
        <span className="robotics-project-icon"><Icon size={22} strokeWidth={1.45} aria-hidden="true" /></span>
        <div className="robotics-project-copy"><div className="robotics-project-meta"><span>{field}</span><span>{status}</span></div><h3>{name}</h3><p>{description}</p></div>
      </li>)}
    </ol>
  </section>;
}
