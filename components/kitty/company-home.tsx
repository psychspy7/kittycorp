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
      <h1 id="company-hero-title">We build digital products.<br /><em>And what comes next.</em></h1>
      <p>KITTY CORP creates websites, software and practical AI systems for businesses, while exploring intelligent products and robotics of our own.</p>
      <div className="company-hero-actions">
        <Link className="company-button company-button-light" href="/projects">Discuss a project <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <Link className="company-text-link" href="#divisions">Explore our divisions <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <p className="company-hero-note">A small team. Real work in progress. No inflated promises.</p>
    </div>
    <aside className="company-hero-index" aria-label="KITTY CORP divisions">
      <span className="company-kicker">TWO AREAS OF WORK</span>
      <a href="#digital-solutions"><span>01</span><strong>Digital Solutions</strong><ArrowUpRight size={16} aria-hidden="true" /></a>
      <a href="#intelligence-robotics"><span>02</span><strong>Intelligence &amp; Robotics</strong><ArrowUpRight size={16} aria-hidden="true" /></a>
      <div className="company-index-foot"><span>BUILDING INDEPENDENTLY</span><span>EST. BY A SMALL TEAM</span></div>
      <svg className="company-motion-graphic" viewBox="0 0 280 64" aria-hidden="true" focusable="false">
        <path d="M8 21H272M8 43H272" />
        <circle className="company-motion-anchor" cx="8" cy="21" r="3" />
        <circle className="company-motion-anchor" cx="272" cy="43" r="3" />
        <circle className="company-motion-node company-motion-node-one" cx="8" cy="21" r="2.5" />
        <circle className="company-motion-node company-motion-node-two" cx="272" cy="43" r="2.5" />
      </svg>
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
