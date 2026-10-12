import { pageMetadata } from "@/lib/site-metadata";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { JournalCards } from "@/components/kitty/journal";
import { LabProducts } from "@/components/kitty/home-sections";
import { companyProducts } from "@/lib/company-server";
import { publishedLaunches } from "@/lib/launches-server";
import { publicJournal } from "@/lib/journal-server";
export const dynamic="force-dynamic";
export const metadata=pageMetadata('Research','The questions KITTY CORP is exploring across AI, autonomy, robotics, computer vision and cybersecurity.','/research');
const areas=[
  ["Personal AI","How can memory and voice make AI more useful without reducing the user’s control? We’re exploring context, interaction and privacy together."],
  ["Autonomous systems","Software that can take on bounded tasks, with clear limits and a way for a person to step in. We’re interested in reliability before breadth."],
  ["Robotics","Our Sentinel prototype is a starting point for learning how intelligent systems behave outside the screen."],
  ["Computer vision","How systems perceive their surroundings, notice obstacles and make sense of visual information. These are experiments, not finished capabilities."],
  ["Cybersecurity","On-device encryption, private communication and practical user control. SecretChat is one way we’re putting those interests into a product."],
  ["Intelligent software","Interfaces that feel responsive and personal. LISA AI is an early exploration of presence and expressive interaction."],
];
export default async function Research(){const [journal,products,launches]=await Promise.all([publicJournal().catch(()=>[]),companyProducts(),publishedLaunches().catch(()=>[])]);const entries=journal.filter(e=>e.kind==="article"&&e.category==="Research");return <><SiteHeader/><main id="main" className="public-page wrap"><div className="page-heading"><span className="eyebrow">INSIDE THE LAB</span><h1>What we’re exploring.</h1><p>Our prototypes, development work and the questions behind them. We’re a small team; these are directions we’re investigating, not a list of breakthroughs.</p></div><LabProducts launches={launches} products={products}/><div className="research-rows">{areas.map(([title,copy],i)=><article className="research-row" key={title}><span>0{i+1}</span><h2>{title}</h2><p>{copy}</p></article>)}</div><p className="public-note">We’ll publish experiments, observations and technical notes as they become useful. We don’t have formal research papers or independent product audits to share yet.</p>{entries.length>0&&<section className="product-development"><h2>Research notes</h2><JournalCards entries={entries}/></section>}</main><SiteFooter/></>;}
