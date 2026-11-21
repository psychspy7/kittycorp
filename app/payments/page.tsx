import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { PaymentsClient } from "@/components/kitty/payments-client";
import "./payments.css";

export const revalidate = 3600;
export const metadata = { title: "Plans & payments", robots: { index: false, follow: false } };

export default function PaymentsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="public-page wrap payments-page">
        <PaymentsClient options={[]} securityEnabled={false} />
      </main>
      <SiteFooter />
    </>
  );
}
