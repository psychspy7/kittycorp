import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import Image from "next/image";
import { ContactForm } from "@/components/kitty/contact-form";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CONTACT_EMAIL, FOUNDER_LINKEDIN, isFounderLinkedIn } from "@/lib/company-contact";
import { companySettings } from "@/lib/company-server";
import "./contact.css";
export const metadata=pageMetadata('Let’s talk','An idea, some feedback, a question. Talk to the founders building KITTY CORP.','/contact');
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  const settings = await companySettings();
  const companyLinkedIn = settings.socials.linkedin && !isFounderLinkedIn(settings.socials.linkedin)
    ? settings.socials.linkedin : null;
  return (
    <>
      <SiteHeader />
      <main id="main" className="contact-page">
        <div className="section-kicker">
          <span>CONTACT THE KITTY TEAM</span>
          <span className="kicker-line" />
        </div>
        <div className="contact-grid">
          <div className="contact-copy">
            <MessageSquare size={29} strokeWidth={1.1} />
            <h1>
              A good place
              <br />
              to start a
              <br />
              <em>conversation.</em>
            </h1>
            <p>
              Tell us what you’re thinking. Feedback on something we’re building.
              A possible collaboration. Or just a hello.
            </p>
            <p>The KITTY team reads the messages here.</p>
            <div className="contact-direct-links">
              <a href={`mailto:${CONTACT_EMAIL}`}><Mail size={18} aria-hidden="true"/><span><small>EMAIL KITTY CORP</small>{CONTACT_EMAIL}</span><ArrowUpRight size={16} aria-hidden="true"/></a>
              <a href={companyLinkedIn || FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer"><Image unoptimized src="/ecosystem/linkedin-v1.svg" width={18} height={18} alt=""/><span><small>CONNECT ON LINKEDIN</small>{companyLinkedIn ? "KITTY CORP on LinkedIn" : "Virat Anand · Founder"}</span><ArrowUpRight size={16} aria-hidden="true"/></a>
            </div>
            {companyLinkedIn && <a href={FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-link">Virat Anand · Founder on LinkedIn</a>}
            <Link href="/services#project-enquiry" className="text-link">Need a website or app? Share a project brief.</Link>
            <Link href="/products" className="text-link">
              See what we’re building <ArrowUpRight size={17} />
            </Link>
          </div>
          <ContactForm subject={["Kitty AI", "KITTY AI", "Partnership", "Privacy", "Review"].includes(subject || "") ? subject : ""} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
