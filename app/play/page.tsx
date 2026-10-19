import Link from "next/link";
import { companySettings } from "@/lib/company-server";
import { FOUNDER_LINKEDIN, isFounderLinkedIn } from "@/lib/company-contact";
import "./snake.css";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { DiscountGame } from "@/components/kitty/discount-game";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import { pageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Play & save", "Play Snake: 50 points earns 5% off, 70 earns 7%. Follow our three social profiles and confirm before claiming.", "/play");
export default async function PlayPage() {
  const [security, settings] = await Promise.all([turnstilePublicConfig(), companySettings()]);
  function profile(value: string | undefined, hosts: string[], fallback: string) {
    try { const url = new URL(value || ""); if (url.protocol === "https:" && hosts.includes(url.hostname.replace(/^www\./, ""))) return url.href; } catch {}
    return fallback;
  }
  const linkedin = profile(settings.socials.linkedin, ["linkedin.com"], FOUNDER_LINKEDIN);
  const socials = [
    { id: "instagram" as const, label: "Instagram", href: profile(settings.socials.instagram, ["instagram.com"], "https://www.instagram.com/kittycorpHQ/") },
    { id: "x" as const, label: "X", href: profile(settings.socials.x, ["x.com", "twitter.com"], "https://x.com/KittyCorphq") },
    { id: "linkedin" as const, label: isFounderLinkedIn(linkedin) ? "Virat Anand on LinkedIn" : "LinkedIn", href: linkedin },
  ];
  return <><SiteHeader/><main id="main" className="public-page wrap play-page"><div className="page-heading"><span className="eyebrow">A LITTLE OFF THE CLOCK</span><h1>One more bite.<br/>A little less to pay.</h1><p>A classic Snake challenge. Every bite adds a point and a little more speed. No purchase or email needed to play. Follow Instagram, X and LinkedIn, then self-confirm before claiming a reward.</p></div><DiscountGame securityEnabled={security.enabled} socials={socials}/><section className="reward-terms"><h2>How the offer works</h2><p>50 points earns 5%; 70 earns 7%. You can stop at 50, or keep playing: crashing after 50 does not lose your earned tier. Following all three linked social profiles is required to claim. Confirmation is self-reported; we do not access your social accounts or independently verify follows. One active code per visitor/network, valid for 30 days and one eligible purchase. Share it before paying. The team verifies it in Studio and can apply it to an unlocked project quote, or arrange an eligible KITTY AI or LISA purchase. Existing app checkout does not apply codes automatically.</p><p>The largest discount applies; offers do not stack with advance-payment reductions or other promotions. The discount covers our eligible product or development price, excluding taxes and third-party domains, hosting, subscriptions and usage. Codes have no cash value and cannot be applied retrospectively to paid orders. <Link href="/contact?subject=Reward%20code">Ask us before paying</Link> if anything is unclear.</p></section></main><SiteFooter/></>;
}
