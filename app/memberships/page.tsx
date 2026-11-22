import { pageMetadata } from "@/lib/site-metadata";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { Memberships } from "@/components/kitty/memberships";
import { membershipCatalog } from "@/lib/membership-server";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import "./memberships.css";
import "@/components/kitty/payment-result.css";
import "@/components/kitty/payment-result.css";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "KITTY ONE | Research Support Membership",
  "KITTY ONE is a voluntary annual supporter membership for KITTY CORP research, with briefings, updates and benefits. It is not equity or an investment.",
  "/memberships"
);

export default async function MembershipsPage() {
  const [security, catalog] = await Promise.all([turnstilePublicConfig(), membershipCatalog()]);
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="pt-24 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-8 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">Patron Network · Single Annual Membership</span>
          </div>

          <h1 className="text-[clamp(30px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            KITTY ONE Membership
          </h1>

          <p className="text-[19px] sm:text-[22px] font-light leading-[1.45] text-[#62676D] max-w-2xl">
            A single, all-inclusive annual membership supporting independent physical-world intelligence, agricultural robotics, and clean energy systems.
          </p>
        </div>

        <Memberships catalog={catalog} securityEnabled={security.enabled && Boolean(security.siteKey)} />

        <section className="mt-16 p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7]">
          <h2 className="text-2xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            Membership Disclosures
          </h2>
          <p className="text-[#62676D] text-sm leading-relaxed mb-4">
            KITTY ONE is an annual supporter membership providing research updates, prototype briefings, and select member benefits. It does not confer equity, profit sharing, or voting rights in KITTY CORP.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
