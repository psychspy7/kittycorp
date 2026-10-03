import { ArrowUpRight, Rocket } from "lucide-react";
import { fileSize, launchHref, type Launch } from "@/lib/launches";
import { SecretChatDownload } from "./secretchat";
export function LaunchGrid({ launches }: { launches: Launch[] }) {
  if (!launches.length) return null;
  return <section className="section launch-catalog" aria-labelledby="launch-catalog-title"><div className="section-kicker"><span>FROM THE STUDIO / AVAILABLE NOW</span><span className="kicker-line" /></div><h2 id="launch-catalog-title">Ideas you can <em>take with you.</em></h2><div className="launch-card-grid">{launches.map((launch) => <article className="launch-card" key={launch.id}><Rocket size={30} aria-hidden="true" /><span className="micro-label">ANDROID APP</span><h3>{launch.name}</h3><p className="launch-tagline">{launch.tagline}</p><p>{launch.description}</p><SecretChatDownload launch={launch} /><span className="download-meta">v{launch.version} · {fileSize(launch.apk_bytes)} · {launch.android}</span><a className="text-link" href={launchHref(launch)}>Explore the app <ArrowUpRight size={16} /></a></article>)}</div></section>;
}
