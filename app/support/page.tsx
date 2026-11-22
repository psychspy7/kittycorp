import type { Metadata } from "next";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { PaymentCheckout } from "@/components/kitty/payment-checkout";
import { publicPaymentProviders } from "@/lib/commerce-server";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import { pageMetadata } from "@/lib/site-metadata";
import "../payments/payments.css";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata(
  "Fuel Us ☕ | KITTY CORP",
  "Buy KITTY CORP a coffee through a secure purchase. Choose ₹49–₹9,999, add your name and email, and receive an on-screen confirmation.",
  "/support"
);

export default async function SupportPage() {
  const [providers, security] = await Promise.all([
    publicPaymentProviders(),
    turnstilePublicConfig(),
  ]);
  const options = providers.filter(provider => provider.provider === "razorpay");

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="payments-page wrap">
        <div className="payments-intro">
          <span className="eyebrow">A SMALL PURCHASE · A LITTLE FUEL</span>
          <h1>Fuel Us ☕</h1>
          <p>Buy KITTY CORP a coffee. Choose an amount from ₹49 to ₹9,999, add your name and email, and complete secure checkout.</p>
          <p className="payments-note">This is a separate purchase. KITTY ONE membership and client project payments are handled separately.</p>
        </div>
        {options.length ? (
          <PaymentCheckout options={options} purpose="donation" securityEnabled={security.enabled && Boolean(security.siteKey)} initialDonationAmount={49} />
        ) : (
          <section className="checkout-card">
            <span className="checkout-mode">CHECKOUT UNAVAILABLE</span>
            <h2>Fuel Us checkout is temporarily unavailable.</h2>
            <p>No payment has been taken. Please contact KITTY CORP if you need help.</p>
            <a className="button button-gold checkout-button" href="/contact">Contact KITTY CORP</a>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
