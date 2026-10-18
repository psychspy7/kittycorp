import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { DiscountGame } from "@/components/kitty/discount-game";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import { pageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Play & save", "Solve KITTY CORP’s circuit puzzle to earn a 5% or 7% offer code.", "/play");
export default async function PlayPage() {
  const security = await turnstilePublicConfig();
  return <><SiteHeader/><main id="main" className="public-page wrap play-page"><div className="page-heading"><span className="eyebrow">A LITTLE OFF THE CLOCK</span><h1>Think it through.<br/>Earn a little off.</h1><p>An optional puzzle for people who enjoy figuring things out. No purchase or email needed to play.</p></div><DiscountGame securityEnabled={security.enabled}/><section className="reward-terms"><h2>How the offer works</h2><p>A completed circuit earns 5%; a shortest route earns 7%. One active code per visitor/network, valid for 30 days and one eligible purchase. Share it before paying. The team verifies it in Studio and can apply it to an unlocked project quote, or arrange an eligible KITTY AI or LISA purchase. Existing app checkout does not apply codes automatically.</p><p>The largest discount applies; offers do not stack with advance-payment reductions or other promotions. The discount covers our eligible product or development price, excluding taxes and third-party domains, hosting, subscriptions and usage. Codes have no cash value and cannot be applied retrospectively to paid orders. <Link href="/contact?subject=Reward%20code">Ask us before paying</Link> if anything is unclear.</p></section></main><SiteFooter/></>;
}
