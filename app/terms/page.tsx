import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";
import { CONTACT_EMAIL } from "@/lib/company-contact";

export const metadata = pageMetadata("Website & service terms", "How KITTY CORP handles project requests, quotes, delivery and payments.", "/terms");

export default function TermsPage() {
  return <><SiteHeader/><main id="main" className="public-page wrap"><div className="article-header"><span className="eyebrow">WEBSITE & SERVICE TERMS</span><h1>Clear expectations<br/>make better work.</h1><p>Last updated 18 October 2026. Your written quote and product checkout provide the details for a purchase.</p></div><div className="article-main article-body">
    <h2>Who we are</h2><p>KITTY CORP is an independent technology project. Contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> for project, purchase or support questions. We do not claim a particular company registration unless verified details are published.</p>
    <h2>Project requests and appointments</h2><p>A first conversation, appointment request or project brief is free. A requested time is confirmed only when we reply. Submitting a brief does not oblige either side to proceed. We may decline work outside our capacity or expertise.</p>
    <h2>Quotes and starting prices</h2><p>Basic Website starts at US$50, Premium Website at US$100 and AI Website at US$149. These are starting points; each project gets a written scope, deliverables, timeline, price, charged currency and any third-party or recurring costs before payment. The proposed US$200 KITTY AI bundle covers two scoped Premium Website builds once and 30 days of KITTY AI Plus access; LISA AI is excluded. We confirm delivery capacity and access before accepting a bundle payment.</p>
    <h2>Payment choices</h2><p>Once we approve a private quote, full advance gives 2.5% off. A half-now, half-after-preview schedule gives 1% off new requests. Earlier quotes keep their original terms. You may discuss the work before paying. A quote is charged only in the currency stated at checkout.</p>
    <h2>Delivery and support</h2><p>We agree on acceptance criteria, revisions, source handover, ownership of commissioned work and launch responsibilities in writing. Free maintenance applies where the quote states its coverage and duration. A successful paid referral adds three months to an eligible agreed maintenance term. New features, hosting, domains and third-party usage are separate unless included.</p>
    <h2>Products and responsible use</h2><p>KITTY AI and LISA AI have separate software and access terms. A plan does not grant another product unless the offer says so. Development previews can differ from release builds. Use the website lawfully; do not abuse forms, share another person’s private data or access private project links without permission. The website assistant can make mistakes and is not professional advice.</p>
    <h2>Payments, changes and privacy</h2><p>Payment providers handle card details; we keep verified order references. See <Link href="/refunds">refunds and cancellations</Link> and <Link href="/privacy">privacy</Link>. Public terms may change, but a later edit does not silently rewrite an agreed quote. Applicable consumer rights remain in force.</p>
    <Link href="/contact?subject=Terms" className="button button-outline">Ask us about these terms</Link>
  </div></main><SiteFooter/></>;
}
