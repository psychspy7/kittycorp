import type { Metadata } from "next";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/kitty/contact-form";
import { SiteHeader, SiteFooter } from "@/components/kitty/site";
export const metadata: Metadata = {
  title: "Let’s talk",
  description:
    "An idea, some feedback, a question. Talk to the people building Kitty Corp.",
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
              Big ideas.
              <br />
              Small hellos.
              <br />
              <em>All welcome.</em>
            </h1>
            <p>
              Tell us what you’re thinking. A possibility we haven’t seen.
              Something we could do better. Or just a hello.
            </p>
            <p>There’s a real person on the other side.</p>
            <a href="/#kitty-ai" className="text-link">
              See what we’re building <ArrowUpRight size={17} />
            </a>
          </div>
          <ContactForm subject={subject === "Kitty AI" ? "Kitty AI" : ""} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
