import { pageMetadata, websiteOrigin, jsonLd } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { BusinessProof, BusinessEnquiry, SegmentLinks } from "@/components/kitty/business-conversion";
import { HomeProcess } from "@/components/kitty/professional-home";
import { DeliverySupport } from "@/components/kitty/home-sections";
import { serviceOffers } from "@/lib/business-content";
import { publishedLaunches } from "@/lib/launches-server";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "Engineering Capabilities & Client Services — KITTY CORP",
  "Bespoke websites, applied AI agents, mobile applications and business automation engineered with Stripe-grade discipline, clean TypeScript, and 6 months included maintenance.",
  "/services"
);

function segmentSlug(id: string) {
  if (id === "websites") return "website-development";
  if (id === "automation") return "business-automation";
  return id;
}

export default async function ServicesPage() {
  const launches = await publishedLaunches().catch(() => []);
  const data = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "KITTY CORP client services",
    itemListElement: serviceOffers.map(item => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: item.title,
        description: item.problem,
        provider: { "@type": "Organization", name: "KITTY CORP", url: websiteOrigin() }
      }
    }))
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="public-page wrap services-page conversion-services">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
        <div className="page-heading">
          <span className="eyebrow">ENGINEERING CAPABILITIES</span>
          <h1>
            Software engineered for speed,<br />
            <span>clarity and conversion.</span>
          </h1>
          <p>
            We design, develop and maintain business websites, applications and useful automation. You work directly with the senior engineers building your solution, from the first discovery session to production launch and handover.
          </p>
          <div className="service-heading-actions">
            <a className="button button-gold" href="#project-enquiry" data-conversion="service_cta" data-context="services">
              Start a project <ArrowUpRight size={17} />
            </a>
            <a className="button button-outline" href="#work" data-conversion="portfolio_view" data-context="services">
              Inspect shipped work <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <section className="service-offerings conversion-offerings" aria-label="Client services">
          {serviceOffers.map((item, index) => (
            <article id={item.id} key={item.id} className="service-card-expanded">
              <div className="service-card-header">
                <span className="micro-label">CAPABILITY 0{index + 1}</span>
                <h2>{item.title}</h2>
                <p className="service-audience">{item.audience}</p>
              </div>
              <p className="service-problem">{item.problem}</p>
              <div className="service-deliverables">
                <h3>Key Deliverables</h3>
                <ul>
                  {item.deliverables.map(value => (
                    <li key={value}>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="service-boundary">{item.separate}</p>
              <div className="service-card-actions">
                <Link className="button button-outline" href={`/services/${segmentSlug(item.id)}`}>
                  Learn more &amp; view workflow <ArrowUpRight size={15} />
                </Link>
                <a className="button button-gold" href="#project-enquiry" data-conversion="service_cta" data-context="services">
                  Enquire about {item.title} <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </section>

        <div className="service-starting-price">
          <p>Approved website packages start at $50 USD. Custom development is itemized and quoted against your exact scope.</p>
          <Link className="text-link" href="/pricing">See packages and inclusions <ArrowUpRight size={15} /></Link>
        </div>

        <SegmentLinks />
        <BusinessProof launches={launches} />
        <HomeProcess />
        <DeliverySupport />
        <BusinessEnquiry />
        <p className="existing-client-note">
          Already working together? Use your private quote link or <Link href="/account">customer account</Link> for agreed project payments.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
