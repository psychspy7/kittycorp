import { ArrowUpRight, Download, Rocket } from "lucide-react";
import Image from "next/image";
import { downloadHref, fileSize, launchHref, type Launch } from "@/lib/launches";
import { mediaHref } from "@/lib/company-content";

export function AppIcon({ launch, size = 72 }: { launch: Pick<Launch, "name" | "slug" | "icon_path">; size?: number }) {
  if (launch.icon_path) {
    return <Image className="launch-icon" unoptimized src={mediaHref(launch.icon_path)} alt={`${launch.name} icon`} width={size} height={size} />;
  }
  return <Rocket width={size} height={size} strokeWidth={1} aria-hidden="true" />;
}

export function SecretChatDownload({ launch, className = "" }: { launch: Launch; className?: string }) {
  return (
    <a className={`button button-gold ${className}`} href={downloadHref(launch)} download>
      Download Android APK <Download size={18} aria-hidden="true" />
    </a>
  );
}

export function LaunchGrid({ launches }: { launches: Launch[] }) {
  if (!launches.length) return null;
  return <section className="section launch-catalog" aria-labelledby="launch-catalog-title">
    <div className="section-kicker"><span>FROM THE STUDIO · LIVE NOW</span><span className="kicker-line" /></div>
    <h2 id="launch-catalog-title">Things you can <em>use right now.</em></h2>
    <div className="launch-card-grid">{launches.map((launch) => {
      const website = launch.launch_type === "website";
      return <article className="launch-card" key={launch.id}>
        <div className="launch-card-icon"><AppIcon launch={launch} size={54} /></div>
        <span className="micro-label">{website ? "WEBSITE" : "ANDROID APP"}</span>
        <h3>{launch.name}</h3>
        <p className="launch-tagline">{launch.tagline}</p>
        <p>{launch.description}</p>
        {website
          ? <a className="button button-gold" href={launch.website_url || "#"} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={18} /></a>
          : <SecretChatDownload launch={launch} />}
        <span className="download-meta">{website ? "Live website" : `v${launch.version} · ${fileSize(launch.apk_bytes)} · ${launch.android}`}</span>
        <a className="text-link" href={launchHref(launch)}>Explore the {website ? "website" : "app"} <ArrowUpRight size={16} /></a>
      </article>;
    })}</div>
  </section>;
}
