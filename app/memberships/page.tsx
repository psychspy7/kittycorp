import Link from "next/link";
import {pageMetadata} from "@/lib/site-metadata";
import {SiteHeader} from "@/components/kitty/site";
import {SiteFooter} from "@/components/kitty/site-footer";
import {Memberships} from "@/components/kitty/memberships";
import {membershipCatalog} from "@/lib/membership-server";
import {ProductPlans} from "@/components/kitty/product-plans";
import {getCommerce} from "@/lib/commerce-server";
import {defaultCommerce} from "@/lib/commerce";
import {turnstilePublicConfig} from "@/lib/turnstile-server";
import "./memberships.css";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const metadata=pageMetadata("Product memberships","KITTY AI plans and separate LISA membership information.","/memberships");
export default async function MembershipsPage() {
 const catalogue=await membershipCatalog();
 let shared=defaultCommerce;try{shared=(await getCommerce()).settings;}catch{}
 let security=true;try{security=(await turnstilePublicConfig()).enabled;}catch{}
 return <><SiteHeader/><main id="main" className="memberships-page wrap">
 <span className="eyebrow">KITTY CORP / PRODUCT MEMBERSHIPS</span><h1>A little more time<br/>with your companion.</h1>
 <p className="membership-lead">Start with five free minutes a day. Choose KITTY Plus when you want more room to think, plan and create.</p>
 <Memberships catalog={{...catalogue,plans:catalogue.plans.filter(p=>p.product==="kitty")}} securityEnabled={security}/>
 <ProductPlans settings={shared} only="lisa"/>
 <section className="membership-help"><h2>Clear choices. Separate products.</h2><p>KITTY AI memberships and LISA AI preorders are separate. These plans do not pay for website or app projects and do not count as donations. Renewals are explicit purchases; there are no automatic debits.</p><p>A free window starts with your first chat request and resets at midnight UTC. It is elapsed time, including pauses. Requests started before the window ends can finish. Provider rate limits and service-wide availability still apply.</p>
 <nav><Link href="/projects">Website & app services</Link><Link href="/payments?purpose=donation">Optional donations</Link><Link href="/contact?subject=Review">Share honest feedback</Link></nav>
 <p>Questions? <a href="mailto:kittycorp.info@gmail.com">kittycorp.info@gmail.com</a> · <a href="https://www.linkedin.com/in/virat-anand-928460442/" target="_blank" rel="noopener noreferrer">Virat Anand on LinkedIn</a></p></section>
 </main><SiteFooter/></>;
}
