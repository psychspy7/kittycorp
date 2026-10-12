import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { PaymentCheckout } from "@/components/kitty/payment-checkout";
import { PaymentsOverview } from "@/components/kitty/payments-overview";
import { publicPaymentProviders } from "@/lib/commerce-server";
import { paymentOptionsForPurpose } from "@/lib/commerce";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import "./payments.css";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Plans & payments", robots: { index: false, follow: false } };

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ purpose?: string | string[] }> }) {
  const [query, options, security] = await Promise.all([searchParams, publicPaymentProviders(), turnstilePublicConfig()]);
  const purpose = query.purpose === "donation" ? "donation" : query.purpose === "project" ? "project" : null;
  if (!purpose) return <><SiteHeader/><main id="main" className="public-page payments-hub-page"><PaymentsOverview options={options} securityEnabled={security.enabled}/></main><SiteFooter/></>;
  const available = paymentOptionsForPurpose(options, purpose);
  return <><SiteHeader/><main id="main" className="public-page wrap payments-page">
    <div className="payments-intro">
      <Link href="/payments" className="text-link"><ArrowLeft size={15} aria-hidden="true"/>All plans & payments</Link>
      <span className="eyebrow">KITTY CORP / {purpose === "donation" ? "SUPPORT" : "PROJECT PAYMENTS"}</span>
      <h1>{purpose === "donation" ? "Support the independent work." : "For the work we’re building together."}</h1>
      <p>{purpose === "donation" ? "Make a voluntary contribution towards our products and experiments. Choose your amount, then continue to secure checkout." : "Start with a project brief. Your private quote offers full advance, a 50/50 schedule or review-first payment. Already have a quote link? Open it to see your agreed amount."}</p>
      <nav className="payment-purpose-nav" aria-label="Payment type"><Link href="/payments?purpose=project" aria-current={purpose === "project" ? "page" : undefined}>Project payment</Link><Link href="/payments?purpose=donation" aria-current={purpose === "donation" ? "page" : undefined}>Support KITTY</Link><Link href="/memberships">Product plans</Link></nav>
      <p className="payments-note">{purpose === "donation" ? "Contributions are optional. They do not purchase a product, membership or ownership in KITTY CORP." : "Check the total against your quote before paying. Contact us if it differs. Payment is recorded separately from project delivery."}</p>
    </div>
    {available.length ? <PaymentCheckout options={available} purpose={purpose} securityEnabled={security.enabled}/> : <section className="checkout-card">
      <span className="checkout-mode">{purpose === "project" && options.length ? "QUOTE REQUIRED" : "CHECKOUT UNAVAILABLE"}</span>
      <h2>{purpose === "project" && options.length ? "Your quote comes first." : "Checkout is temporarily unavailable."}</h2>
      <p>{purpose === "project" && options.length ? "There is no active project amount right now. Tell us what you need and we’ll agree on scope, cost and a payment reference before you pay. Product pricing and donations are separate." : "Please contact KITTY CORP if you were expecting to make a payment. No payment has been taken."}</p>
      <Link className="button button-gold" href={purpose === "project" ? "/projects" : "/contact"}>{purpose === "project" ? "Request a quote" : "Contact KITTY CORP"}</Link>
      {purpose === "project" && options.length > 0 && <Link className="text-link checkout-secondary" href="/payments?purpose=donation">Looking to support KITTY instead?</Link>}
    </section>}
  </main><SiteFooter/></>;
}
