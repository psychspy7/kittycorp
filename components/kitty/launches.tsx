import { ArrowUpRight } from "lucide-react";
import { fileSize, launchHref, type Launch } from "@/lib/launches";
import { AppIcon, SecretChatDownload } from "./secretchat";
export function LaunchGrid({ launches }: { launches: Launch[] }) {
  if (!launches.length) return null;
  return <section className="section launch-catalog" aria-labelledby="launch-catalog-title">
    <div className="section-kicker"><span>FROM THE STUDIO / LIVE NOW</span><span className="kicker-line" /></div>
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
