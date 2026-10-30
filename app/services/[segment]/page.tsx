import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { BusinessEnquiry } from "@/components/kitty/business-conversion";
import { serviceSegments, type ServiceSegment } from "@/lib/business-content";
import { jsonLd, pageMetadata, websiteOrigin } from "@/lib/site-metadata";

function segmentContent(slug: string) {
  return Object.hasOwn(serviceSegments, slug) ? serviceSegments[slug as ServiceSegment] : null;
}

export function generateStaticParams() {
  return Object.keys(serviceSegments).map(segment => ({ segment }));
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params;
  const content = segmentContent(segment);
  return content ? pageMetadata(content.title, content.description, "/services/" + segment) : {};
}

export default async function SegmentPage({ params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params;
  const content = segmentContent(segment);
  if (!content) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.title,
    description: content.description,
    provider: { "@type": "Organization", name: "KITTY CORP", url: websiteOrigin() },
    url: websiteOrigin() + "/services/" + segment
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="public-page wrap segment-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <Link href="/services">Services</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">{content.eyebrow.split("/")[1]?.trim() || "Capability"}</span>
        </nav>

        <div className="page-heading">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.heading}</h1>
          <p>{content.intro}</p>
          <div className="heading-actions">
            <a className="button button-gold" href="#project-enquiry" data-conversion="service_cta" data-context={segment}>
              Start this project <ArrowUpRight size={16} />
            </a>
            <Link className="button button-outline" href="/projects">
              Inspect past case studies <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="segment-content-grid">
          <section className="segment-outcomes-card">
            <h2>Expected Deliverables &amp; Outcomes</h2>
            <ul className="outcomes-list">
              {content.outcomes.map(item => (
                <li key={item}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="segment-guarantee-note">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Full source code IP ownership, clear milestone dates, and 6 months included maintenance.</span>
            </div>
          </section>

          <section className="segment-workflow-card">
            <span className="eyebrow">STEP-BY-STEP METHODOLOGY</span>
            <h2>How we take this from brief to production.</h2>
            <ol className="workflow-steps">
              {content.workflow.map((item, idx) => {
                const parts = item.split(":");
                const title = parts[0]?.trim();
                const desc = parts.slice(1).join(":").trim();
                return (
                  <li key={item} className="workflow-step-item">
                    <span className="step-counter">0{idx + 1}</span>
                    <div>
                      {desc ? <strong>{title}</strong> : null}
                      <p>{desc || item}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="public-note">{content.boundary}</p>
          </section>
        </div>

        <BusinessEnquiry initialService={content.service} />
        
        <div className="page-bottom-nav">
          <Link className="text-link" href="/services">
            ← Explore all engineering services
          </Link>
          <Link className="text-link" href="/pricing">
            View transparent pricing tiers →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
