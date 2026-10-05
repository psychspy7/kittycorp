import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";

export const metadata = {
  title: "Website privacy",
  description: "How KITTY CORP uses website forms, early-access email addresses and optional analytics.",
};

export default function Privacy() {
  return <><SiteHeader/><main id="main" className="public-page wrap">
    <div className="article-header"><span className="eyebrow">WEBSITE PRIVACY</span><h1>Your information.<br/>A clear purpose.</h1><p>How our website forms, early list and optional analytics work.</p></div>
    <div className="article-main article-body">
      <h2>The early list</h2><p>We save the email address and product interests you choose, along with the time you joined. We use them for development updates and invitations to test KITTY products. Joining does not guarantee access or a release date. We do not sell the list or use it for third-party advertising.</p>
      <h2>Contact messages</h2><p>We save your name, email address and message so the team can read and respond. If you send a website or app enquiry, this includes the business name, budget, timeline and project details you choose to share. The forms are stored in our website’s Supabase project and are accessible through our private Studio.</p>
      <h2>Abuse prevention and hosting</h2><p>Our form service creates a keyed hash of the request’s IP address to limit repeated submissions. Form records store this hash, rather than a raw IP address. Our hosting and database providers may process IP addresses and request information in their operational logs.</p>
      <h2 id="analytics">Optional Google Analytics</h2><p>If you allow analytics, we use Google Analytics 4 to understand visits to our public pages, which pages are useful and how visitors find the website. The Google tag loads only after you allow it. Declining does not affect the website or its forms.</p><p>Analytics may use cookies and process browser, device and visit information. Google receives requests from your device when analytics is enabled. Our page-view events use public page paths without query strings or fragments. We do not send form field values, names, email addresses or message contents as analytics events. Studio pages are excluded.</p><p>You can change your choice using <strong>Analytics settings</strong> in the footer when analytics is configured. Declining stops future Analytics collection and removes this website’s Google Analytics cookies. It does not remove information already collected. Advertising consent and Google signals are disabled in our integration. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a> for how Google processes information.</p>
      <h2>Local browser storage</h2><p>We remember your analytics choice in local browser storage for up to 180 days. The launch announcement uses session storage to remember that you’ve seen it during your visit. Studio sign-in uses a secure session cookie. These preferences and sign-in controls are separate from optional analytics.</p>
      <h2>Removing your information</h2><p>Contact us from the email you used and ask us to remove your early-access entry or message. The team can remove your stored records. We retain them until you ask for removal or the list or conversation is no longer needed; provider backups may persist for their normal retention period.</p>
      <h2>SecretChat is separate</h2><p>SecretChat’s message handling, local history and security limits are described on its product page. This page covers the KITTY CORP website.</p>
      <Link href="/contact?subject=Privacy" className="button button-outline">Contact us about privacy</Link>
    </div>
  </main><SiteFooter/></>;
}
