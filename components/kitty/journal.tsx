import Image from "next/image";
import Link from "next/link";
import { entryDate, type JournalSummary } from "@/lib/journal";
export function Currently({ entries }: { entries: JournalSummary[] }) {
  const updates = entries.filter(e => e.kind === "update").slice(0,5);
  return <section id="currently" className="editorial-section wrap"><div className="section-intro"><span className="eyebrow">WORK IN PROGRESS</span><h2>Currently at KITTY</h2><p>A few notes from the workbench.</p></div><div className="engineering-feed">{updates.length ? updates.map(e => <article key={e.id} className="engineering-row"><time dateTime={e.entry_date}>{entryDate(e.entry_date)}</time><div><h3>{e.title}</h3><p>{e.summary}</p></div><span className="quiet-status">{e.status}</span></article>) : <p className="quiet-empty">Our next development notes will appear here. We’ll share work when there’s something useful to show.</p>}</div><Link className="text-link" href="/build-log">Read the build log</Link></section>;
}
export function JournalCards({ entries }: { entries: JournalSummary[] }) {
  return <div className="journal-grid">{entries.map(e => <Link href={`/build-log/${e.slug}`} className="journal-card" key={e.id}>{e.cover_url && <div className="journal-cover"><Image unoptimized src={e.cover_url} alt={e.cover_alt} width={800} height={500} loading="lazy" decoding="async" referrerPolicy="no-referrer" /></div>}<div className="journal-meta"><span>{e.category}</span><time dateTime={e.entry_date}>{entryDate(e.entry_date)}</time></div><h3>{e.title}</h3><p>{e.summary}</p><span className="journal-read">Read entry <span aria-hidden="true">+</span></span></Link>)}</div>;
}
export function JournalPreview({ entries }: { entries: JournalSummary[] }) {
  const articles = entries.filter(e => e.kind === "article").slice(0,3);
  return <section className="editorial-section wrap"><div className="section-heading"><div><span className="eyebrow">NOTES, DECISIONS & WRONG TURNS</span><h2>The build log</h2></div><Link className="text-link" href="/build-log">All entries</Link></div>{articles.length ? <JournalCards entries={articles} /> : <p className="quiet-empty">The journal is just getting started. Our first notes will be published here.</p>}</section>;
}
export function ArticleBody({ body }: { body: string }) {
  return <div className="article-body">{body.split(/\n\s*\n/).map((paragraph,i) => paragraph.startsWith("## ") ? <h2 key={i}>{paragraph.slice(3)}</h2> : <p key={i}>{paragraph}</p>)}</div>;
}
