"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Layers,
  Sparkles,
  Stethoscope,
  GraduationCap,
  Building2,
  UtensilsCrossed,
  Scale,
  Sparkle,
  Dumbbell,
  Wrench,
  ShoppingBag,
  Cpu,
  Truck,
  Camera,
  Calculator,
  Paintbrush,
  CalendarCheck,
  Hammer,
  HardHat,
  HeartPulse,
} from "lucide-react";

export const DEMO_URL = "https://demo.thekittycorp.com";

const demoCategories = [
  { id: "medico", name: "Medical & Healthcare", icon: Stethoscope, examples: "Hospitals, Clinics, Diagnostic Labs, Dental" },
  { id: "institute", name: "Education & Coaching", icon: GraduationCap, examples: "JEE/NEET Institutes, Schools, Skill Centres" },
  { id: "real-estate", name: "Real Estate & Architecture", icon: Building2, examples: "Developers, Commercial, Housing Projects" },
  { id: "restaurant", name: "Dining & Hospitality", icon: UtensilsCrossed, examples: "Fine Dining, Cafes, Cloud Kitchens, Bars" },
  { id: "legal", name: "Legal & Professional", icon: Scale, examples: "Advocates, Corporate Law, Notaries, Advisors" },
  { id: "salon", name: "Salons, Spa & Wellness", icon: Sparkle, examples: "Hair Studios, Skin Clinics, Day Spas" },
  { id: "fitness", name: "Fitness & Gyms", icon: Dumbbell, examples: "Gyms, Crossfit Boxes, Yoga, Personal Trainers" },
  { id: "automobile", name: "Automobile & Garages", icon: Wrench, examples: "Workshops, Detailing Studios, Car Service" },
  { id: "retail", name: "Retail & Boutiques", icon: ShoppingBag, examples: "Apparel, Jewellery, Lifestyle, Gift Stores" },
  { id: "technology", name: "Technology & SaaS", icon: Cpu, examples: "Software Startups, B2B SaaS, IT Solutions" },
  { id: "logistics", name: "Logistics & Supply Chain", icon: Truck, examples: "Fleet Services, Freight Forwarding, Warehousing" },
  { id: "photography", name: "Photography & Studios", icon: Camera, examples: "Commercial Photography, Portrait Studios" },
  { id: "finance", name: "Accounting & Tax", icon: Calculator, examples: "Chartered Accountants, Tax Advisory, Auditing" },
  { id: "interior", name: "Interior & Decor", icon: Paintbrush, examples: "Interior Designers, Modular Kitchens, Turnkey" },
  { id: "events", name: "Events & Weddings", icon: CalendarCheck, examples: "Event Planners, Wedding Planners, Banquets" },
  { id: "artisan", name: "Artisans & Crafts", icon: Hammer, examples: "Handcrafted Goods, Pottery, Woodcraft, Custom" },
  { id: "construction", name: "Construction & Contractors", icon: HardHat, examples: "Civil Engineering, Renovation, Contracting" },
  { id: "pets", name: "Veterinary & Pets", icon: HeartPulse, examples: "Pet Clinics, Pet Boarding, Veterinary Hospitals" },
] as const;

const featuredShowcases = [
  {
    industry: "Medical & Healthcare",
    concept: "CarePoint Super-Specialty Clinic",
    tagline: "Doctor schedules, multi-specialty OPD booking & patient portal",
    features: ["Instant appointment slot request", "Doctor profile & department directory", "Lab test inquiry & clinic timings"],
    previewUrl: `${DEMO_URL}/medico`,
    badgeColor: "#17665b",
  },
  {
    industry: "Education & Coaching",
    concept: "Apex Science Academy",
    tagline: "Course catalogs, batch admission inquiries & syllabus downloads",
    features: ["Entrance exam batch schedules", "Direct admission inquiry routing", "Faculty profiles & student testimonials"],
    previewUrl: `${DEMO_URL}/institute`,
    badgeColor: "#3f4c9b",
  },
  {
    industry: "Fine Dining & Hospitality",
    concept: "The Copper Hearth Bistro",
    tagline: "Interactive menu showcases, table reservations & private dining",
    features: ["Live menu with dietary filters", "Table reservation booking pipeline", "Private dining & event booking inquiries"],
    previewUrl: `${DEMO_URL}/restaurant`,
    badgeColor: "#8c4424",
  },
  {
    industry: "Real Estate & Architecture",
    concept: "Vanguard Living Properties",
    tagline: "Property floor plans, virtual enquiry tour & schedule visits",
    features: ["Interactive unit configurations", "Automated site visit scheduling", "Direct WhatsApp & sales concierge routing"],
    previewUrl: `${DEMO_URL}/real-estate`,
    badgeColor: "#2b567a",
  },
];

export function LiveDemoShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const activeShowcase = featuredShowcases[activeTab];

  return (
    <section
      id="live-demos"
      data-element="lightning"
      className="live-demo-section page-gutter"
      aria-labelledby="live-demos-title"
    >
      <div className="live-demo-header">
        <div className="live-demo-heading-block">
          <span className="company-kicker">01.1 · INTERACTIVE DEMO PLATFORM</span>
          <h2 id="live-demos-title">
            See Your Business Online<br />
            <em>Before We Build It.</em>
          </h2>
        </div>
        <p className="live-demo-lead">
          Before we write a single line of your custom code, explore fully interactive website concepts designed around real business workflows — including appointment booking, dynamic service catalogues, instant quotes, and customer enquiry systems across 18 major industries.
        </p>
      </div>

      <div className="live-demo-stage">
        {/* Browser Mockup Window */}
        <div className="demo-browser-frame">
          <div className="demo-browser-chrome">
            <div className="demo-browser-dots" aria-hidden="true">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="demo-browser-address">
              <span className="address-lock" aria-hidden="true">🔒</span>
              <span className="address-url">demo.thekittycorp.com/{featuredShowcases[activeTab].industry.toLowerCase().split(" ")[0]}</span>
            </div>
            <div className="demo-browser-status">
              <span className="demo-live-indicator" />
              <span>LIVE RUNTIME</span>
            </div>
          </div>

          <div className="demo-browser-viewport">
            <div className="demo-showcase-tabs" role="tablist" aria-label="Featured website demonstrations">
              {featuredShowcases.map((showcase, index) => (
                <button
                  key={showcase.industry}
                  role="tab"
                  aria-selected={activeTab === index}
                  aria-controls={`showcase-panel-${index}`}
                  id={`showcase-tab-${index}`}
                  className={`demo-tab-button ${activeTab === index ? "is-active" : ""}`}
                  onClick={() => setActiveTab(index)}
                >
                  <span className="tab-indicator" style={{ backgroundColor: showcase.badgeColor }} />
                  {showcase.industry}
                </button>
              ))}
            </div>

            <div
              id={`showcase-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`showcase-tab-${activeTab}`}
              className="demo-showcase-panel"
            >
              <div className="showcase-content">
                <div className="showcase-badge-row">
                  <span className="showcase-industry-badge" style={{ borderColor: activeShowcase.badgeColor }}>
                    {activeShowcase.industry}
                  </span>
                  <span className="showcase-concept-label">Fully Functional Concept</span>
                </div>
                <h3 className="showcase-title">{activeShowcase.concept}</h3>
                <p className="showcase-tagline">{activeShowcase.tagline}</p>

                <div className="showcase-features-list">
                  <span className="features-kicker">Interactive Capabilities Included:</span>
                  <ul>
                    {activeShowcase.features.map((feat) => (
                      <li key={feat}>
                        <Sparkles size={14} className="feature-icon" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="showcase-actions">
                  <a
                    className="company-button company-button-light"
                    href={activeShowcase.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-conversion="portfolio_view"
                    data-context="home"
                  >
                    Open Live Concept <ExternalLink size={16} aria-hidden="true" />
                  </a>
                  <a
                    className="company-text-link"
                    href={DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-conversion="portfolio_view"
                    data-context="home"
                  >
                    Browse all 18 categories <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="showcase-preview-card">
                <div className="preview-card-inner">
                  <div className="preview-card-top">
                    <span className="preview-pulse-dot" />
                    <span className="preview-brand-tag">KITTY CORP DEMO STUDIO</span>
                  </div>
                  <div className="preview-card-mock-hero">
                    <span className="mock-eyebrow">READY TO DEPLOY</span>
                    <h4 className="mock-h4">{activeShowcase.concept}</h4>
                    <p className="mock-p">{activeShowcase.tagline}</p>
                    <div className="mock-btn-row">
                      <span className="mock-btn mock-btn-primary">Book Consultation</span>
                      <span className="mock-btn mock-btn-ghost">View Services</span>
                    </div>
                  </div>
                  <div className="preview-card-foot">
                    <span>99.9% Uptime</span>
                    <span>Mobile Ready</span>
                    <span>Lead Routing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 18 Industries Grid */}
        <div className="demo-categories-container">
          <div className="categories-header-row">
            <div>
              <span className="company-kicker">18 INDUSTRY CATEGORIES</span>
              <h3 className="categories-h3">Every kind of business, catered for.</h3>
            </div>
            <a
              className="company-button company-button-light"
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-conversion="portfolio_view"
              data-context="home"
            >
              Explore All 18 Demos <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="demo-categories-grid" role="list">
            {demoCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.id}
                  href={`${DEMO_URL}/#industries`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-category-card"
                  role="listitem"
                  data-conversion="portfolio_view"
                  data-context="home"
                >
                  <div className="category-card-top">
                    <span className="category-icon-frame">
                      <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <ArrowUpRight size={14} className="category-arrow" aria-hidden="true" />
                  </div>
                  <strong className="category-name">{cat.name}</strong>
                  <span className="category-examples">{cat.examples}</span>
                </a>
              );
            })}
          </div>

          <div className="demo-footer-banner">
            <div className="banner-copy">
              <span className="banner-kicker">BESPOKE IMPLEMENTATION</span>
              <p>
                Have a unique business model or multi-step booking process? We adapt every demo layout, colour scheme, and integration to your exact workflow.
              </p>
            </div>
            <div className="banner-actions">
              <Link className="company-button company-button-light" href="/projects" data-conversion="service_cta" data-context="home">
                Discuss Your Website <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <a
                className="company-text-link"
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-conversion="portfolio_view"
                data-context="home"
              >
                Launch Demo Studio <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
