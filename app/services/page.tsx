import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { ProjectEnquiry } from "@/components/kitty/project-enquiry";
import { Reviews, ShippedWork } from "@/components/kitty/credibility-sections";
import { publishedLaunches } from "@/lib/launches-server";
import { publicTestimonials } from "@/lib/testimonials-server";
import "./payment-links.css";
export const dynamic = "force-dynamic";
export const metadata=pageMetadata('Websites, apps & AI automations','Business websites, web and Android apps, and practical AI automations. Send KITTY CORP a brief and agree a clear scope with the builders.','/services');

export default async function ServicesPage() {
  const [launches, reviews] = await Promise.all([publishedLaunches().catch(() => []), publicTestimonials()]);
  return <><SiteHeader/><main id="main" className="public-page wrap services-page">
    <div className="page-heading"><span className="eyebrow">WORK WITH KITTY CORP</span><h1>A website that explains you.<br/>An app that works for you.</h1><p>For businesses getting online, teams with a manual process to fix, and founders ready to test an idea. We build websites, applications and AI agents, with clear scope and direct communication.</p><div className="service-heading-actions"><a className="button button-gold" href="#project-enquiry">Discuss your project <ArrowUpRight size={17}/></a><a className="text-link" href="#work">See shipped work <ArrowUpRight size={16}/></a></div><p className="service-heading-note">Send a rough brief. We’ll discuss what’s possible, the cost and the next step.</p></div>
    <section className="service-offerings" aria-label="What we can build">
      <article id="websites"><span className="micro-label">01 / BUSINESS WEBSITES</span><h2>Give visitors a reason to get in touch.</h2><p>Make your offer easy to understand, show your work and give people a clear way to enquire.</p><ul><li>Business websites, landing pages and portfolios</li><li>Layouts designed for phones and desktops</li><li>Enquiry forms and essential integrations</li><li>Content and structure built around your offer</li></ul><a className="text-link" href="#project-enquiry">Talk about your website <ArrowUpRight size={14}/></a></article>
      <article id="applications"><span className="micro-label">02 / WEB & ANDROID APPLICATIONS</span><h2>Make the task easier.</h2><p>A focused first version that solves a specific problem and is ready to put in front of real users.</p><ul><li>Dashboards, internal tools and customer apps</li><li>Accounts, databases and admin controls</li><li>A working preview you can test and review</li><li>Release planning and an agreed handover</li></ul><a className="text-link" href="#project-enquiry">Talk about your app <ArrowUpRight size={14}/></a></article>
      <article id="automation"><span className="micro-label">03 / AI AGENTS &amp; AUTOMATION</span><h2>Give repetitive work a better workflow.</h2><p>We design business automations with tools such as n8n, connecting the apps you use with practical AI agents and clear rules.</p><ul><li>Lead capture, sorting and customer follow-ups</li><li>Connected CRM, email, spreadsheets and internal tools</li><li>AI assistants for research, support and everyday operations</li><li>Human approval for sensitive actions, plus useful logs and handover</li></ul><p>We review your workflow first. Hosting, model usage and third-party subscriptions are quoted separately; we don’t promise unattended accuracy.</p><Link className="text-link" href="/projects">Plan an automation project <ArrowUpRight size={14}/></Link></article>
    </section>
    <ShippedWork launches={launches}/>
    <section id="how-we-work" className="service-process"><div><span className="eyebrow">HOW WE WORK</span><h2>Know the plan.<br/>See the progress.</h2><p>You’ll speak to the people building your project. We keep the first version focused and make the work visible as it develops.</p></div><ol><li><h3>Start with your brief.</h3><p>Tell us who it’s for, what it needs to do and what you have already. You don’t need a finished specification.</p></li><li><h3>Agree the scope and quote.</h3><p>We discuss features, deliverables, budget and timing before development starts. Any extra work is discussed before it’s added.</p></li><li><h3>Build, review and release.</h3><p>Review a working preview, share feedback and agree on the release. We’ll define source files, hosting and ongoing support in the project scope.</p></li></ol></section>
    <Reviews reviews={reviews}/>
    <section className="service-faq" aria-labelledby="faq-heading"><div><span className="eyebrow">BEFORE WE START</span><h2 id="faq-heading">A few practical questions.</h2></div><div>
      <details><summary>How much will my project cost?</summary><p>It depends on the scope, features and content. Send a short brief and we’ll discuss a quote before you commit to development.</p></details>
      <details><summary>Can you improve an existing website?</summary><p>Yes. Share the link and tell us what isn’t working. We’ll review it with you and suggest a focused next step.</p></details>
      <details><summary>What do I need to send?</summary><p>Your goal, the people who’ll use it and any examples you like. A rough budget or launch date helps, but both are optional.</p></details>
      <details><summary>What happens after launch?</summary><p>Six months of maintenance are included after delivery, covering the bug fixes, routine updates and support agreed in your project scope. New features and third-party hosting or API costs are quoted separately.</p></details>
    </div></section>
    <section id="project-enquiry" className="project-enquiry"><div><span className="eyebrow">LET’S TALK ABOUT THE WORK</span><h2>What would you<br/>like to build?</h2><p>Tell us a little about your business or idea. We’ll read your brief and reply with questions and a sensible next step.</p><Link href="/contact" className="text-link">Have a different question? Contact us <ArrowUpRight size={14}/></Link></div><ProjectEnquiry/></section>
    <section className="service-payment-links" aria-label="Project payments and support">
      <article><div><span className="eyebrow">ALREADY WORKING TOGETHER?</span><h2>Pay for your project.</h2><p>Once we’ve agreed your scope and payment amount, continue to checkout with your project reference.</p></div><Link className="button button-gold" href="/payments?purpose=project">Project checkout <ArrowUpRight size={16}/></Link></article>
      <article><div><span className="eyebrow">SUPPORT THE INDEPENDENT WORK</span><h2>A little support goes a long way.</h2><p>If you’d like to support our experiments, you can make a voluntary contribution. It’s separate from project payments and doesn’t purchase a product.</p></div><Link className="button button-outline" href="/payments?purpose=donation">Support KITTY CORP <ArrowUpRight size={16}/></Link></article>
    </section>
    <div className="service-feedback-link"><p>Worked with us or tried something we’ve built?</p><Link href="/contact?subject=Review" className="text-link">Share your feedback <ArrowUpRight size={15}/></Link></div>
  </main><SiteFooter/></>;
}
