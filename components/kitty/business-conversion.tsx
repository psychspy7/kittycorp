import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { isWebsiteLaunch, launchHref, type Launch } from "@/lib/launches";
import { mediaHref } from "@/lib/company-content";
import { AppIcon } from "./secretchat";
import { ProjectEnquiry } from "./project-enquiry";
import { serviceSegments } from "@/lib/business-content";

export function BusinessProof({ launches }: { launches: Launch[] }) {
  const selected = [...launches].sort((a,b) => Number(isWebsiteLaunch(b))-Number(isWebsiteLaunch(a))).slice(0,3);
  return <section id="work" className="business-proof wrap" aria-labelledby="proof-title">
    <div className="section-heading"><div><span className="eyebrow">SELECTED WORK</span><h2 id="proof-title">Open the work. See for yourself.</h2></div><p>Published websites and app releases from KITTY CORP, with links to the real project or product.</p></div>
    <div className="business-proof-grid">{selected.map(item => <article className="business-proof-card" key={item.id}>
      {isWebsiteLaunch(item) && item.screenshot_path && <Link href={launchHref(item)} className="business-proof-image" data-conversion="portfolio_view" data-context="home"><Image unoptimized src={mediaHref(item.screenshot_path)} width={900} height={600} sizes="(max-width: 700px) 92vw, 30vw" loading="lazy" alt={item.name+" published website preview"}/></Link>}
      <div className="business-proof-copy"><div className="business-proof-label"><AppIcon launch={item} size={36}/><span className="micro-label">{isWebsiteLaunch(item)?"PUBLISHED WEBSITE":"ANDROID APP RELEASE"}</span></div><h3>{item.name}</h3><p>{item.tagline}</p><Link className="text-link" href={launchHref(item)} data-conversion="portfolio_view" data-context="home">View project <ArrowUpRight size={15}/></Link></div>
    </article>)}</div>
    {!selected.length && <p>Explore our published releases and development notes in the product directory.</p>}
    <Link className="text-link" href="/products" data-conversion="portfolio_view" data-context="home">Explore all our work <ArrowUpRight size={15}/></Link>
    <Achievement/>
  </section>;
}
export function Achievement() {
  return <aside className="achievement-note" aria-labelledby="achievement-title"><div><span className="eyebrow">OCTOBER 2026 · TEAM MILESTONE</span><h3 id="achievement-title">Team Prometheus: Top 500 at Hack in Hills ’26.</h3><p>Virat Anand’s team was shortlisted for Round 2 prototype development, as confirmed in the organisers’ selection email. The next step is building and demonstrating the prototype.</p></div><a className="text-link" href="https://hackinhills.com/" target="_blank" rel="noopener noreferrer">Official event <ArrowUpRight size={15}/></a></aside>;
}
export function BusinessEnquiry({ initialService }: { initialService?: "Website"|"Web application"|"AI agents & automation" }) {
  return <section id="project-enquiry" className="project-enquiry conversion-enquiry wrap" aria-labelledby="enquiry-title"><div><span className="eyebrow">TELL US WHAT YOU NEED</span><h2 id="enquiry-title">Let’s work out<br/>the next step.</h2><p>A short description is enough to start. We’ll read it, ask any useful questions and discuss a scope and quote. Sending an enquiry is free.</p><p>Development, previews, timing and support are agreed before work starts.</p><Link className="text-link" href="/appointments" data-conversion="service_cta" data-context="appointment">Prefer a conversation? Request a time <ArrowUpRight size={15}/></Link></div><ProjectEnquiry initialService={initialService}/></section>;
}
export function SegmentLinks() {
  return <section className="segment-links" aria-labelledby="segment-title"><div><span className="eyebrow">START WITH YOUR BUSINESS</span><h2 id="segment-title">Two places we can help.</h2></div><div>{Object.entries(serviceSegments).map(([slug,item]) => <Link href={"/services/"+slug} key={slug} data-conversion="service_cta" data-context={slug}><h3>{slug==="coaching-centres"?"Coaching & education":"Agencies & service businesses"}</h3><p>{item.description}</p><span className="text-link">See an example workflow <ArrowUpRight size={15}/></span></Link>)}</div></section>;
}
