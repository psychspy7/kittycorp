"use client";

import Link from "next/link";
import { ArrowUpRight, Coffee, CreditCard, ShieldCheck } from "lucide-react";
import { paymentOptionsForPurpose, type PublicProvider } from "@/lib/commerce";

export function PaymentsOverview({ options, securityEnabled, includeContribution = true }: { options: PublicProvider[]; securityEnabled: boolean; includeContribution?: boolean }) {
  const projectReady = paymentOptionsForPurpose(options, "project").length > 0;
  const fuelReady = options.some(option => option.provider === "razorpay");
  const live = options.some(option => !option.testMode);
  return <section id="payments" className="payments-overview wrap" aria-labelledby="payments-heading">
    <div className="section-heading"><div><span className="eyebrow">PAYMENTS</span><h2 id="payments-heading">Payments, made clear.</h2></div><p>Pay an agreed project quote or make a separate Fuel Us coffee purchase.</p></div>
    <div className="payment-paths payment-paths-pair">
      <article className="payment-path"><CreditCard size={24} strokeWidth={1.5} aria-hidden="true"/><span className="payment-path-label">CLIENT PROJECTS</span><h3>Project payment</h3><p>{projectReady ? "Have an agreed quote? Check the amount and enter the reference we sent you before paying." : "We agree on scope and price with you first. Project checkout opens when a quote is ready."}</p><Link className="text-link" href={projectReady ? "/payments?purpose=project" : "/projects"}>{projectReady ? "Open project checkout" : "Discuss a project"} <ArrowUpRight size={16} aria-hidden="true"/></Link></article>
      {includeContribution && <article className="payment-path payment-path-contribution"><Coffee size={24} strokeWidth={1.5} aria-hidden="true"/><span className="payment-path-label">A SMALL PURCHASE</span><h3>Fuel Us ☕</h3><p>Buy KITTY CORP a coffee. This is a separate purchase, not KITTY ONE membership or a project payment.</p><Link className="button button-gold" href="/support">Buy us a coffee <ArrowUpRight size={16} aria-hidden="true"/></Link></article>}
    </div>
    {includeContribution && <p className="payment-hub-security"><ShieldCheck size={14} aria-hidden="true"/>{fuelReady ? (live ? "Secure Razorpay checkout is available. Payment methods appear in checkout." : "Razorpay test checkout only. No real money is charged.") : "Fuel Us checkout is temporarily unavailable."}</p>}
  </section>;
}

export function ContributionSection({options,securityEnabled}:{options:PublicProvider[];securityEnabled:boolean}) {
  const available = options.some(option => option.provider === "razorpay");
  return <section id="support" className="contribution-section wrap" aria-labelledby="support-heading"><div className="contribution-intro"><span className="eyebrow">A SMALL PURCHASE · A LITTLE FUEL</span><h2>Fuel Us ☕</h2><p>Buy KITTY CORP a coffee through a separate purchase. KITTY ONE membership and project payments are separate.</p>{available?<Link className="button button-gold" href="/support">Buy Us a Coffee</Link>:<Link className="button button-outline" href="/contact">Contact the team</Link>}</div></section>;
}
