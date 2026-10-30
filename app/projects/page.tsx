import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Layers, Terminal, Sparkles, Lock, Bot } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { ProjectEnquiry } from "@/components/kitty/project-enquiry";
import { pageMetadata } from "@/lib/site-metadata";
import { publishedLaunches } from "@/lib/launches-server";
import { isWebsiteLaunch, launchHref } from "@/lib/launches";
import { mediaHref } from "@/lib/company-content";
import { AppIcon } from "@/components/kitty/secretchat";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "Work & Case Studies — KITTY CORP",
  "Explore production software, verified architectures, and client case studies delivered by KITTY CORP. Start your website, mobile app or automation project.",
  "/projects"
);

export default async function ProjectsPage() {
  const launches = await publishedLaunches().catch(() => []);

  const caseStudies = [
    {
      title: "SecretChat — Zero-Knowledge Cryptographic Messaging",
      status: "PRODUCTION RELEASE",
      statusType: "production",
      category: "Native Android & Cryptography",
      problem: "Cloud messaging services store user metadata and chat histories on centralized servers, creating constant data leak vulnerabilities.",
      requirements: "Pure client-side cryptographic storage, zero cleartext transmission to servers, fast offline SQLite retrieval, and intuitive mobile ergonomics.",
      approach: "Engineered a native Android architecture using modern crypto primitives (AES-256-GCM + PBKDF2), biometric hardware key derivation, and local ephemeral sessions.",
      stack: ["Android Kotlin", "SQLite Encrypted", "Biometric API", "AES-256-GCM"],
      delivered: "A standalone, lightweight Android application delivering instantaneous offline messaging with tamper-evident local persistence.",
      href: "/secretchat"
    },
    {
      title: "KITTY AI — Personal Android Intelligence & Voice Engine",
      status: "PRODUCTION RELEASE",
      statusType: "production",
      category: "Applied AI & Mobile Systems",
      problem: "Mobile AI assistants require heavy server round-trips and fail to maintain contextual memory while respecting device battery and privacy.",
      requirements: "Sub-second voice turn-around, deterministic memory management, local cache persistence, and strict quota protection.",
      approach: "Constructed an edge-assisted conversational pipeline with local speech synthesis, contextual memory ranking, and structured API gateways.",
      stack: ["Android SDK", "Voice Streaming", "Local Context Ranking", "Cloudflare Workers"],
      delivered: "A shipped Android application with thousands of verified sessions, voice command capabilities, and zero third-party telemetry leaks.",
      href: "/kitty-ai"
    },
    {
      title: "LISA AI — Spatial Desktop Companion & 2D Character Engine",
      status: "ACTIVE PROTOTYPE",
      statusType: "prototype",
      category: "Interactive Desktop Agent",
      problem: "Desktop user interfaces remain rigid and transactional, lacking empathetic visual feedback and localized task assistance.",
      requirements: "2D spatial canvas rendering, expressive emotional reaction states, localized voice synthesis, and desktop screen awareness.",
      approach: "Designed a layered 2D interactive room with sprite state machine, low-latency character animation, and localized NLP pipelines.",
      stack: ["Windows Runtime", "Canvas Graphics", "Spatial NLP", "Speech Synthesis"],
      delivered: "An interactive desktop environment with visual responsiveness, customizable settings, and privacy-first local storage.",
      href: "/lisa-ai"
    },
    {
      title: "Suvid AI — Physical Assistant & Embodied Robotics",
      status: "APPLIED R&D",
      statusType: "research",
      category: "Computer Vision & Robotics",
      problem: "Household and clinical assistance requires physical dexterity, spatial depth perception, and fail-safe mechanical boundaries.",
      requirements: "Real-time edge computer vision, depth estimation, obstacle avoidance, and deterministic motor actuation.",
      approach: "Researching multimodal sensor fusion models paired with edge microcontrollers, conducting empirical kinematic simulations.",
      stack: ["Edge Robotics", "Multimodal Vision", "Sensor Fusion", "Kinematics"],
      delivered: "Empirical whitepapers, sensor benchmark suites, and prototype hardware specifications presented at Hack in Hills ’26 (Top 500 Shortlist).",
      href: "/research/suvid-ai"
    }
  ];

  return (
    <>
      <SiteHeader />
      <main id="main" className="public-page wrap projects-page conversion-projects">
        <div className="page-heading">
          <span className="eyebrow">ENGINEERING CASE STUDIES &amp; PORTFOLIO</span>
          <h1>
            Real software.<br />
            <span>Verifiable engineering.</span>
          </h1>
          <p>
            We build modern digital experiences, native Android apps, and applied AI systems. Every project below outlines the underlying business problem, architectural decisions, and delivered solutions.
          </p>
          <div className="heading-actions">
            <a className="button button-gold" href="#project-enquiry">
              Start your project <ArrowUpRight size={16} />
            </a>
            <Link className="button button-outline" href="/pricing">
              View fixed packages <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <section className="case-studies-section" aria-label="Featured Case Studies">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DETAILED ARCHITECTURAL REVIEWS</span>
              <h2>Shipped systems &amp; prototypes.</h2>
            </div>
            <p>
              We distinguish production releases, active prototypes, and R&amp;D initiatives with complete transparency.
            </p>
          </div>

          <div className="case-studies-grid">
            {caseStudies.map(cs => (
              <article key={cs.title} className="case-study-card">
                <div className="case-study-header">
                  <div className="status-badge-wrap">
                    <span className={`status-pill status-${cs.statusType}`}>
                      {cs.status}
                    </span>
                    <span className="category-label">{cs.category}</span>
                  </div>
                  <h3>{cs.title}</h3>
                </div>

                <div className="case-study-body">
                  <div className="case-study-block">
                    <strong>The Problem</strong>
                    <p>{cs.problem}</p>
                  </div>
                  <div className="case-study-block">
                    <strong>Engineering Requirements</strong>
                    <p>{cs.requirements}</p>
                  </div>
                  <div className="case-study-block">
                    <strong>Architectural Approach</strong>
                    <p>{cs.approach}</p>
                  </div>
                  <div className="case-study-block">
                    <strong>Delivered Solution</strong>
                    <p>{cs.delivered}</p>
                  </div>
                </div>

                <div className="case-study-footer">
                  <div className="tech-tags">
                    {cs.stack.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <Link className="text-link" href={cs.href}>
                    Explore technical build <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="project-enquiry" className="project-enquiry-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">START YOUR ENGAGEMENT</span>
              <h2>Tell us what you're building.</h2>
            </div>
            <p>
              A conversation first. A clear plan next. Sending an inquiry is free and non-binding. We confirm exact scope, timeline, and fixed costs before committing code.
            </p>
          </div>

          <div className="project-start-grid">
            <aside className="enquiry-sidebar-info">
              <div className="sidebar-card">
                <h3>Our Working Principles</h3>
                <ul className="sidebar-list">
                  <li>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span><strong>Direct Builder Access:</strong> Partner with the engineers designing and writing your software.</span>
                  </li>
                  <li>
                    <ShieldCheck size={16} aria-hidden="true" />
                    <span><strong>100% IP Ownership:</strong> Clean source code repository handover with zero vendor lock-in.</span>
                  </li>
                  <li>
                    <Zap size={16} aria-hidden="true" />
                    <span><strong>6 Months Maintenance:</strong> Complimentary bug fixes, security updates, and performance monitoring.</span>
                  </li>
                  <li>
                    <Lock size={16} aria-hidden="true" />
                    <span><strong>Fixed Quotes:</strong> Transparent pricing milestones agreed in writing before kickoff.</span>
                  </li>
                </ul>
                <div className="sidebar-links">
                  <Link className="text-link" href="/appointments">
                    Schedule a 30-min strategy call <ArrowUpRight size={14} />
                  </Link>
                  <Link className="text-link" href="/pricing">
                    Review approved fixed-price tiers <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </aside>

            <div className="enquiry-form-container">
              <ProjectEnquiry />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
