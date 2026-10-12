import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CustomerProjectQuote } from "@/components/kitty/customer-project-quote";
import { publicPaymentProviders } from "@/lib/commerce-server";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import "../../payments/payments.css";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export const metadata={title:"Your project quote",robots:{index:false,follow:false}};
export default async function Page(){const [providers,security]=await Promise.all([publicPaymentProviders(),turnstilePublicConfig()]);const razorpay=providers.find(p=>p.provider==='razorpay');return <><SiteHeader/><main id="main" className="public-page wrap customer-quote-page"><CustomerProjectQuote keyId={razorpay?.clientId||''} testMode={razorpay?.testMode??true} securityEnabled={security.enabled}/></main><SiteFooter/></>;}
