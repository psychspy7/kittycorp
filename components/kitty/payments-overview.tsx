"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, CreditCard, Heart, ShieldCheck } from "lucide-react";
import { paymentOptionsForPurpose, type PublicProvider } from "@/lib/commerce";

const ContributionCheckout = dynamic(() => import("./payment-checkout").then(module => module.PaymentCheckout), {
  ssr: false,
  loading: () => <p className="checkout-loading" role="status">Loading secure checkout…</p>,
});

export function PaymentsOverview({ options, securityEnabled, includeContribution = true }: { options: PublicProvider[]; securityEnabled: boolean; includeContribution?: boolean }) {
  const [contributing, setContributing] = useState(false);
  const projectReady = paymentOptionsForPurpose(options, "project").length > 0;
  const contributionReady = options.length > 0;
  const live = options.some(option => !option.testMode);
  return <section id="payments" className="payments-overview wrap" aria-labelledby="payments-heading">
    <div className="section-heading"><div><span className="eyebrow">PAYMENTS &amp; SUPPORT</span><h2 id="payments-heading">A clear next step.</h2></div><p>Pay an agreed project quote or make an entirely voluntary contribution to our research.</p></div>
    <div className="payment-paths payment-paths-pair">
      <article className="payment-path"><CreditCard size={24} strokeWidth={1.5} aria-hidden="true"/><span className="payment-path-label">CLIENT PROJECTS</span><h3>Project payment</h3><p>{projectReady ? "Have an agreed quote? Check the amount and enter the reference we sent you before paying." : "We agree on scope and price with you first. Project checkout opens when a quote is ready."}</p><Link className="text-link" href={projectReady ? "/payments?purpose=project" : "/projects"}>{projectReady ? "Open project checkout" : "Discuss a project"} <ArrowUpRight size={16} aria-hidden="true"/></Link></article>
      {includeContribution && <article className="payment-path payment-path-contribution"><Heart size={24} strokeWidth={1.5} aria-hidden="true"/><span className="payment-path-label">VOLUNTARY SUPPORT</span><h3>Support KITTY CORP</h3><p>Help fund independent robotics and clean-energy research. Contributions do not purchase a product, membership or ownership interest.</p>{contributionReady ? <button type="button" className="button button-gold" aria-expanded={contributing} aria-controls="contribution-checkout" onClick={() => setContributing(true)}>{contributing ? "Checkout is open below" : "Choose a contribution"}<ArrowUpRight size={16} aria-hidden="true"/></button> : <Link className="text-link" href="/contact">Ask about contributions <ArrowUpRight size={16} aria-hidden="true"/></Link>}</article>}
    </div>
    {contributionReady && <p className="payment-hub-security"><ShieldCheck size={14} aria-hidden="true"/>{live ? `Secure checkout via ${options.filter(option => !option.testMode).map(option => option.name).join(", ")}. Available payment methods appear in checkout.` : "Test checkout only. No real money is charged."}</p>}
    {includeContribution && contributing && <div id="contribution-checkout" className="home-contribution"><div><span className="eyebrow">THANK YOU FOR THE SUPPORT</span><h3>A contribution of your choice.</h3><p>For Razorpay, contributions start at ₹1. Select an amount, then choose UPI, cards or another available method.</p><Link className="text-link" href="/payments?purpose=donation">Open the dedicated payment page <ArrowUpRight size={16} aria-hidden="true"/></Link></div><ContributionCheckout options={options} purpose="donation" securityEnabled={securityEnabled}/></div>}
  </section>;
}

export function ContributionSection({options,securityEnabled}:{options:PublicProvider[];securityEnabled:boolean}) {
 const [open,setOpen]=useState(false);
 return <section id="support" className="contribution-section wrap" aria-labelledby="support-heading"><div className="contribution-intro"><span className="eyebrow">INDEPENDENT WORK, SHARED PROGRESS</span><h2>Help us keep building.</h2><p>Your voluntary contribution supports KITTY CORP's physical prototypes and research. Choose any amount; a contribution does not purchase product access.</p>{options.length>0?<button className="button button-gold" type="button" aria-expanded={open} aria-controls="bottom-contribution-checkout" onClick={()=>setOpen(true)}>{open?"Checkout is open below":"Make a contribution"}<Heart size={16} aria-hidden="true"/></button>:<Link className="button button-outline" href="/contact">Contact the team</Link>}</div>{open&&<div id="bottom-contribution-checkout"><ContributionCheckout options={options} purpose="donation" securityEnabled={securityEnabled}/></div>}</section>;
}
