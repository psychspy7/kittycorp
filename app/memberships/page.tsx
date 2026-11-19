import Link from "next/link";
import { pageMetadata } from "@/lib/site-metadata";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { Memberships } from "@/components/kitty/memberships";
import { membershipCatalog } from "@/lib/membership-server";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import "./memberships.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "1-Year Verified Membership & Research Support",
  "Verified patron membership and voluntary technological research support for KITTY CORP AI robotics and physical-world intelligence.",
  "/memberships"
);

export default async function MembershipsPage() {
  const catalogue = await membershipCatalog();
  let security = true;
  try {
    security = (await turnstilePublicConfig()).enabled;
  } catch {}

  return (
    <>
      <SiteHeader />
      <main id="main" className="memberships-page wrap">
        <span className="eyebrow">KITTY CORP · RESEARCH PATRON ARCHITECTURE</span>
        <h1>
          1-Year Verified Membership.
          <br />
          Physical AI &amp; Robotics Research.
        </h1>
        <p className="membership-lead">
          Support independent AI robotics research pursuing physical-world intelligence. Verified members receive our laser-etched metallic NFC card, private engineering briefings, and direct updates from founder Virat Anand.
        </p>
        <Memberships catalog={catalogue} securityEnabled={security} />
        <section className="membership-help">
          <h2>Clear Inclusions &amp; Non-Equity Disclosures</h2>
          <p>
            <strong>Clear Inclusions:</strong> Verified physical NFC metallic member card, cryptographic digital credentials, invitations to quarterly engineering briefings, early access to whitepapers, and direct updates on Project 01 (AgriYaan) and Project 02 (Green Energy).
          </p>
          <p>
            <strong>Strict Non-Equity Exclusions:</strong> KITTY CORP Memberships and research support contributions are strictly non-equity and non-investment in nature. They do NOT represent equity shares, debt instruments, voting rights, profit-sharing, or commercial securities. Hardware delivery dates are tied strictly to future laboratory milestones. Commercial software contracts and web solutions are contracted separately through{" "}
            <a href="https://demo.thekittycorp.com" target="_blank" rel="noopener noreferrer" className="underline">
              KITTY CORP Digital Solutions Studio ↗
            </a>
            .
          </p>
          <nav>
            <Link href="/projects">Research Projects</Link>
            <Link href="/research">Lab Whitepapers</Link>
            <Link href="/payments?purpose=donation">Voluntary Research Support</Link>
            <Link href="/contact">Inquire for Private Access</Link>
          </nav>
          <p>
            Inquiries: <a href="mailto:contact@thekittycorp.com">contact@thekittycorp.com</a> ·{" "}
            <a href="https://www.linkedin.com/in/virat-anand-928460442/" target="_blank" rel="noopener noreferrer">
              Virat Anand on LinkedIn
            </a>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
