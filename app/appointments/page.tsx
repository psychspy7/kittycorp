import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { AppointmentForm } from "@/components/kitty/appointment-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata("Request an appointment", "Choose a preferred time to discuss your website, application or AI project with KITTY CORP.", "/appointments");

export default function AppointmentsPage() {
  return <><SiteHeader/><main id="main" className="public-page wrap appointments-page"><div className="page-heading"><span className="eyebrow">A CONVERSATION FIRST</span><h1>Let’s talk through<br/>the idea.</h1><p>Tell us what you’re thinking and when you’re free. We’ll confirm a time by email after checking availability.</p></div><div className="appointment-layout"><aside><h2>What to expect</h2><ol><li>A short first conversation, free of charge.</li><li>Practical questions about your goal, timing and budget.</li><li>A written scope and quote if we’re a good fit.</li></ol><p>No need for a finished brief. If you already have details, <Link href="/projects">send a project request</Link> so we can read them first.</p></aside><AppointmentForm/></div></main><SiteFooter/></>;
}
