import Link from "next/link";
import {CustomerAccountBoundary} from "@/components/kitty/customer-account-boundary";
import {notFound} from "next/navigation";
import {SiteHeader} from "@/components/kitty/site";
import {SiteFooter} from "@/components/kitty/site-footer";
import {CustomerProjectQuote} from "@/components/kitty/customer-project-quote";
import {publicPaymentProviders} from "@/lib/commerce-server";
import {turnstilePublicConfig} from "@/lib/turnstile-server";
import "../../../payments/payments.css";
export const dynamic="force-dynamic";
export const metadata={title:"My project quote",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^[a-f0-9-]{36}$/.test(id))notFound();const [providers,security]=await Promise.all([publicPaymentProviders(),turnstilePublicConfig()]);const provider=providers.find(p=>p.provider==="razorpay");return <><SiteHeader/><main id="main" className="public-page wrap customer-quote-page"><Link className="text-link" href="/account">← My account</Link><CustomerAccountBoundary><CustomerProjectQuote accountId={id} keyId={provider?.clientId||""} testMode={provider?.testMode??true} securityEnabled={security.enabled}/></CustomerAccountBoundary></main><SiteFooter/></>;}
