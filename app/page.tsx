import { Hero, SiteHeader, SiteFooter } from "@/components/kitty/site";
import { LaunchAnnouncement } from "@/components/kitty/launch-announcement";
import { SecretChatSection } from "@/components/kitty/secretchat";
import { publishedLaunches } from "@/lib/launches-server";
import { LaunchGrid } from "@/components/kitty/launches";
import { launchHref, type Launch } from "@/lib/launches";
import {
  StorySection,
  VisionSection,
  FlagshipSection,
  UpdatesSection,
  SupportSection,
  ContactBanner,
} from "@/components/kitty/home-sections";
export const dynamic = "force-dynamic";
export default async function Home() {
  let launches: Launch[] = [];
  try { launches = await publishedLaunches(); } catch { console.error("Kitty launch list unavailable"); }
  const featured = launches[0];
  const announcement = launches.find((launch) => launch.show_popup);
  const secretchat = launches.find((launch) => launch.slug === "secretchat");
  return (
    <>
      <SiteHeader />
      {featured && <a id="secretchat-launch-link" className="launch-banner" href={launchHref(featured)}><span className="launch-banner-tag">NEW LAUNCH</span> Meet {featured.name}. {featured.tagline} <span className="launch-banner-cta">Get the app ↗</span></a>}
      {announcement && <LaunchAnnouncement launch={announcement} />}
      <main id="main">
        <Hero featured={featured} />
        <div id="launches">
          {secretchat && <SecretChatSection launch={secretchat} />}
          <LaunchGrid launches={launches.filter((launch) => launch.slug !== "secretchat")} />
        </div>
        <StorySection />
        <VisionSection />
        <FlagshipSection />
        <UpdatesSection />
        <SupportSection />
        <ContactBanner />
      </main>
      <SiteFooter />
    </>
  );
}
