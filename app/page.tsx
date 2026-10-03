import Link from "next/link";
import { Hero, SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { LaunchAnnouncement } from "@/components/kitty/launch-announcement";
import { CompanyIntro, Products, WhyKitty, Team, Services } from "@/components/kitty/home-sections";
import { Currently, JournalPreview } from "@/components/kitty/journal";
import { EarlyAccess } from "@/components/kitty/early-access";
import { publishedLaunches } from "@/lib/launches-server";
import { publicJournal } from "@/lib/journal-server";
import { companyProducts, companySettings, companyTeam } from "@/lib/company-server";
import { launchHref } from "@/lib/launches";
export const dynamic = "force-dynamic";
export default async function Home(){const [launches,journal,products,members,settings]=await Promise.all([publishedLaunches().catch(()=>[]),publicJournal().catch(()=>[]),companyProducts(),companyTeam(),companySettings()]);const announcement=launches.find(l=>l.show_popup);return <><SiteHeader/>{announcement&&<LaunchAnnouncement launch={announcement}/>}<main id="main"><Hero/>{launches[0]&&<div className="launch-notice wrap"><Link id="secretchat-launch-link" href={launchHref(launches[0])}><span className="quiet-status">NEW LAUNCH</span><span>{launches[0].name} is available on Android.</span><span className="launch-notice-link">Meet the app</span></Link></div>}<CompanyIntro/><Products launches={launches} products={products}/><Currently entries={journal}/><WhyKitty/><Services/><Team members={members} settings={settings}/><JournalPreview entries={journal}/><EarlyAccess/></main><SiteFooter/></>;}
