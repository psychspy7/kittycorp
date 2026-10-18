import Link from "next/link";
import { ArrowUpRight, Globe2, PanelsTopLeft, Smartphone, Workflow, Check } from "lucide-react";
import { type Launch, isWebsiteLaunch, launchHref } from "@/lib/launches";
import { AppIcon } from "./secretchat";
export function ProfessionalHero({ launches }: { launches: Launch[] }) {
  const selected = launches.slice(0, 3);
  return <section className="professional-hero wrap" aria-labelledby="hero-title">
    <div className="professional-hero-copy">
      <span className="eyebrow">INDEPENDENT SOFTWARE STUDIO</span>
      <h1 id="hero-title">Your business.<br/><span>Better online.</span></h1>
      <p>We design and build websites, web applications and Android apps. Tell us what you need. We’ll help you plan it, build it and look after it.</p>
      <div className="hero-actions">
        <Link className="button button-gold" href="/projects">Start a project <ArrowUpRight size={17} aria-hidden="true"/></Link>
        <a className="text-link" href="#services">Explore our services <ArrowUpRight size={16} aria-hidden="true"/></a>
      </div>
      <div className="hero-reassurance"><span><Check size={14} aria-hidden="true"/>Work directly with the builders</span><span><Check size={14} aria-hidden="true"/>Maintenance agreed in your quote</span></div>
    </div>
    <aside className="hero-work hero-work-compact" aria-label="Selected KITTY CORP projects">
      <div className="hero-work-label"><span className="micro-label">OUR OWN PRODUCTS</span><Link href="/products">View all <ArrowUpRight size={13} aria-hidden="true"/></Link></div>
      <h2>Made by KITTY.</h2>
      <p className="hero-work-description">A few things we’ve built alongside our client services.</p>
      <div className="hero-project-list">{selected.map(project => <Link href={launchHref(project)} key={project.id}>
        <AppIcon launch={project} size={40}/><span><strong>{project.name}</strong><small>{isWebsiteLaunch(project) ? "Website · View project" : "Android app · View release"}</small></span><ArrowUpRight size={17} aria-hidden="true"/>
      </Link>)}</div>
      {!selected.length && <Link className="text-link" href="/products">Explore our products <ArrowUpRight size={16} aria-hidden="true"/></Link>}
      <div className="hero-work-footer"><span>Looking for a plan or payment?</span><a href="#payments">Find it here <ArrowUpRight size={14} aria-hidden="true"/></a></div>
    </aside>
  </section>;
}
const services=[{title:"Business websites",icon:Globe2,body:"Make it easy to understand your business and get in touch.",details:"Company sites · Landing pages · Portfolios",href:"/services#websites",action:"Explore websites"},{title:"Web applications",icon:PanelsTopLeft,body:"Bring your workflow online or put a first version in users’ hands.",details:"Dashboards · Customer portals · Internal tools",href:"/services#applications",action:"Explore web apps"},{title:"Android apps",icon:Smartphone,body:"Build a focused mobile app around what your customers need.",details:"User accounts · APIs · Release & handover",href:"/services#applications",action:"Explore Android apps"},{title:"AI agents & automation",icon:Workflow,body:"Connect your tools and give repetitive work a reliable workflow.",details:"n8n workflows · AI assistants · Business operations",href:"/services#automation",action:"Explore automation"}];
export function ServiceOverview(){return <section id="services" className="home-services wrap" aria-labelledby="services-heading"><div className="section-heading"><div><span className="eyebrow">WHAT WE CAN BUILD FOR YOU</span><h2 id="services-heading">A useful place to start.</h2></div><p>Starting from scratch or improving something existing?<br/>We’ll work out the next step with you.</p></div><div className="home-services-grid">{services.map(({title,icon:Icon,body,details,href,action},i)=><Link className="home-service" href={href} key={title}><div className="home-service-top"><Icon size={25} strokeWidth={1.5} aria-hidden="true"/><span>0{i+1}</span></div><h3>{title}</h3><p>{body}</p><span className="home-service-details">{details}</span><span className="home-service-action">{action}<ArrowUpRight size={17} aria-hidden="true"/></span></Link>)}</div></section>;}
export function HomeProcess(){return <section className="home-process wrap" aria-labelledby="process-heading"><div className="home-process-intro"><span className="eyebrow">HOW WE WORK</span><h2 id="process-heading">Clear scope. Visible progress.</h2><Link className="text-link" href="/services#how-we-work">The process in detail <ArrowUpRight size={15} aria-hidden="true"/></Link></div><ol>{[["Tell us the goal","A rough brief is enough to begin."],["Agree the plan","Scope, cost and timing before we build."],["Review the work","A working preview and room for feedback."],["Launch with support","An agreed handover and maintenance."]].map(([title,body])=><li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol></section>;}
