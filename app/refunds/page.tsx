import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CONTACT_EMAIL } from "@/lib/company-contact";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata=pageMetadata("Refunds & cancellations","Help with KITTY CORP project payments, product access and reservations.","/refunds");

export default function RefundsPage(){return <><SiteHeader/><main id="main" className="public-page wrap"><div className="article-header"><span className="eyebrow">REFUNDS & CANCELLATIONS</span><h1>Talk to us if something is wrong.</h1><p>Last updated 18 October 2026. Your accepted quote or checkout may give more specific terms. Applicable consumer rights remain in force.</p></div><div className="article-main article-body">
  <h2>Contact us</h2><p>Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address used for the order. Include the payment or project reference and explain the issue. Never send card numbers or passwords.</p>
  <h2>Project work</h2><p>Consultations and briefs are free. If you cancel a paid project, we review the agreed scope, work completed and committed third-party costs. We explain any retained amount and address service failures under applicable law. A split balance is due only at the preview milestone in the quote.</p>
  <h2>Product access</h2><p>KITTY AI access and renewal terms appear at checkout. The proposed 30-day website bundle is scoped individually before payment. If access fails or you were charged twice, contact us with the order reference.</p>
  <h2>LISA</h2><p>Existing paid reservations retain their accepted refundable preorder terms. A full refund is available before early access is provided; request it through your reservation page. Direct purchase terms will be shown before a downloadable release is offered for sale.</p>
  <h2>Processing</h2><p>Approved refunds normally return through the original payment provider. Timing depends on that provider and your bank. We explain any legally permitted difference due to fees, tax or exchange rates. Contact us promptly about mistaken or duplicate contributions.</p>
  <p><Link href="/terms">Service terms</Link> · <Link href="/privacy">Privacy notice</Link></p>
  </div></main><SiteFooter/></>;}
