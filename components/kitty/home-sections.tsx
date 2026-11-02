import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Cpu, AudioLines, Bot } from "lucide-react";
import { type Launch, launchHref, fileSize, downloadHref, isWebsiteLaunch } from "@/lib/launches";
import { homepageFounders, mediaHref, socialLabels, type CompanyProduct, type SocialLinks, type TeamMember } from "@/lib/company-content";
import { AppIcon } from "./secretchat";
import { publicSiteHref } from "@/lib/site-metadata";
import { FOUNDER_LINKEDIN, SUPPORT_EMAIL } from "@/lib/company-contact";
import type { SitePageContent } from "@/lib/site-page-content";

function ProductIcon({product}:{product:CompanyProduct}) {
  const Icon=product.slug==="sentinel"?Bot:product.slug==="lisa-ai"?AudioLines:Cpu;
  return product.icon_path?<Image unoptimized src={mediaHref(product.icon_path)} alt={`${product.name} icon`} width={56} height={56}/>:<Icon size={28} strokeWidth={1.4} aria-hidden="true"/>;
}
export function DeliverySupport() {
  return <section className="delivery-support wrap" aria-labelledby="delivery-support-heading">
    <div className="delivery-support-heading"><span className="eyebrow">AFTER WE SHIP</span><h2 id="delivery-support-heading">We stay with<br/>the work.</h2></div>
    <div className="delivery-support-detail"><span className="support-number">6 <span>months</span></span><h3>Free maintenance on eligible projects.</h3><p>Bug fixes, routine updates and support within the scope written in your quote. A successful paid referral adds three months to an eligible term. New features, domains, hosting and API usage are separate.</p><Link className="text-link" href="/projects">Plan your project <ArrowUpRight size={16}/></Link></div>
  </section>;
}
export function CompanyIntro({copy}:{copy:SitePageContent}){return <section className="company-intro wrap"><div><span className="eyebrow">{copy.introEyebrow}</span><h2>{copy.introTitle}<br/>{copy.introAccent}</h2></div><div className="editorial-copy"><p className="lead">{copy.introLead}</p><p>{copy.introBodyFirst}</p><p>{copy.introBodySecond}</p></div></section>;}
export function Products({launches,products}:{launches:Launch[];products:CompanyProduct[]}){return <section id="products" className="products-section wrap"><div className="section-heading"><div><span className="eyebrow">PRODUCT DIRECTORY</span><h2>Built by KITTY.</h2></div><p>Available releases and ongoing development.</p></div>{launches.map(l=><article className="launched-product" id={`launch-${l.slug}`} key={l.id}><div className="launched-product-icon"><AppIcon launch={l} size={82}/><span className="quiet-status">{isWebsiteLaunch(l) ? "LIVE WEBSITE" : "AVAILABLE · ANDROID"}</span></div><div><h3>{l.name}</h3><p>{l.tagline}</p><span className="download-meta">{isWebsiteLaunch(l) ? "Live · Website" : `v${l.version} · ${fileSize(l.apk_bytes)} · ${l.android}`}</span></div><div className="launched-product-actions">{isWebsiteLaunch(l) ? <a className="button button-gold" href={l.website_url || launchHref(l)} target="_blank" rel="noopener noreferrer">Open live website <ArrowUpRight size={16}/></a> : <a className="button button-gold" href={downloadHref(l)}>Download Android APK</a>}<Link className="text-link" href={launchHref(l)}>Product details</Link></div></article>)}{products.map(p=><article className="product-editorial" id={p.slug} key={p.slug}><div className="product-editorial-copy"><span className="quiet-status">{p.status}</span><span className="product-discipline">{p.label}</span><div className="product-title-row"><ProductIcon product={p}/><h3>{p.name}</h3></div><p className="product-description">{p.description}</p><p className="product-note">{p.intro}</p><div className="product-actions"><Link className="button button-outline" href={`/${p.slug}`}>Product details <ArrowUpRight size={16}/></Link><Link className="text-link" href={`/${p.slug}#development`}>Development notes</Link></div></div><div className="real-media-placeholder"><span className="micro-label">PRODUCT MEDIA</span><h4>{p.media}</h4><p>Demos will be added as development progresses.</p></div></article>)}</section>;}
export function WhyKitty(){return <section className="why-kitty"><div className="wrap why-grid"><div><span className="eyebrow">OUR APPROACH</span><h2>Useful by design.</h2></div><div className="editorial-copy"><p className="lead">We start with a real problem, agree what a useful result looks like, then build and test it with care.</p><p>For client work, that means a clear scope and direct communication. For our own products, it means staying honest about the difference between a concept, a prototype and something people can use.</p><p>Privacy, reliability and good design matter across both divisions. We work on them one version at a time.</p></div></div></section>;}
function publicTeamBio(person: TeamMember) {
  const bio = person.bio.trim();
  if (/^VIRAT\s*-\s*Building KITTY CORP from the ground up, leading its vision, innovation, and development of next-generation technology\.?$/i.test(bio)) {
    return "Building KITTY CORP and working across its products, client projects and research.";
  }
  if (/^Part of KITTY CORP since the beginning, contributing ideas, occasional brilliance, and showing up when it matters \(hopefully\)\.?$/i.test(bio)) {
    return "Working alongside Virat on KITTY CORP and its early products.";
  }
  return bio;
}

export function TeamProfiles({members}:{members:TeamMember[]}){
  return <div className="team-profiles">{members.map(person=><article className="founder" key={person.id}>
    <div className={`founder-photo ${person.photo_path?"":"founder-initial"}`}>{person.photo_path?<Image unoptimized src={mediaHref(person.photo_path)} alt={`${person.name}, ${person.role}`} width={700} height={800} loading="lazy"/>:<span aria-hidden="true">{person.name.charAt(0)}</span>}</div>
    <div className="founder-caption"><h3>{person.name}</h3><span>{person.role}</span></div>
    {person.bio&&<p className="founder-bio">{publicTeamBio(person)}</p>}
    <div className="founder-socials">{Object.entries(person.links).filter(([,url])=>!!url).map(([key,url])=><a key={key} href={publicSiteHref(url!)} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on ${socialLabels[key as keyof SocialLinks]}`}>{socialLabels[key as keyof SocialLinks]} <ArrowUpRight size={12}/></a>)}</div>
  </article>)}</div>;
}
export function Team({members}:{members:TeamMember[]}){
  const founders = homepageFounders(members);
  const founder = founders[0];
  const founderLinkedIn = founder?.links.linkedin || FOUNDER_LINKEDIN;
  return <section id="about" data-element="fire" className="team-section business-founder wrap" aria-labelledby="founder-heading">
    <div className="section-heading"><div><span className="eyebrow">THE PEOPLE BUILDING KITTY</span><h2 id="founder-heading">Meet the founder.</h2></div></div>
    <div className="home-founder-profile">
      <div className="home-founder-identity"><h3>{founder?.name || "Virat Anand"}</h3><span>{founder?.role || "Founder & CEO"}</span></div>
      <div className="home-founder-links"><a href={`mailto:${SUPPORT_EMAIL}`}>Email KITTY CORP <ArrowUpRight size={14} aria-hidden="true"/></a><a href={publicSiteHref(founderLinkedIn)} target="_blank" rel="noopener noreferrer">Virat Anand on LinkedIn <ArrowUpRight size={14} aria-hidden="true"/></a></div>
      <Link href="/team" className="button button-gold full-team-link">See the full team <ArrowUpRight size={18} aria-hidden="true"/></Link>
    </div>
  </section>;
}
