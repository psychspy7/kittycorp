import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { PaymentsClient } from "@/components/kitty/payments-client";
import { publicPaymentProviders } from "@/lib/commerce-server";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import "./payments.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payments | KITTY CORP", robots: { index: false, follow: false } };

export default async function PaymentsPage() {
  const [options, security] = await Promise.all([
    publicPaymentProviders(),
    turnstilePublicConfig(),
  ]);

  return (
    <>
      <SiteHeader />
      <main id="main" className="public-page wrap payments-page">
        <PaymentsClient options={options} securityEnabled={security.enabled && Boolean(security.siteKey)} />
      </main>
      <SiteFooter />
    </>
  );
}
