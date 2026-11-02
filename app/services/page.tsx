import type { Metadata } from "next";
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
import { sitePageContent } from "@/lib/site-pages-server";
export const dynamic="force-dynamic";
export async function generateMetadata():Promise<Metadata>{const copy=await sitePageContent("services");return pageMetadata(copy.seoTitle,copy.seoDescription,"/services");}
function splitLines(value:string){return value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);}
export default async function ServicesPage(){
 const [launches,copy]=await Promise.all([publishedLaunches().catch(()=>[]),sitePageContent("services")]);
 const copyByOffer={
  websites:{audience:copy.websiteAudience,problem:copy.websiteProblem,deliverables:copy.websiteDeliverables,separate:copy.websiteSeparate},
  applications:{audience:copy.softwareAudience,problem:copy.softwareProblem,deliverables:copy.softwareDeliverables,separate:copy.softwareSeparate},
  automation:{audience:copy.automationAudience,problem:copy.automationProblem,deliverables:copy.automationDeliverables,separate:copy.automationSeparate},
 };
 const editableOffers=serviceOffers.map(item=>{const value=copyByOffer[item.id];return {...item,...value,deliverables:splitLines(value.deliverables)};});
 const data={"@context":"https://schema.org","@type":"OfferCatalog",name:"KITTY CORP digital and AI services",itemListElement:editableOffers.map(item=>({"@type":"Offer",itemOffered:{"@type":"Service",name:item.title,description:item.problem,provider:{"@type":"Organization",name:"KITTY CORP",url:websiteOrigin()}}}))};
 return <><SiteHeader/><main id="main" className="public-page wrap services-page conversion-services"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(data)}}/><div className="page-heading"><span className="eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.intro}</p><div className="service-heading-actions"><a className="button button-gold" href="#project-enquiry" data-conversion="service_cta" data-context="services">{copy.primaryCta} <ArrowUpRight size={17}/></a><a className="text-link" href="#work" data-conversion="portfolio_view" data-context="services">{copy.secondaryCta} <ArrowUpRight size={16}/></a></div></div>
 <section className="service-offerings conversion-offerings" aria-label="Client services">{editableOffers.map((item,index)=><article id={item.id} key={item.id}><span className="micro-label">0{index+1} · CLIENT SERVICES</span><h2>{item.title}</h2><p>{item.audience}</p><p>{item.problem}</p><h3>What we deliver</h3><ul>{item.deliverables.map((value,itemIndex)=><li key={itemIndex}>{value}</li>)}</ul><p className="service-boundary">{item.separate}</p><a className="text-link" href="#project-enquiry" data-conversion="service_cta" data-context="services">Describe your project <ArrowUpRight size={15}/></a></article>)}</section>
 <section className="service-offerings conversion-offerings" aria-label="AI automation use cases"><article><span className="micro-label">AI & WORKFLOW AUTOMATION</span><h2>{copy.automationHeading}</h2><p>{copy.automationIntro}</p><h3>{copy.automationUseCasesHeading}</h3><ul>{splitLines(copy.automationUseCases).map((item,index)=><li key={index}>{item}</li>)}</ul><p className="service-boundary">{copy.automationBoundary}</p><Link className="text-link" href="/contact?subject=AI%20automation">{copy.automationCta} <ArrowUpRight size={15}/></Link></article></section>
 <div className="service-starting-price"><p>{copy.priceNote}</p><Link className="text-link" href="/pricing">See packages and inclusions <ArrowUpRight size={15}/></Link></div>
 <SegmentLinks/><BusinessProof launches={launches}/><HomeProcess/><DeliverySupport/><BusinessEnquiry/>
 <p className="existing-client-note">Already working together? Use your private quote link or <Link href="/account">customer account</Link> for agreed project payments.</p>
 </main><SiteFooter/></>;
}
