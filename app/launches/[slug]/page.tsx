import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { SecretChatDownload, AppIcon } from "@/components/kitty/secretchat";
import { publishedLaunch } from "@/lib/launches-server";
import { fileSize } from "@/lib/launches";
import { mediaHref } from "@/lib/company-content";
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

  if (launch.launch_type === "website") {
    return <><SiteHeader /><main id="main" className="secretchat-page website-launch-page">
      <section className="secretchat-product-hero">
        <Link className="text-link" href="/"><ArrowLeft size={16} /> Back to Kitty Corp</Link>
        <div className="secretchat-product-grid">
          <div>
            <span className="status-pill"><span /> NEW FROM KITTY CORP · WEBSITE</span>
            <div className="website-launch-brand"><AppIcon launch={launch} size={58} /><span>LIVE ON THE WEB</span></div>
            <h1>{launch.name}.<br /><em>{launch.tagline}</em></h1>
            <p className="secretchat-product-intro">{launch.description}</p>
            <div className="website-launch-actions">
              <a className="button button-gold" href={launch.website_url || "#"} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={18} /></a>
            </div>
            <p className="download-meta">Live website · Opens in a new tab</p>
          </div>
          <div className="secretchat-product-art website-launch-art">
            {launch.screenshot_path ? <Image className="website-launch-screenshot" unoptimized src={mediaHref(launch.screenshot_path)} alt={`${launch.name} website screenshot`} width={1400} height={900} /> : <AppIcon launch={launch} size={130} />}
          </div>
        </div>
      </section>
      <section className="section secretchat-install">
        <div>
          <span className="micro-label">ABOUT THE LAUNCH</span>
          <h2>Made for the <em>web.</em></h2>
          <p>{launch.description}</p>
          <p>Use the official link below to open the live website. The launch page stays here as part of Kitty Corp’s product directory.</p>
        </div>
        <div className="launch-release-details">
          <h3>{launch.release_notes ? "Website details" : `Open ${launch.name}`}</h3>
          <p className="release-notes">{launch.release_notes || launch.tagline}</p>
          <a className="button button-gold" href={launch.website_url || "#"} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={18} /></a>
        </div>
      </section>
    </main><SiteFooter /></>;
  }

  return <><SiteHeader /><main id="main" className="secretchat-page"><section className="secretchat-product-hero"><Link className="text-link" href="/"><ArrowLeft size={16} /> Back to Kitty Corp</Link><div className="secretchat-product-grid"><div><span className="status-pill"><span /> NEW FROM KITTY CORP · ANDROID</span><h1>{launch.name}.<br /><em>{launch.tagline}</em></h1><p className="secretchat-product-intro">{launch.description}</p><SecretChatDownload launch={launch} /><p className="download-meta">v{launch.version} · {fileSize(launch.apk_bytes)} · {launch.android}</p></div><div className="secretchat-product-art"><AppIcon launch={launch} size={130} /><span>BUILT BY<span>KITTY CORP</span></span><div className="secretchat-art-ring" aria-hidden="true" /></div></div></section><section className="section secretchat-install"><div><span className="micro-label">READY WHEN YOU ARE</span><h2>Install on <em>Android.</em></h2><p>{launch.android} required. Download on your Android phone, open the APK in Downloads, and confirm installation. If prompted, allow installation from the browser or file manager you used. Keep Play Protect enabled.</p><p>To update an existing installation, install the new APK over it. Compatible updates must use the original app signing key.</p></div><div className="launch-release-details"><h3>What’s new in v{launch.version}</h3><p className="release-notes">{launch.release_notes || "A new launch from the Kitty Corp studio."}</p><details><summary>Verify download (SHA-256)</summary><code>{launch.apk_sha256}</code></details><SecretChatDownload launch={launch} /></div></section></main><SiteFooter /></>;
}
