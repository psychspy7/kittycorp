import { pageMetadata } from "@/lib/site-metadata";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { JournalCards } from "@/components/kitty/journal";
import { publicJournal } from "@/lib/journal-server";
export const dynamic="force-dynamic";
export const metadata=pageMetadata("AI & robotics research in India","Explore KITTY CORP’s early research in AI systems, companion robotics, agricultural autonomous rovers and intelligent solar energy management. Concepts are clearly labelled by development stage.","/research");
const questions=[
  ["AI companion robotics","KITTY BUDDY is an early concept for a personal AI companion with a physical presence. Hardware, interaction design, power, safety and prototype validation remain in development."],
  ["Agricultural robotics and autonomous rovers","AGRIYAAN explores how an autonomous rover could support practical farm workflows. Field requirements, sensing, mobility, safety and field testing still need validation."],
  ["Intelligent solar and energy management","URJAYAAN explores software and controls for solar generation and energy use. Hardware integration, energy measurements and real-world pilots are not yet established."],
  ["Reliable AI and workflow automation","We also explore bounded AI workflows that connect business tools, explain their actions and keep important decisions reviewable by the people using them."],
];
export default async function Research(){const journal=await publicJournal().catch(()=>[]);const entries=journal.filter(e=>e.kind==="article"&&e.category==="Research");return <><SiteHeader/><main id="main" className="public-page wrap"><div className="page-heading"><span className="eyebrow">INSIDE THE LAB</span><h1>AI and robotics, explored honestly.</h1><p>KITTY CORP is an independent Indian technology team exploring intelligent software and robotics for everyday life, agriculture and energy. These are research directions, not claims of finished or field-proven products.</p></div><div className="research-rows">{questions.map(([title,copy],i)=><article className="research-row" key={title}><span>0{i+1}</span><h2>{title}</h2><p>{copy}</p></article>)}</div><p className="public-note">We’ll share build notes when there is something concrete to show. Ideas, prototypes and field-validation status are labelled accurately; early research is not presented as a finished product.</p>{entries.length>0&&<section className="product-development"><h2>Research notes</h2><JournalCards entries={entries}/></section>}</main><SiteFooter/></>;}
