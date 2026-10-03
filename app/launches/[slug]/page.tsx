import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Rocket } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/kitty/site";
import { SecretChatDownload } from "@/components/kitty/secretchat";
import { publishedLaunch } from "@/lib/launches-server";
import { fileSize } from "@/lib/launches";
import Link from "next/link";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const launch = await publishedLaunch(slug);
  return launch ? { title: `${launch.name} — ${launch.tagline}`, description: launch.description, alternates: { canonical: `/launches/${slug}` } } : { title: "Launch unavailable", robots: { index: false } };
}
export default async function LaunchPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "secretchat") redirect("/secretchat");
  const launch = await publishedLaunch(slug);
  if (!launch) notFound();
  return <><SiteHeader /><main id="main" className="secretchat-page"><section className="secretchat-product-hero"><Link className="text-link" href="/"><ArrowLeft size={16} /> Back to Kitty Corp</Link><div className="secretchat-product-grid"><div><span className="status-pill"><span /> NEW FROM KITTY CORP · ANDROID</span><h1>{launch.name}.<br /><em>{launch.tagline}</em></h1><p className="secretchat-product-intro">{launch.description}</p><SecretChatDownload launch={launch} /><p className="download-meta">v{launch.version} · {fileSize(launch.apk_bytes)} · {launch.android}</p></div><div className="secretchat-product-art"><Rocket size={130} strokeWidth={1} aria-hidden="true" /><span>BUILT BY<span>KITTY CORP</span></span><div className="secretchat-art-ring" aria-hidden="true" /></div></div></section><section className="section secretchat-install"><div><span className="micro-label">READY WHEN YOU ARE</span><h2>Install on <em>Android.</em></h2><p>{launch.android} required. Download on your Android phone, open the APK in Downloads, and confirm installation. If prompted, allow installation from the browser or file manager you used. Keep Play Protect enabled.</p><p>To update an existing installation, install the new APK over it. Compatible updates must use the original app signing key.</p></div><div className="launch-release-details"><h3>What’s new in v{launch.version}</h3><p className="release-notes">{launch.release_notes || "A new launch from the Kitty Corp studio."}</p><details><summary>Verify download (SHA-256)</summary><code>{launch.apk_sha256}</code></details><SecretChatDownload launch={launch} /></div></section></main><SiteFooter /></>;
}
