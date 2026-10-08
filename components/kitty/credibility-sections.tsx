import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { downloadHref, isWebsiteLaunch, launchHref, type Launch } from "@/lib/launches";
import { mediaHref } from "@/lib/company-content";
import type { Testimonial } from "@/lib/testimonials";
import { AppIcon } from "./secretchat";

function shortDescription(text: string) {
  if (text.length <= 220) return text;
  return text.slice(0, 220).replace(/\s+\S*$/, "") + "…";
}
function websiteHost(value: string | null) {
  try { return new URL(value || "").hostname; } catch { return "Live website"; }
}

export function ShippedWork({launches}: {launches: Launch[]}) {
  if (!launches.length) return null;
  return <section id="work" className="shipped-work wrap" aria-labelledby="work-heading">
    <div className="section-heading"><div><span className="eyebrow">BUILT & RELEASED</span><h2 id="work-heading">See what we’ve shipped.</h2><p>Our own products, live and available to try.</p></div><Link className="text-link" href="/products">All products <ArrowUpRight size={16}/></Link></div>
    <div className="shipped-grid">{launches.slice(0, 4).map(launch => {
      const website = isWebsiteLaunch(launch);
      return <article className={`shipped-card ${website ? "shipped-website" : "shipped-app"}`} key={launch.id}>
        {website && launch.screenshot_path && <a className="work-screen" href={launch.website_url || launchHref(launch)} target="_blank" rel="noopener noreferrer"><div className="work-browser-bar"><span aria-hidden="true">● ● ●</span><span>{websiteHost(launch.website_url)}</span><ArrowUpRight size={13} aria-hidden="true"/></div><Image unoptimized src={mediaHref(launch.screenshot_path)} alt={`${launch.name} website preview — open the live website`} width={1800} height={1200} loading="lazy"/></a>}
        <div className="shipped-card-copy"><div className="work-identity"><AppIcon launch={launch} size={52}/><span className="quiet-status"><span className="live-dot" aria-hidden="true"/>{website ? "LIVE WEBSITE" : "ANDROID RELEASE"}</span></div><h3>{launch.name}</h3><p className="work-tagline">{launch.tagline}</p><p className="work-description">{shortDescription(launch.description)}</p><div className="work-actions">{website ? <a className="button button-gold" href={launch.website_url || launchHref(launch)} target="_blank" rel="noopener noreferrer">Open live website <ArrowUpRight size={16}/></a> : <a className="button button-gold" href={downloadHref(launch)}>Download APK <ArrowUpRight size={16}/></a>}<Link className="text-link" href={launchHref(launch)}>View details <ArrowUpRight size={14}/></Link></div>{!website && <span className="work-release">v{launch.version} · {launch.android}</span>}</div>
      </article>;
    })}</div>
  </section>;
}

export function WorkingTogether() {
  return <section className="working-together wrap" aria-labelledby="working-heading"><div><span className="eyebrow">WEBSITES & APP DEVELOPMENT</span><h2 id="working-heading">Built around<br/>your business.</h2><p>A website that explains what you do. An app that makes a task easier. A first version you can put in front of customers.</p><Link className="button button-gold" href="/services#project-enquiry">Discuss your project <ArrowUpRight size={17}/></Link></div><div className="working-details">{[["Start with the problem", "Tell us what isn’t working, or what you want to build. We’ll help you decide what the first version needs."], ["Know what you’re getting", "We agree on the scope, budget and timing before development starts."], ["See the work as it happens", "Review a working preview, give feedback and stay involved through release."]].map(([title, body]) => <div key={title}><Check size={17} aria-hidden="true"/><div><h3>{title}</h3><p>{body}</p></div></div>)}<Link className="text-link" href="/services">Services & how we work <ArrowUpRight size={15}/></Link></div></section>;
}

const tools = [
  ["GitHub", "https://github.com", "/toolkit/github-v1.svg"],
  ["Microsoft", "https://www.microsoft.com", ""],
  ["Google", "https://www.google.com", ""],
  ["IBM", "https://www.ibm.com", ""],
  ["Claude", "https://claude.ai", ""],
  ["OpenAI", "https://openai.com", ""],
];
export function Toolkit() {
  return <section className="toolkit wrap" aria-labelledby="toolkit-heading"><div className="toolkit-heading"><h2 id="toolkit-heading">Tools & platforms we use</h2><p>Part of our development workflow.</p></div><div className="toolkit-brands">{tools.map(([name, href, logo]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{logo ? <Image unoptimized src={logo} alt={name} width={116} height={30} loading="lazy"/> : <span>{name}</span>}</a>)}</div><p className="toolkit-note">KITTY CORP is independent. These are tools we use, not clients or endorsements. All names and marks belong to their owners.</p></section>;
}

export function Reviews({reviews}: {reviews: Testimonial[]}) {
  if (!reviews.length) return null;
  return <section className="public-reviews wrap" aria-labelledby="reviews-heading"><div className="section-heading"><div><span className="eyebrow">IN THEIR WORDS</span><h2 id="reviews-heading">Feedback on the work.</h2></div></div><div className="review-grid">{reviews.map(review => <figure key={review.id}><blockquote>{review.quote}</blockquote><figcaption><strong>{review.reviewer_name}</strong>{(review.reviewer_role || review.company) && <span>{[review.reviewer_role, review.company].filter(Boolean).join(" · ")}</span>}{review.source_url && <a className="text-link" href={review.source_url} target="_blank" rel="noopener noreferrer">Read the original <ArrowUpRight size={13}/></a>}</figcaption></figure>)}</div></section>;
}
