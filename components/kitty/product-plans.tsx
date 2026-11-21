import {LocalPrice} from "./local-currency";
import Link from "next/link";
import { ArrowUpRight,Check } from "lucide-react";
import type { CommerceSettings } from "@/lib/commerce";

export function ProductPlans({settings,only}:{settings:CommerceSettings;only?:"kitty"}){
  const plans = (["kitty"] as const).filter(key => (!only || key === only) && settings.plans[key]?.published);
  if(!plans.length)return null;
  return (
    <section className="product-plans" aria-labelledby={only?`${only}-plans-heading`:"plans-heading"}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">PRODUCT ACCESS</span>
          <h2 id={only?`${only}-plans-heading`:"plans-heading"}>Choose what you want to explore.</h2>
        </div>
        <p>Product plans and membership access.</p>
      </div>
      <div className={`plan-grid ${only?"single-plan":""}`}>
        {plans.map(key => {
          const plan = settings.plans[key];
          if (!plan) return null;
          return (
            <article className="product-plan" key={key}>
              <span className="quiet-status">KITTY AI MEMBERSHIP</span>
              <h3>{plan.title}</h3>
              <div className="plan-price">
                <strong>{new Intl.NumberFormat(plan.currency==="USD"?"en-US":"en-IN",{style:"currency",currency:plan.currency,minimumFractionDigits:plan.priceMinor%100?2:0,maximumFractionDigits:2}).format(plan.priceMinor/100)}</strong>
                <span>{plan.period==="month"?"/ month":"one-time"}</span>
              </div>
              <LocalPrice amount={plan.priceMinor} base={plan.currency} charged={false}/>
              <p>{plan.summary}</p>
              <ul>
                {plan.features.map((feature: string) => (
                  <li key={feature}><Check size={15} aria-hidden="true"/>{feature}</li>
                ))}
              </ul>
              <Link className="button button-outline" href="/memberships">View KITTY AI plans<ArrowUpRight size={16}/></Link>
              <p className="plan-note">Review the exact amount and terms before paying.</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
