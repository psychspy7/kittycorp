import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/kitty/contact-form";
import { SiteHeader, SiteFooter } from "@/components/kitty/site";
export const metadata: Metadata = {
  title: "Let’s talk",
  description:
    "An idea, some feedback, a question. Talk to the founders building KITTY CORP.",
};
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main id="main" className="contact-page">
        <div className="section-kicker">
          <span>AN OPEN LINE TO THE STUDIO</span>
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
            <p>Virat and Sarthak read the messages here.</p>
            <Link href="/#products" className="text-link">
              See what we’re building <ArrowUpRight size={17} />
            </Link>
          </div>
          <ContactForm subject={["Kitty AI", "KITTY AI", "Partnership", "Privacy"].includes(subject || "") ? subject : ""} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
