import { pageMetadata, websiteOrigin, jsonLd } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { BusinessProof, BusinessEnquiry, SegmentLinks } from "@/components/kitty/business-conversion";
import { HomeProcess } from "@/components/kitty/professional-home";
import { DeliverySupport } from "@/components/kitty/home-sections";
import { serviceOffers } from "@/lib/business-content";
import { publishedLaunches } from "@/lib/launches-server";
export const dynamic="force-dynamic";
export const metadata=pageMetadata("Websites, apps & AI automation services","Business websites, custom web and Android applications, and practical AI agents. Clear scope, direct communication and agreed maintenance.","/services");
export default async function ServicesPage(){
 const launches=await publishedLaunches().catch(()=>[]);
 const data={"@context":"https://schema.org","@type":"OfferCatalog",name:"KITTY CORP client services",itemListElement:serviceOffers.map(item=>({"@type":"Offer",itemOffered:{"@type":"Service",name:item.title,description:item.problem,provider:{"@type":"Organization",name:"KITTY CORP",url:websiteOrigin()}}}))};
 return <><SiteHeader/><main id="main" className="public-page wrap services-page conversion-services"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(data)}}/><div className="page-heading"><span className="eyebrow">SOFTWARE FOR THE WAY YOU WORK</span><h1>Better online.<br/>Less work by hand.</h1><p>We design, develop and maintain business websites, applications and useful automation. You work directly with the people building the solution, from the first conversation to handover.</p><div className="service-heading-actions"><a className="button button-gold" href="#project-enquiry" data-conversion="service_cta" data-context="services">Discuss Your Project <ArrowUpRight size={17}/></a><a className="text-link" href="#work" data-conversion="portfolio_view" data-context="services">View our work <ArrowUpRight size={16}/></a></div></div>
 <section className="service-offerings conversion-offerings" aria-label="Client services">{serviceOffers.map((item,index)=><article id={item.id} key={item.id}><span className="micro-label">0{index+1} / CLIENT SERVICES</span><h2>{item.title}</h2><p>{item.audience}</p><p>{item.problem}</p><h3>What we deliver</h3><ul>{item.deliverables.map(value=><li key={value}>{value}</li>)}</ul><p className="service-boundary">{item.separate}</p><a className="text-link" href="#project-enquiry" data-conversion="service_cta" data-context="services">Describe your project <ArrowUpRight size={15}/></a></article>)}</section>
 <div className="service-starting-price"><p>Approved website packages start at $50 USD. Custom work is quoted against your scope.</p><Link className="text-link" href="/pricing">See packages and inclusions <ArrowUpRight size={15}/></Link></div>
 <SegmentLinks/><BusinessProof launches={launches}/><HomeProcess/><DeliverySupport/><BusinessEnquiry/>
 <p className="existing-client-note">Already working together? Use your private quote link or <Link href="/account">customer account</Link> for agreed project payments.</p>
 </main><SiteFooter/></>;
}
