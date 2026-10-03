import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { JournalCards, Currently } from "@/components/kitty/journal";
import { publicJournal } from "@/lib/journal-server";
import { journalCategories } from "@/lib/journal";
export const dynamic="force-dynamic";
export const metadata={title:"Build Log",description:"Notes on AI, robotics, engineering and building KITTY CORP. Decisions, experiments and work in progress."};
export default async function BuildLog({searchParams}:{searchParams:Promise<{category?:string}>}){
  const {category}=await searchParams;
  const selected=journalCategories.find(c=>c===category);
  const result=await publicJournal().then(entries=>({entries,unavailable:false})).catch(()=>({entries:[],unavailable:true}));
  const {entries,unavailable}=result;
  const articles=entries.filter(e=>e.kind==="article"&&(!selected||e.category===selected));
  return <><SiteHeader/><main id="main" className="public-page journal-list-page"><div className="wrap"><div className="page-heading"><span className="eyebrow">THE KITTY ENGINEERING JOURNAL</span><h1>Work, in the open.</h1><p>Notes from building personal AI, autonomous systems and a company. The decisions, the experiments, and the things we’re still figuring out.</p></div><nav className="journal-filters" aria-label="Build log categories"><Link href="/build-log" aria-current={!selected?"page":undefined}>All entries</Link>{journalCategories.map(c=><Link key={c} href={`/build-log?category=${c}`} aria-current={selected===c?"page":undefined}>{c}</Link>)}</nav>{articles.length?<JournalCards entries={articles}/>:<p className="quiet-empty">{unavailable?"The journal is temporarily unavailable. Please try again shortly.":selected?`No published ${selected.toLowerCase()} entries yet. We’ll share notes as the work develops.`:"Our first journal entries will appear here."}</p>}</div>{!selected&&<Currently entries={entries}/>}</main><SiteFooter/></>;
}
