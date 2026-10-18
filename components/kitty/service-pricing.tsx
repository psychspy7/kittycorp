import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LocalPrice } from "./local-currency";

const packages = [
  { name: "Planning call", price: 0, summary: "A first conversation, a practical scope and a written quote.", details: ["Tell us what you need", "Discuss timing and budget", "No obligation to proceed"] },
  { name: "Basic Website", price: 50, summary: "A focused, responsive home for a clear offer.", details: ["Essential pages and contact path", "Mobile and desktop layouts", "Launch handover"] },
  { name: "Premium Website", price: 100, summary: "A fuller site with the frontend and backend your scope needs.", details: ["Custom page structure", "Agreed interactive features", "Backend work defined in the quote"] },
  { name: "AI Website", price: 149, summary: "A site with a useful AI feature or automation, designed around a real task.", details: ["Website design and development", "One scoped AI workflow", "Usage and provider costs explained upfront"] },
  { name: "KITTY AI Membership", price: 200, summary: "A 30-day bundle: two Premium Website builds and KITTY AI Plus access.", details: ["Two Premium Website scopes agreed before payment", "30 days of KITTY AI Plus access", "LISA AI is not included"] },
] as const;

export function ServicePricing({ compact = false }: { compact?: boolean }) {
  const shown = compact ? packages.slice(0, 4) : packages;
  return <section id="pricing" className={`service-pricing wrap ${compact ? "service-pricing-compact" : ""}`} aria-labelledby="service-pricing-heading">
    <div className="section-heading">
      <div><span className="eyebrow">WEBSITE & AI SERVICES</span><h2 id="service-pricing-heading">Clear starting points.</h2></div>
      <p>Simple work can start small. Every project gets a written scope and final quote before checkout.</p>
    </div>
    <div className="service-pricing-grid">{shown.map(item => <article className="service-price-card" key={item.name}>
      <span className="micro-label">{item.price === 0 ? "START HERE" : "STARTING AT"}</span>
      <h3>{item.name}</h3>
      <div className="service-price-amount">{item.price ? <><strong>${item.price}</strong><span>USD</span></> : <strong>Free</strong>}</div>
      {item.price > 0 && <LocalPrice amount={item.price * 100} base="USD" charged={false} quoteOnly/>}
      <p>{item.summary}</p>
      {!compact && <ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>}
      <Link className="text-link" href={item.price === 0 ? "/appointments" : "/projects"}>{item.price === 0 ? "Request a conversation" : "Tell us about your project"} <ArrowUpRight size={15}/></Link>
    </article>)}</div>
    <div className="service-pricing-note">
      <p><strong>Need a different fit?</strong> Custom work is welcome. Final features, timeline, charged currency, hosting, domain, AI usage and any recurring costs are confirmed in your quote. Free maintenance applies to eligible projects as agreed in writing; a successful paid referral adds three months to an eligible maintenance term.</p>
      {compact && <Link className="text-link" href="/pricing">See all packages and payment choices <ArrowUpRight size={16}/></Link>}
    </div>
    <Link className="text-link pricing-game-link" href="/play">A little challenge: solve our circuit and earn 5–7% off an eligible order <ArrowUpRight size={15}/></Link>
  </section>;
}

export function PricingTeaser() {
  return <section className="pricing-teaser wrap" aria-labelledby="pricing-teaser-heading"><div><span className="eyebrow">START SMALL. BUILD IT PROPERLY.</span><h2 id="pricing-teaser-heading">Website packages from $50.</h2><p>A free planning conversation, a written quote and a clear next step.</p></div><div><Link className="button button-gold" href="/pricing">See packages <ArrowUpRight size={16}/></Link><Link className="text-link" href="/play">Play a puzzle. Earn a discount. <ArrowUpRight size={14}/></Link></div></section>;
}
