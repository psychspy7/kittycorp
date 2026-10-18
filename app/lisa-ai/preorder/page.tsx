import Link from "next/link";
import {SiteHeader} from "@/components/kitty/site";
import {SiteFooter} from "@/components/kitty/site-footer";
import LisaPreorderCheckout from "@/components/kitty/lisa-preorder-checkout";
import {publicPaymentProviders} from "@/lib/commerce-server";
import {turnstilePublicConfig} from "@/lib/turnstile-server";
import "../../payments/payments.css";
export const dynamic="force-dynamic";
export const metadata={title:"Existing LISA reservations",robots:{index:false,follow:false}};
export default async function Page(){const [providers,security]=await Promise.all([publicPaymentProviders(),turnstilePublicConfig()]);const provider=providers.find(p=>p.provider==="razorpay"&&!p.testMode);return <><SiteHeader/><main id="main" className="public-page wrap lisa-preorder-page"><Link className="text-link" href="/lisa-ai">← Current LISA purchase details</Link><div className="page-heading"><span className="eyebrow">LISA AI / EXISTING RESERVATIONS</span><h1>Your reservation.<br/>Your original terms.</h1><p>New preorders are closed. Return through your private reservation link or My account to check an existing payment or request an eligible refund.</p></div><LisaPreorderCheckout provider={provider||null} published={false} price={9900} securityEnabled={security.enabled}/></main><SiteFooter/></>;}
