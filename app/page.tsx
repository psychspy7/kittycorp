import { Hero, SiteHeader, SiteFooter } from "@/components/kitty/site";
import { BrandLoader } from "@/components/kitty/motion";
import {
  StorySection,
  VisionSection,
  FlagshipSection,
  UpdatesSection,
  SupportSection,
  ContactBanner,
} from "@/components/kitty/home-sections";
export default function Home() {
  return (
    <>
      <BrandLoader />
      <SiteHeader />
      <main id="main">
        <Hero />
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
