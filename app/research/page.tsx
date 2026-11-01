import { pageMetadata } from "@/lib/site-metadata";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { JournalCards } from "@/components/kitty/journal";
import { publicJournal } from "@/lib/journal-server";
export const dynamic="force-dynamic";
export const metadata=pageMetadata('Research & development','Notes from KITTY CORP’s early work in software, intelligent systems and robotics.','/research');
const questions=[
  ["Useful autonomy","We’re interested in software that can handle a bounded task, explain what it is doing and leave room for a person to step in."],
  ["Robotics in real settings","Our robotics concepts focus on practical settings such as homes, farms and energy systems. Each one needs its own problem definition, prototype and field validation."],
  ["Reliable AI workflows","We explore ways to connect AI and business tools while keeping important decisions reviewable by the people using them."],
  ["Privacy and user control","Products should make it clear what information they use, what they retain and how a person can change or remove it."],
];
export default async function Research(){const journal=await publicJournal().catch(()=>[]);const entries=journal.filter(e=>e.kind==="article"&&e.category==="Research");return <><SiteHeader/><main id="main" className="public-page wrap"><div className="page-heading"><span className="eyebrow">INSIDE THE LAB</span><h1>Work in progress, in context.</h1><p>We’re a small team exploring how software and intelligent systems can be useful beyond a demo. These are the questions guiding our early work.</p></div><div className="research-rows">{questions.map(([title,copy],i)=><article className="research-row" key={title}><span>0{i+1}</span><h2>{title}</h2><p>{copy}</p></article>)}</div><p className="public-note">We’ll share build notes when there is something concrete to show. Ideas and prototypes are labelled for what they are; we do not present early research as a finished product.</p>{entries.length>0&&<section className="product-development"><h2>Research notes</h2><JournalCards entries={entries}/></section>}</main><SiteFooter/></>;}
