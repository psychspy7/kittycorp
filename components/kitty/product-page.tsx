import Link from "next/link";
import { SiteHeader, SiteFooter } from "./site";
import { JournalCards } from "./journal";
import { productPages } from "@/lib/products";
import { publicJournal } from "@/lib/journal-server";
export async function ProductPage({slug}:{slug:keyof typeof productPages}){
  const product=productPages[slug];
  const entries=(await publicJournal().catch(()=>[])).filter(e=>e.kind==="article"&&e.category===product.category).slice(0,3);
  return <><SiteHeader/><main id="main" className="public-page wrap"><div className="product-page-intro"><div className="page-heading"><span className="eyebrow">{product.label}</span><h1>{product.name}</h1><span className="quiet-status">{product.status}</span><p>{product.description}</p><p>{product.intro}</p><Link className="button button-gold" href="/#early-access">Join early access</Link></div><div className="real-media-placeholder"><p className="media-slot-label"><span>THE WORKBENCH</span><span>MEDIA TO FOLLOW</span></p><h4>{product.media}</h4><p>A place for real product work.<br/>We’ll share it when it’s ready.</p><div className="media-slot-footer"><span>{product.name}</span><span>In progress</span></div></div></div><div className="product-page-principles">{product.principles.map(([title,body])=><article key={title}><h2>{title}</h2><p>{body}</p></article>)}</div><section id="development" className="product-development"><span className="eyebrow">BUILDING IN PUBLIC</span><h2>Notes on the work</h2>{entries.length?<JournalCards entries={entries}/>:<p className="quiet-empty">The first development notes will appear here. There’s no public release date yet.</p>}<Link href={`/build-log?category=${product.category}`} className="text-link">View {product.category.toLowerCase()} entries</Link></section></main><SiteFooter/></>;
}
