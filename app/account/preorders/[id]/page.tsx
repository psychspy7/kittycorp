import Link from "next/link";
import {CustomerAccountBoundary} from "@/components/kitty/customer-account-boundary";
import {notFound} from "next/navigation";
import {SiteHeader} from "@/components/kitty/site";
import {SiteFooter} from "@/components/kitty/site-footer";
import LisaPreorderCheckout from "@/components/kitty/lisa-preorder-checkout";
import {getCommerce,publicPaymentProviders} from "@/lib/commerce-server";
import {turnstilePublicConfig} from "@/lib/turnstile-server";
import "../../../payments/payments.css";
export const dynamic="force-dynamic";
export const metadata={title:"My LISA preorder",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^[a-f0-9-]{36}$/.test(id))notFound();const [{settings},providers,security]=await Promise.all([getCommerce(),publicPaymentProviders(),turnstilePublicConfig()]);const provider=providers.find(p=>p.provider==="razorpay"&&!p.testMode);return <><SiteHeader/><main id="main" className="public-page wrap lisa-preorder-page"><Link className="text-link" href="/account">← My account</Link><div className="page-heading"><span className="eyebrow">MY LISA RESERVATION</span><h1>Follow the early build.</h1></div><CustomerAccountBoundary><LisaPreorderCheckout accountId={id} provider={provider||null} published={settings.plans.lisa.published} price={settings.plans.lisa.priceMinor} securityEnabled={security.enabled}/></CustomerAccountBoundary></main><SiteFooter/></>;}
