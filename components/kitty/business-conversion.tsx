import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { isWebsiteLaunch, launchHref, type Launch } from "@/lib/launches";
import { mediaHref } from "@/lib/company-content";
import { AppIcon } from "./secretchat";
import { ProjectEnquiry } from "./project-enquiry";
import { serviceSegments } from "@/lib/business-content";
import type { enquiryServices } from "@/lib/enquiries";

export function BusinessProof({ launches }: { launches: Launch[] }) {
  const selected = [...launches].sort((a, b) => Number(isWebsiteLaunch(b)) - Number(isWebsiteLaunch(a))).slice(0, 3);
  return (
    <section id="work" className="business-proof wrap" aria-labelledby="proof-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">VERIFIABLE ENGINEERING EVIDENCE</span>
          <h2 id="proof-title">Featured software &amp; deployments.</h2>
        </div>
        <p>
          We build real systems with rigorous security, clean code, and zero AI slop.<br />
          Explore our published products and client case studies below.
        </p>
      </div>
      <div className="business-proof-grid">
        {selected.map(item => (
          <article className="business-proof-card" key={item.id}>
            {isWebsiteLaunch(item) && item.screenshot_path && (
              <Link href={launchHref(item)} className="business-proof-image" data-conversion="portfolio_view" data-context="home">
                <Image
                  unoptimized
                  src={mediaHref(item.screenshot_path)}
                  width={900}
                  height={600}
                  sizes="(max-width: 700px) 92vw, 30vw"
                  loading="lazy"
                  alt={`${item.name} published website preview`}
                />
              </Link>
            )}
            <div className="business-proof-copy">
              <div className="business-proof-label">
                <AppIcon launch={item} size={36} />
                <span className="micro-label">
                  {isWebsiteLaunch(item) ? "PRODUCTION WEB ARCHITECTURE" : "NATIVE ANDROID RELEASE"}
                </span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.tagline}</p>
              <Link className="text-link" href={launchHref(item)} data-conversion="portfolio_view" data-context="home">
                Inspect architecture &amp; release <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!selected.length && (
        <p>Explore our published releases and development notes in the product directory.</p>
      )}
      <div className="proof-action-row">
        <Link className="button button-outline" href="/projects" data-conversion="portfolio_view" data-context="home">
          Explore all client work &amp; case studies <ArrowUpRight size={16} />
        </Link>
      </div>
      <Achievement />
    </section>
  );
}

export function Achievement() {
  return (
    <aside className="achievement-note" aria-labelledby="achievement-title">
      <div>
        <span className="eyebrow">OCTOBER 2026 / TEAM MILESTONE</span>
        <h3 id="achievement-title">Team Prometheus: Top 500 at Hack in Hills ’26.</h3>
        <p>
          Virat Anand’s team was shortlisted for Round 2 prototype development, as confirmed in the organizers’ selection email. The team is currently building and demonstrating the working prototype.
        </p>
      </div>
      <a className="text-link" href="https://hackinhills.com/" target="_blank" rel="noopener noreferrer">
        Official Hackathon Portal <ArrowUpRight size={15} />
      </a>
    </aside>
  );
}

export function BusinessEnquiry({ initialService }: { initialService?: typeof enquiryServices[number] }) {
  return (
    <section id="project-enquiry" className="project-enquiry conversion-enquiry wrap" aria-labelledby="enquiry-title">
      <div className="enquiry-intro">
        <span className="eyebrow">START A CONVERSATION</span>
        <h2 id="enquiry-title">
          Have a problem<br />
          <span>worth solving?</span>
        </h2>
        <p>
          Tell us what you're building. Let's find the right technology and a practical way to bring it to life.
        </p>
        <div className="enquiry-guarantees">
          <div className="guarantee-item">
            <CheckCircle2 size={16} aria-hidden="true" />
            <div>
              <strong>Free technical assessment</strong>
              <span>We review your requirements and clarify architecture before quoting.</span>
            </div>
          </div>
          <div className="guarantee-item">
            <ShieldCheck size={16} aria-hidden="true" />
            <div>
              <strong>Fixed scope &amp; price</strong>
              <span>No surprise bills. Milestones and deliverable dates agreed upfront.</span>
            </div>
          </div>
          <div className="guarantee-item">
            <Zap size={16} aria-hidden="true" />
            <div>
              <strong>6-month warranty included</strong>
              <span>Complimentary bug fixing, patching, and operational support.</span>
            </div>
          </div>
        </div>
        <div className="enquiry-alt-links">
          <Link className="text-link" href="/appointments" data-conversion="service_cta" data-context="appointment">
            Prefer a direct call? Schedule a strategy conversation <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <ProjectEnquiry initialService={initialService} />
    </section>
  );
}

export function SegmentLinks() {
  return (
    <section className="segment-links" aria-labelledby="segment-title">
      <div>
        <span className="eyebrow">TAILORED INDUSTRY WORKFLOWS</span>
        <h2 id="segment-title">Specialized solutions for your business.</h2>
      </div>
      <div className="segment-links-grid">
        {Object.entries(serviceSegments).slice(0, 4).map(([slug, item]) => (
          <Link href={"/services/" + slug} key={slug} data-conversion="service_cta" data-context={slug} className="segment-card">
            <span className="micro-label">{item.eyebrow}</span>
            <h3>{item.title.replace(" — KITTY CORP", "")}</h3>
            <p>{item.description}</p>
            <span className="text-link">
              View capabilities &amp; workflow <ArrowUpRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function LabsSummary() {
  return (
    <section className="labs-summary wrap" aria-labelledby="labs-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">KITTY LABS / PROPRIETARY SOFTWARE</span>
          <h2 id="labs-title">Independent products engineered alongside client services.</h2>
        </div>
        <p>
          We test cutting-edge mobile architecture, local encryption, and spatial AI in our own laboratory products before applying them to client systems.
        </p>
      </div>
      <div className="labs-summary-grid">
        {[
          ["KITTY AI", "Personal Android AI system with on-device memory, voice interaction and local privacy.", "/kitty-ai", "Published Android App"],
          ["SecretChat", "Account-based messaging with client-side cryptographic storage and offline history.", "/secretchat", "Published Android App"],
          ["LISA AI", "Desktop companion with spatial awareness, expressive 2D character, and local speech engine.", "/lisa-ai", "Assisted Windows Build"],
        ].map(([name, copy, href, status]) => (
          <Link href={href} key={href} data-conversion="portfolio_view" data-context="labs" className="labs-card">
            <span className="micro-label">{status}</span>
            <h3>{name}</h3>
            <p>{copy}</p>
            <span className="text-link">Explore product <ArrowUpRight size={15} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SuvidSummary() {
  return (
    <section className="suvid-summary wrap" aria-labelledby="suvid-title">
      <div>
        <span className="eyebrow">APPLIED RESEARCH / LONG-TERM INITIATIVE</span>
        <h2 id="suvid-title">Suvid AI.<br />A physical assistant, thoughtfully explored.</h2>
        <p>
          Our long-term R&amp;D direction is a physical companion for everyday assistance. We are defining core use cases, safety constraints, and empirical prototypes in computer vision and robotics.
        </p>
      </div>
      <div className="suvid-actions">
        <Link className="button button-outline" href="/research/suvid-ai">
          Read research direction <ArrowUpRight size={16} />
        </Link>
        <Link className="text-link" href="/investors" data-conversion="investor_cta" data-context="research">
          Research briefings &amp; partnership conversations <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
