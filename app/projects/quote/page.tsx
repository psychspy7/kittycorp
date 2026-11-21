import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CustomerProjectQuote } from "@/components/kitty/customer-project-quote";
import "../../payments/payments.css";

export const revalidate = 3600;
export const metadata = { title: "Your project quote", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="public-page wrap customer-quote-page">
        <CustomerProjectQuote keyId="" testMode={false} securityEnabled={true} />
      </main>
      <SiteFooter />
    </>
  );
}
