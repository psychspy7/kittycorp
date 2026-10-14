import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { NewsletterAction } from "@/components/kitty/newsletter-action";
export const metadata = {
  title: "Newsletter unsubscribe",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="public-page wrap">
        <NewsletterAction action="unsubscribe" />
      </main>
      <SiteFooter />
    </>
  );
}
