import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader,SiteFooter } from "@/components/kitty/site";
import { ArticleBody } from "@/components/kitty/journal";
import { publicArticle } from "@/lib/journal-server";
import { entryDate } from "@/lib/journal";
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const entry=await publicArticle((await params).slug);return entry?{title:entry.title,description:entry.summary}:{};}
export default async function Article({params}:{params:Promise<{slug:string}>}){
  const entry=await publicArticle((await params).slug);if(!entry)notFound();
  return <><SiteHeader/><main id="main" className="public-page wrap"><article><header className="article-header"><Link className="text-link" href="/build-log">Back to the build log</Link><h1>{entry.title}</h1><div className="journal-meta"><span>{entry.category}</span><time dateTime={entry.entry_date}>{entryDate(entry.entry_date)}</time><span>{entry.status}</span></div><p>{entry.summary}</p></header><div className="article-main">{entry.cover_url&&<Image unoptimized className="article-cover" src={entry.cover_url} alt={entry.cover_alt} width={1200} height={750} loading="lazy" decoding="async" referrerPolicy="no-referrer"/>}<ArticleBody body={entry.body}/><div className="article-end"><p>A note from KITTY CORP. The work is still in progress.</p><Link href="/#early-access" className="text-link">Follow what comes next</Link></div></div></article></main><SiteFooter/></>;
}
