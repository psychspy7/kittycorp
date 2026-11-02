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
export async function generateMetadata():Promise<Metadata>{const copy=await sitePageContent("contact");return pageMetadata(copy.seoTitle,copy.seoDescription,"/contact");}
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const [{ subject }, settings, copy] = await Promise.all([searchParams, companySettings(), sitePageContent("contact")]);
  const companyLinkedIn = settings.socials.linkedin && !isFounderLinkedIn(settings.socials.linkedin)
    ? settings.socials.linkedin : null;
  return (
    <>
      <SiteHeader />
      <main id="main" className="contact-page">
        <div className="section-kicker">
          <span>{copy.eyebrow}</span>
          <span className="kicker-line" />
        </div>
        <div className="contact-grid">
          <div className="contact-copy">
            <MessageSquare size={29} strokeWidth={1.1} />
            <h1>
              {copy.titleLineOne}
              <br />
              {copy.titleLineTwo}
              <br />
              <em>{copy.titleAccent}</em>
            </h1>
            <p>{copy.description}</p>
            <p>{copy.responseNote}</p>
            <div className="contact-direct-links">
              <a href={`mailto:${SUPPORT_EMAIL}`}><Mail size={18} aria-hidden="true"/><span><small>SUPPORT &amp; PROJECTS</small>{SUPPORT_EMAIL}</span><ArrowUpRight size={16} aria-hidden="true"/></a>
              <a href={`mailto:${SOCIAL_EMAIL}`}><Mail size={18} aria-hidden="true"/><span><small>SOCIAL &amp; PRESS</small>{SOCIAL_EMAIL}</span><ArrowUpRight size={16} aria-hidden="true"/></a>
              <a href={companyLinkedIn || FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer"><Image unoptimized src="/ecosystem/linkedin-v1.svg" width={18} height={18} alt=""/><span><small>CONNECT ON LINKEDIN</small>{companyLinkedIn ? "KITTY CORP on LinkedIn" : "Virat Anand · Founder"}</span><ArrowUpRight size={16} aria-hidden="true"/></a>
            </div>
            {companyLinkedIn && <a href={FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-link">Virat Anand · Founder on LinkedIn</a>}
            <Link href="/services#project-enquiry" className="text-link">Need a website or app? Share a project brief.</Link>
            <Link href="/products" className="text-link">
              See what we’re building <ArrowUpRight size={17} />
            </Link>
          </div>
          <ContactForm subject={["Kitty AI", "KITTY AI", "Partnership", "Privacy", "Review", "LISA AI purchase", "Reward code", "Terms", "Investors"].includes(subject || "") ? subject : ""} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
