import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { ServicePricing } from "@/components/kitty/service-pricing";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata("Pricing & packages", "Website and AI service starting prices, project payment choices and a free planning conversation.", "/pricing");

export default function PricingPage() {
  return <><SiteHeader/><main id="main" className="public-page pricing-page">
    <div className="wrap page-heading"><span className="eyebrow">KITTY CORP / PRICING</span><h1>Good work starts<br/>with a clear plan.</h1><p>We build websites, applications and useful AI workflows. Pick a starting point, then tell us what you actually need.</p></div>
    <ServicePricing/>
    <section className="wrap pricing-process" aria-labelledby="pricing-process-heading"><div><span className="eyebrow">HOW PROJECT PAYMENT WORKS</span><h2 id="pricing-process-heading">Your brief. Our quote. Your choice.</h2><p>Send your requirements for free. We give you a private request link and review the work before setting a price. KITTY AI can help clarify a brief, but a person approves the final quote.</p></div><ol><li><strong>Full advance</strong><span>2.5% off the agreed project total.</span></li><li><strong>Half now, half later</strong><span>1% off for new requests. The balance opens when the agreed preview is ready.</span></li><li><strong>Talk first</strong><span>Request an appointment and decide after discussing the scope. No advance to send a brief.</span></li></ol><div className="pricing-actions"><Link className="button button-gold" href="/projects">Send a project brief</Link><Link className="button button-outline" href="/appointments">Request an appointment</Link></div></section>
  </main><SiteFooter/></>;
}
