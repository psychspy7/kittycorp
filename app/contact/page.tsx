import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import Image from "next/image";
import { ContactForm } from "@/components/kitty/contact-form";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { FOUNDER_LINKEDIN, SOCIAL_EMAIL, SUPPORT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";
import { companySettings } from "@/lib/company-server";
import { sitePageContent } from "@/lib/site-pages-server";
import "./contact.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("KITTY CORP | Contact", "Contact KITTY CORP about robotics research, AgriYaan, UrjaYaan partnerships, Digital Solutions Studio projects, collaborations or general enquiries.", "/contact");
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const [{ subject }, settings, copy] = await Promise.all([searchParams, companySettings(), sitePageContent("contact")]);
  const companyLinkedIn = settings.socials.linkedin && !isFounderLinkedIn(settings.socials.linkedin)
    ? settings.socials.linkedin
    : null;

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="contact-page">
        <div className="contact-grid">
          <div className="contact-copy">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-6 max-w-[94vw]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
              <span className="truncate">Direct Inquiries</span>
            </div>

            <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
              {copy.titleLineOne}
              <br />
              {copy.titleLineTwo}
              <br />
              <em>{copy.titleAccent}</em>
            </h1>

            <p>{copy.description}</p>
            <p className="text-[#73777C] text-sm font-light">{copy.responseNote}</p>

            <div className="contact-direct-links">
              <a href={`mailto:${SUPPORT_EMAIL}`}>
                <Mail size={18} className="text-[#2457D6]" aria-hidden="true" />
                <span>
                  <small>SUPPORT &amp; INITIATIVES</small>
                  {SUPPORT_EMAIL}
                </span>
                <ArrowUpRight size={16} className="text-[#73777C]" aria-hidden="true" />
              </a>

              <a href={`mailto:${SOCIAL_EMAIL}`}>
                <Mail size={18} className="text-[#2457D6]" aria-hidden="true" />
                <span>
                  <small>INSTITUTIONAL &amp; PRESS</small>
                  {SOCIAL_EMAIL}
                </span>
                <ArrowUpRight size={16} className="text-[#73777C]" aria-hidden="true" />
              </a>

              <a href={companyLinkedIn || FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer">
                <Image unoptimized src="/ecosystem/linkedin-v1.svg" width={18} height={18} alt="" />
                <span>
                  <small>FOUNDER &amp; LEADERSHIP</small>
                  {companyLinkedIn ? "KITTY CORP on LinkedIn" : "Virat Anand · Founder"}
                </span>
                <ArrowUpRight size={16} className="text-[#73777C]" aria-hidden="true" />
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://demo.thekittycorp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link inline-flex items-center gap-1.5 text-sm font-medium text-[#2457D6] hover:underline"
              >
                Need custom web software or automation? Visit Digital Solutions Studio <ArrowUpRight size={15} />
              </a>
              <Link
                href="/projects"
                className="text-link inline-flex items-center gap-1.5 text-sm text-[#62676D] hover:text-[#191B1D]"
              >
                Explore our robotics &amp; energy initiatives <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="contact-form-container">
            <ContactForm
              subject={
                ["Kitty AI", "KITTY AI", "Partnership", "Privacy", "Review", "Feedback", "Reward code", "Terms", "Investors"].includes(
                  subject || ""
                )
                  ? subject
                  : ""
              }
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
