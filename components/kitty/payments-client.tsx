"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PaymentCheckout } from "./payment-checkout";
import { PaymentsOverview } from "./payments-overview";
import { paymentOptionsForPurpose, type PublicProvider } from "@/lib/commerce";

function PaymentsClientInner({
  options,
  securityEnabled,
}: {
  options: PublicProvider[];
  securityEnabled: boolean;
}) {
  const searchParams = useSearchParams();
  const rawPurpose = searchParams?.get("purpose");
  const rawAmount = searchParams?.get("amount");

  const requestedDonationAmount =
    rawAmount && /^\d{1,7}(?:\.\d{1,2})?$/.test(rawAmount) ? Number(rawAmount) : undefined;
  const purpose = rawPurpose === "donation" ? "donation" : rawPurpose === "project" ? "project" : null;

  if (!purpose) {
    return <PaymentsOverview options={options} securityEnabled={securityEnabled} />;
  }

  const available = purpose === "donation" ? options.filter(option => option.provider === "razorpay") : paymentOptionsForPurpose(options, purpose);

  return (
    <div className="payments-page-content">
      <div className="payments-intro">
        <Link href="/payments" className="text-link">
          <ArrowLeft size={15} aria-hidden="true" />
          All payments
        </Link>
        <span className="eyebrow">
          KITTY CORP ·{" "}
          {purpose === "donation" ? "FUEL US ☕" : "PROJECT PAYMENTS"}
        </span>
        <h1>{purpose === "donation" ? "Buy us a coffee." : "For the work we’re building together."}</h1>
        <p>{purpose === "donation" ? "Choose a coffee purchase amount from ₹49 to ₹9,999, add your name and email, then complete secure checkout." : "Start with a project brief. Your private quote offers full advance, a 50/50 schedule or review-first payment. Already have a quote link? Open it to see your agreed amount."}</p>
        <nav className="payment-purpose-nav" aria-label="Payment type">
          <Link
            href="/payments?purpose=project"
            aria-current={purpose === "project" ? "page" : undefined}
          >
            Project payment
          </Link>
          <Link
            href="/payments?purpose=donation"
            aria-current={purpose === "donation" ? "page" : undefined}
          >
            Fuel Us ☕
          </Link>
        </nav>
        <p className="payments-note">{purpose === "donation" ? "Fuel Us is a separate purchase. KITTY ONE membership and project payments remain separate." : "Check the total against your quote before paying. Contact us if it differs. Payment is recorded separately from project delivery."}</p>
      </div>

      {available.length ? (
        <PaymentCheckout
          options={available}
          purpose={purpose}
          securityEnabled={securityEnabled}
          initialDonationAmount={purpose === "donation" ? requestedDonationAmount : undefined}
        />
      ) : (
        <section className="checkout-card">
          <span className="checkout-mode">
            {purpose === "project" && options.length ? "QUOTE REQUIRED" : "CHECKOUT UNAVAILABLE"}
          </span>
          <h2>
            {purpose === "project" && options.length
              ? "Your quote comes first."
              : "Checkout is temporarily unavailable."}
          </h2>
          <p>
            {purpose === "project" && options.length
              ? "There is no active project amount right now. Tell us what you need and we’ll agree on scope, cost and a payment reference before you pay. Project payments and voluntary support are separate."
              : "Please contact KITTY CORP if you were expecting to make a payment. No payment has been taken."}
          </p>
          <Link
            className="button button-gold"
            href={purpose === "project" ? "/projects" : "/contact"}
          >
            {purpose === "project" ? "Request a quote" : "Contact KITTY CORP"}
          </Link>
          {purpose === "project" && options.length > 0 && (
            <Link className="text-link checkout-secondary" href="/payments?purpose=donation">
              Looking to support KITTY instead?
            </Link>
          )}
        </section>
      )}
    </div>
  );
}

export function PaymentsClient(props: { options: PublicProvider[]; securityEnabled: boolean }) {
  return (
    <Suspense
      fallback={
        <div className="payments-intro">
          <span className="eyebrow">KITTY CORP · PAYMENTS</span>
          <h1>Payments</h1>
          <p>Loading secure payment options…</p>
        </div>
      }
    >
      <PaymentsClientInner {...props} />
    </Suspense>
  );
}
