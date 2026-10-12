import Link from "next/link";
import {SiteHeader} from "@/components/kitty/site";
import {SiteFooter} from "@/components/kitty/site-footer";
import LisaPreorderCheckout from "@/components/kitty/lisa-preorder-checkout";
import {getCommerce,publicPaymentProviders} from "@/lib/commerce-server";
import {turnstilePublicConfig} from "@/lib/turnstile-server";
import "../../payments/payments.css";
export const dynamic="force-dynamic";
export const metadata={title:"LISA AI refundable preorder",robots:{index:false,follow:false}};
export default async function Page(){const [{settings},providers,security]=await Promise.all([getCommerce(),publicPaymentProviders(),turnstilePublicConfig()]);const provider=providers.find(p=>p.provider==="razorpay"&&!p.testMode);return <><SiteHeader/><main id="main" className="public-page wrap lisa-preorder-page"><Link className="text-link" href="/lisa-ai">← Explore the LISA development</Link><div className="page-heading"><span className="eyebrow">LISA AI / REFUNDABLE PREORDER</span><h1>Be part of the early build.</h1><p>LISA is still in development. Reserve lifetime access to the purchased version, follow the work and try early releases when they’re ready.</p></div><LisaPreorderCheckout provider={provider||null} published={settings.plans.lisa.published} price={settings.plans.lisa.priceMinor} securityEnabled={security.enabled}/></main><SiteFooter/></>;}
