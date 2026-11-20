import type { Metadata } from "next";
import { pageMetadata, websiteOrigin, jsonLd } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { BusinessProof, BusinessEnquiry, SegmentLinks } from "@/components/kitty/business-conversion";
import { HomeProcess } from "@/components/kitty/professional-home";
import { DeliverySupport } from "@/components/kitty/home-sections";
import { serviceOffers } from "@/lib/business-content";
import { publishedLaunches } from "@/lib/launches-server";
import { sitePageContent } from "@/lib/site-pages-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await sitePageContent("services");
  return pageMetadata(copy.seoTitle, copy.seoDescription, "/services");
}

function splitLines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export default async function ServicesPage() {
  const [launches, copy] = await Promise.all([
    publishedLaunches().catch(() => []),
    sitePageContent("services"),
  ]);

  const copyByOffer = {
    websites: {
      audience: copy.websiteAudience,
      problem: copy.websiteProblem,
      deliverables: copy.websiteDeliverables,
      separate: copy.websiteSeparate,
    },
    applications: {
      audience: copy.softwareAudience,
      problem: copy.softwareProblem,
      deliverables: copy.softwareDeliverables,
      separate: copy.softwareSeparate,
    },
    automation: {
      audience: copy.automationAudience,
      problem: copy.automationProblem,
      deliverables: copy.automationDeliverables,
      separate: copy.automationSeparate,
    },
  };

  const editableOffers = serviceOffers.map((item) => {
    const value = copyByOffer[item.id as keyof typeof copyByOffer] || {};
    return {
      ...item,
      ...value,
      deliverables: value.deliverables ? splitLines(value.deliverables) : item.deliverables,
    };
  });

  const data = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "KITTY CORP digital and AI services",
    itemListElement: editableOffers.map((item) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: item.title,
        description: item.problem,
        provider: {
          "@type": "Organization",
          name: "KITTY CORP",
          url: websiteOrigin(),
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />

        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-6 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">Digital Solutions Studio</span>
          </div>
          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            {copy.title}
          </h1>
          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl mb-8">
            {copy.intro}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)]"
              href="#project-enquiry"
            >
              <span>{copy.primaryCta}</span>
              <ArrowUpRight size={16} />
            </a>
            <a
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2457D6] hover:underline"
              href="#work"
            >
              <span>{copy.secondaryCta}</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" aria-label="Client services">
          {editableOffers.map((item, index) => (
            <article id={item.id} key={item.id} className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#2457D6] font-medium block mb-2">
                  0{index + 1} · {item.title}
                </span>
                <h2 className="text-2xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-3">
                  {item.title}
                </h2>
                <p className="text-[#191B1D] text-sm font-medium mb-3">{item.audience}</p>
                <p className="text-[#62676D] text-sm leading-relaxed font-light mb-6">{item.problem}</p>
                
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#73777C] mb-3">Scope &amp; Deliverables</h3>
                <ul className="space-y-2 mb-6 list-none p-0 text-sm text-[#292D31]">
                  {item.deliverables.map((value, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] mt-2 flex-shrink-0" />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>

                {item.id === "websites" && (
                  <div className="p-4 rounded-xl border border-[#D9D6CF] bg-[#F5F2EA] mb-6">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white border border-[#D9D6CF] text-[#292D31]">Live Demos</span>
                    <h4 className="text-sm font-medium text-[#191B1D] mt-2 mb-1">Explore 18 Live Website Demos</h4>
                    <p className="text-xs text-[#62676D] mb-3">Test bookings, forms, and workflows at demo.thekittycorp.com before we begin.</p>
                    <a
                      className="text-xs font-medium text-[#2457D6] hover:underline inline-flex items-center gap-1"
                      href="https://demo.thekittycorp.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Explore Demos</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#D9D6CF] flex items-center justify-between">
                <span className="text-xs text-[#73777C] font-mono">{item.separate}</span>
                <a
                  className="text-xs font-medium text-[#2457D6] inline-flex items-center gap-1 hover:underline"
                  href="#project-enquiry"
                >
                  Brief this build <ArrowUpRight size={13} />
                </a>
              </div>
            </article>
          ))}
        </section>

        <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-[#292D31] font-light">{copy.priceNote}</p>
          <Link href="/pricing" className="text-sm font-medium text-[#2457D6] hover:underline flex items-center gap-1">
            See packages and inclusions <ArrowUpRight size={15} />
          </Link>
        </div>

        <SegmentLinks />
        <BusinessProof launches={launches} />
        <HomeProcess />
        <DeliverySupport />
        <div id="project-enquiry" className="mt-16">
          <BusinessEnquiry />
        </div>

        <p className="text-center text-xs text-[#73777C] mt-12">
          Already working together? Use your private quote link or <Link href="/account" className="underline text-[#2457D6]">customer account</Link> for agreed project payments.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
