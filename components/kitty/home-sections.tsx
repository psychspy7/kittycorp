import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Cpu, AudioLines, Bot } from "lucide-react";
import { type Launch, launchHref, fileSize, downloadHref, isWebsiteLaunch } from "@/lib/launches";
import { homepageFounders, mediaHref, socialLabels, type CompanyProduct, type CompanySettings, type SocialLinks, type TeamMember } from "@/lib/company-content";
import { AppIcon } from "./secretchat";

function ProductIcon({product}:{product:CompanyProduct}) {
  const Icon=product.slug==="sentinel"?Bot:product.slug==="lisa-ai"?AudioLines:Cpu;
  return product.icon_path?<Image unoptimized src={mediaHref(product.icon_path)} alt={`${product.name} icon`} width={56} height={56}/>:<Icon size={28} strokeWidth={1.4} aria-hidden="true"/>;
}
export function HomeDestinations({launches,products}:{launches:Launch[];products:CompanyProduct[]}) {
  const experiments = products.filter(product => !launches.some(launch => launch.slug === product.slug));
  return <section id="work" className="business-destinations wrap" aria-label="Explore KITTY CORP’s work">
    <Link href="/products" className="business-destination">
      <div className="destination-topline"><span className="eyebrow">OUR OWN WORK</span><ArrowUpRight size={23} aria-hidden="true"/></div>
      <h2>Products &amp;<br/>shipped work.</h2><p>Explore our live websites and Android releases. See what each product does and try it for yourself.</p>
      {launches.length > 0 && <div className="destination-products">{launches.slice(0,3).map(launch => <span key={launch.id}><AppIcon launch={launch} size={30}/><span>{launch.name}</span></span>)}</div>}
      <span className="destination-action">Explore our products <ArrowUpRight size={16} aria-hidden="true"/></span>
    </Link>
    <Link href="/research" className="business-destination destination-lab">
      <div className="destination-topline"><span className="eyebrow">RESEARCH &amp; DEVELOPMENT</span><ArrowUpRight size={23} aria-hidden="true"/></div>
      <h2>Inside<br/>the lab.</h2><p>A closer look at our work in AI, robotics and intelligent software, with development notes as the work progresses.</p>
      {experiments.length > 0 && <div className="destination-products">{experiments.slice(0,3).map(product => <span key={product.slug}><span className="destination-product-icon"><ProductIcon product={product}/></span><span>{product.name}</span></span>)}</div>}
      <span className="destination-action">Visit the lab <ArrowUpRight size={16} aria-hidden="true"/></span>
    </Link>
  </section>;
}
export function DeliverySupport() {
  return <section className="delivery-support wrap" aria-labelledby="delivery-support-heading">
    <div className="delivery-support-heading"><span className="eyebrow">AFTER WE SHIP</span><h2 id="delivery-support-heading">We stay with<br/>the work.</h2></div>
    <div className="delivery-support-detail"><span className="support-number">6 <span>months</span></span><h3>Free maintenance after delivery.</h3><p>Bug fixes, routine updates and support for the website or app we build. We agree on the maintenance scope before starting; new features and third-party hosting or API costs are quoted separately.</p><Link className="text-link" href="/services#project-enquiry">Plan your project <ArrowUpRight size={16}/></Link></div>
  </section>;
}
export function LabProducts({launches,products}:{launches:Launch[];products:CompanyProduct[]}) {
  const experiments = products.filter(product => !launches.some(launch => launch.slug === product.slug));
  if (!experiments.length) return null;
  return <section id="lab-projects" className="lab-products" aria-labelledby="lab-products-heading"><div className="section-heading"><div><span className="eyebrow">INSIDE THE LAB</span><h2 id="lab-products-heading">Projects in development.</h2><p>Explore the prototypes, their current status and the work behind them.</p></div><Link className="text-link" href="/products">All KITTY products <ArrowUpRight size={16}/></Link></div><div className="product-summary-grid">{experiments.map(product => <article className="product-summary" key={product.slug}><div className="product-summary-top"><span className="product-summary-icon"><ProductIcon product={product}/></span><span className="quiet-status">{product.status}</span></div><h3>{product.name}</h3><p>{product.description}</p><div className="product-summary-bottom"><Link className="text-link" href={`/${product.slug}`}>View development <ArrowUpRight size={16}/></Link><span>{product.category}</span></div></article>)}</div></section>;
}
export function CompanyIntro(){return <section className="company-intro wrap"><div><span className="eyebrow">THE COMPANY</span><h2>Independent.<br/>Still early.</h2></div><div className="editorial-copy"><p className="lead">KITTY CORP is a small technology company founded by Virat and Sarthak.</p><p>We develop intelligent software and explore AI, robotics, computer vision and cybersecurity. We also build websites and applications for clients.</p><p>EXAMIFY is live, and KITTY AI and SecretChat have Android releases available to try. We’re continuing to develop these products while exploring new ideas in the lab.</p></div></section>;}
export function Products({launches,products}:{launches:Launch[];products:CompanyProduct[]}){return <section id="products" className="products-section wrap"><div className="section-heading"><div><span className="eyebrow">PRODUCT DIRECTORY</span><h2>Built by KITTY.</h2></div><p>Available releases and ongoing development.</p></div>{launches.map(l=><article className="launched-product" id={`launch-${l.slug}`} key={l.id}><div className="launched-product-icon"><AppIcon launch={l} size={82}/><span className="quiet-status">{isWebsiteLaunch(l) ? "LIVE WEBSITE" : "AVAILABLE · ANDROID"}</span></div><div><h3>{l.name}</h3><p>{l.tagline}</p><span className="download-meta">{isWebsiteLaunch(l) ? "Live · Website" : `v${l.version} · ${fileSize(l.apk_bytes)} · ${l.android}`}</span></div><div className="launched-product-actions">{isWebsiteLaunch(l) ? <a className="button button-gold" href={l.website_url || launchHref(l)} target="_blank" rel="noopener noreferrer">Open live website <ArrowUpRight size={16}/></a> : <a className="button button-gold" href={downloadHref(l)}>Download Android APK</a>}<Link className="text-link" href={launchHref(l)}>Product details</Link></div></article>)}{products.map(p=><article className="product-editorial" id={p.slug} key={p.slug}><div className="product-editorial-copy"><span className="quiet-status">{p.status}</span><span className="product-discipline">{p.label}</span><div className="product-title-row"><ProductIcon product={p}/><h3>{p.name}</h3></div><p className="product-description">{p.description}</p><p className="product-note">{p.intro}</p><div className="product-actions"><Link className="button button-outline" href={`/${p.slug}`}>Product details <ArrowUpRight size={16}/></Link><Link className="text-link" href={`/${p.slug}#development`}>Development notes</Link></div></div><div className="real-media-placeholder"><span className="micro-label">PRODUCT MEDIA</span><h4>{p.media}</h4><p>Demos will be added as development progresses.</p></div></article>)}</section>;}
export function WhyKitty(){return <section className="why-kitty"><div className="wrap why-grid"><div><span className="eyebrow">OUR APPROACH</span><h2>Useful by design.</h2></div><div className="editorial-copy"><p className="lead">We start with a problem we understand, then build something we can test.</p><p>For KITTY AI, that means exploring memory, voice and user control. For Sentinel, it means learning how a prototype can understand its surroundings. For client projects, it means agreeing on a clear scope and working closely with the people who’ll use it.</p><p>Privacy, reliability and good design matter across all of this. We’re working towards them one version at a time.</p></div></div></section>;}
export function TeamProfiles({members}:{members:TeamMember[]}){return <div className="team-profiles">{members.map(person=><article className="founder" key={person.id}><div className={`founder-photo ${person.photo_path?"":"founder-initial"}`}>{person.photo_path?<Image unoptimized src={mediaHref(person.photo_path)} alt={`${person.name}, ${person.role}`} width={700} height={800} loading="lazy"/>:<span aria-hidden="true">{person.name.charAt(0)}</span>}</div><div className="founder-caption"><h3>{person.name}</h3><span>{person.role}</span></div>{person.bio&&<p className="founder-bio">{person.bio}</p>}<div className="founder-socials">{Object.entries(person.links).filter(([,url])=>!!url).map(([key,url])=><a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on ${socialLabels[key as keyof SocialLinks]}`}>{socialLabels[key as keyof SocialLinks]} <ArrowUpRight size={12}/></a>)}</div></article>)}</div>;}
export function Team({members,settings}:{members:TeamMember[];settings:CompanySettings}){
  const founder = homepageFounders(members).find(person => person.role.trim().toLowerCase().startsWith("founder & ceo") && /^virat(?:\s|$)/i.test(person.name.trim()));
  return <section id="about" className="team-section business-founder wrap" aria-labelledby="founder-heading">
    <div className="section-heading"><div><span className="eyebrow">THE PERSON BEHIND THE WORK</span><h2 id="founder-heading">Meet the founder.</h2></div></div>
    <div className="home-team-grid">{founder ? <TeamProfiles members={[founder]}/> : <p className="quiet-empty">The founder’s profile will be shared here.</p>}
      <div className="team-copy"><span className="eyebrow">BUILT WITH PEOPLE</span><p>{settings.team_intro}</p><p>Meet the rest of the people working on KITTY, and find their roles, profiles and links in our team directory.</p><Link href="/team" className="button button-gold full-team-link">See full team <ArrowUpRight size={18}/></Link><Link href="/company" className="text-link">About KITTY CORP <ArrowUpRight size={16}/></Link></div>
    </div>
  </section>;
}
