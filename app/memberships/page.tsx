import Link from "next/link";
import {pageMetadata} from "@/lib/site-metadata";
import {SiteHeader} from "@/components/kitty/site";
import {SiteFooter} from "@/components/kitty/site-footer";
import {Memberships} from "@/components/kitty/memberships";
import {membershipCatalog} from "@/lib/membership-server";
import {turnstilePublicConfig} from "@/lib/turnstile-server";
import "./memberships.css";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const metadata=pageMetadata("Kitty Subscriptions & Memberships","KITTY AI and KITTY One all-access subscriptions for websites and intelligent workflows.","/memberships");
export default async function MembershipsPage() {
 const catalogue=await membershipCatalog();
 let security=true;try{security=(await turnstilePublicConfig()).enabled;}catch{}
 return <><SiteHeader/><main id="main" className="memberships-page wrap">
 <span className="eyebrow">KITTY CORP · PRODUCT SUBSCRIPTIONS</span><h1>One subscription.<br/>Websites &amp; Intelligent AI.</h1>
 <p className="membership-lead">Start with five free minutes a day with KITTY AI, upgrade to KITTY Plus for daily capacity, or unlock our complete digital &amp; AI stack with KITTY One.</p>
 <Memberships catalog={{...catalogue,plans:catalogue.plans.filter(p=>p.product==="kitty")}} securityEnabled={security}/>
 <section className="membership-help"><h2>Clear choices. Transparent value.</h2><p>KITTY AI and KITTY One plans are explicit purchases with clear deliverables. Website projects include six months of agreed maintenance. Renewal and upgrade terms are agreed upfront without unexpected auto-debits.</p><p>A free window for KITTY AI resets daily at midnight UTC. Software updates, hosting, and API provisions are documented in your project specifications.</p>
 <nav><Link href="/projects">Website & app services</Link><Link href="/appointments">Request a consultation</Link><Link href="/payments?purpose=donation">Optional donations</Link><Link href="/contact?subject=Kitty%20One">Inquire about Kitty One</Link></nav>
 <p>Questions? <a href="mailto:kittycorp.info@gmail.com">kittycorp.info@gmail.com</a> · <a href="https://www.linkedin.com/in/virat-anand-928460442/" target="_blank" rel="noopener noreferrer">Virat Anand on LinkedIn</a></p></section>
 </main><SiteFooter/></>;
}
