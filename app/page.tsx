import Link from "next/link";
import { Hero, SiteHeader, SiteFooter } from "@/components/kitty/site";
import { LaunchAnnouncement } from "@/components/kitty/launch-announcement";
import { CompanyIntro, Products, WhyKitty, Team } from "@/components/kitty/home-sections";
import { Currently, JournalPreview } from "@/components/kitty/journal";
import { EarlyAccess } from "@/components/kitty/early-access";
import { publishedLaunches } from "@/lib/launches-server";
import { publicJournal } from "@/lib/journal-server";
import { launchHref } from "@/lib/launches";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [launches, journal] = await Promise.all([publishedLaunches().catch(()=>[]), publicJournal().catch(()=>[])]);
  const announcement = launches.find(l=>l.show_popup);
  return <><SiteHeader />{announcement && <LaunchAnnouncement launch={announcement} />}<main id="main"><Hero />{launches[0] && <div className="launch-notice wrap"><Link id="secretchat-launch-link" href={launchHref(launches[0])}><span className="quiet-status">NEW LAUNCH</span><span>{launches[0].name} is available on Android.</span><span className="launch-notice-link">Meet the app</span></Link></div>}<CompanyIntro /><Products launches={launches} /><Currently entries={journal} /><WhyKitty /><Team /><JournalPreview entries={journal} /><EarlyAccess /></main><SiteFooter /></>;
}
