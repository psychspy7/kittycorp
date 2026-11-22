"use client";

import {CustomerSignIn} from "./customer-sign-in";
import {customerAuthorization} from "@/lib/customer-request";
import {LocalPrice} from "./local-currency";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Check, CreditCard, LoaderCircle, ShieldCheck } from "lucide-react";
import { Turnstile } from "./turnstile";
import type { PaymentPurpose } from "@/lib/razorpay-server";

type PaymentResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type Order = { order_id: string; amount: number; currency: string };
type Verification = { success: boolean; verified: boolean; paid: boolean; status: string; payment_id: string };
const paymentDisplay = {
  display: {
    blocks: { upi: { name: "Pay via UPI", instruments: [{ method: "upi" }] } },
    sequence: ["block.upi"],
    // Razorpay selects QR on desktop and supported payment apps on mobile.
    hide: [{ method: "upi", flows: ["collect"] }],
    preferences: { show_default_blocks: true },
  },
};
type Options = {
  key: string; order_id: string; amount: number; currency: string; name: string; description: string;
  image: string; theme: { color: string }; handler: (value: PaymentResponse) => void;
  modal: { ondismiss: () => void }; retry: { enabled: boolean };
  config?: typeof paymentDisplay;
};
type Checkout = { open: () => void; on: (event: "payment.failed", callback: () => void) => void };
declare global { interface Window { Razorpay?: new (options: Options) => Checkout; } }

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json",...(path === "/api/create-order" ? await customerAuthorization(Boolean(body && typeof body === "object" && ("accountQuoteId" in body || "id" in body))) : {}) },
    body: JSON.stringify(body), signal: AbortSignal.timeout(30_000),
  });
  let data: T & { error?: string };
  try { data = await response.json(); }
  catch { throw new Error("The payment service returned an unexpected response. Please try again."); }
  if (!response.ok) throw new Error(data.error || "The payment could not be processed. Please try again.");
  return data;
}

export function RazorpayCheckout({ keyId, amount, currency = "INR", testMode, securityEnabled, purpose = "checkout", quote, initialDonationAmount, onLockChange }: {
  quote?: {token?:string;id?:string;choice:"full"|"split"|"after_review";reference:string};
  keyId: string; amount: number; currency?: string; testMode: boolean; securityEnabled: boolean; purpose?: PaymentPurpose; initialDonationAmount?: number; onLockChange?: (locked:boolean)=>void;
}) {
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState("");
  const [phase, setPhase] = useState<"idle" | "creating" | "open" | "verifying" | "pending" | "paid" | "unconfirmed">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [paymentId, setPaymentId] = useState("");
  const [donation, setDonation] = useState(String(initialDonationAmount ?? 100));
  const [reference, setReference] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [paidAt, setPaidAt] = useState<Date | null>(null);
  const lock = useRef(false);
  const pending = useRef<PaymentResponse | null>(null);
  const callbackStarted = useRef(false);
  const busy = phase === "creating" || phase === "open" || phase === "verifying";
  useEffect(()=>{onLockChange?.(busy || phase === "pending" || phase === "unconfirmed" || phase === "paid");},[busy,phase,onLockChange]);
  const selectedAmount = purpose === "donation" ? Math.round(Number(donation) * 100) : amount;
  const validAmount = Number.isSafeInteger(selectedAmount) && selectedAmount >= 100 && selectedAmount <= (purpose === "donation" ? 1_000_000 : 100_000_000) && (purpose !== "donation" || /^\d+(\.\d{1,2})?$/.test(donation));
  const formattedAmount = new Intl.NumberFormat("en-IN", { style: "currency", currency }).format((Number.isFinite(selectedAmount) ? selectedAmount : 0) / 100);

  function resetSecurity() { setToken(""); setAttempt(value => value + 1); }
  async function verify(value: PaymentResponse) {
    lock.current = true;
    setPhase("verifying"); setError(""); setMessage("");
    setPaymentId(value.razorpay_payment_id);
    pending.current = value;
    try {
      const result = await post<Verification>("/api/verify-payment", value);
      if (result.verified !== true) throw new Error("The payment could not be verified.");
      if (result.paid === true && result.success === true && result.status === "captured") {
        setPhase("paid"); setPaidAt(new Date()); pending.current = null;
        
        setMessage(testMode ? "Test payment complete. No real money was charged." : purpose === "donation" ? "Thank you for supporting KITTY CORP. Your contribution was received." : "Payment received. Please keep your payment reference.");
      } else if (result.paid === false && result.status === "authorized") {
        setPhase("pending");
        setMessage("Your payment is authorized and awaiting capture. Please don’t pay again. You can check its status below.");
      } else { throw new Error("The payment is not confirmed. Please check its status before trying another payment."); }
    } catch (failure) {
      setPhase("unconfirmed");
      setError(failure instanceof Error ? failure.message : "We couldn’t confirm the payment. Please check its status.");
    } finally { lock.current = false; }
  }


  function downloadSupportReceipt() {
    const escapeXml = (value: string) => value.replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[character] || character));
    const dateText = (paidAt || new Date()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const donor = supporterName.trim() || "Supporter";
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">',
      '<rect width="1000" height="700" rx="36" fill="#f7f8f5"/><rect x="40" y="40" width="920" height="620" rx="28" fill="#fff" stroke="#e3e8e2"/>',
      '<circle cx="500" cy="170" r="68" fill="#e6f7eb"/><path d="M466 171l23 23 48-53" fill="none" stroke="#18864b" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>',
      '<text x="500" y="285" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#17251b">Thank you for your support</text>',
      '<text x="500" y="335" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" fill="#59665c">' + escapeXml(donor) + '</text>',
      '<text x="500" y="405" text-anchor="middle" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#17251b">' + escapeXml(formattedAmount) + '</text>',
      '<text x="500" y="450" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#59665c">Voluntary contribution to KITTY CORP</text>',
      '<line x1="130" y1="500" x2="870" y2="500" stroke="#e3e8e2"/>',
      '<text x="140" y="550" font-family="Arial,sans-serif" font-size="18" fill="#66716a">Payment reference</text><text x="140" y="582" font-family="Arial,sans-serif" font-size="20" fill="#17251b">' + escapeXml(paymentId) + '</text>',
      '<text x="860" y="550" text-anchor="end" font-family="Arial,sans-serif" font-size="18" fill="#66716a">Date</text><text x="860" y="582" text-anchor="end" font-family="Arial,sans-serif" font-size="20" fill="#17251b">' + escapeXml(dateText) + '</text>',
      '<text x="500" y="625" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#849087">Payment confirmation for your records · Not a tax receipt</text></svg>'
    ].join("");
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "kitty-corp-support-" + (paymentId || "receipt") + ".svg"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
\n  async function pay() {
    if (lock.current || pending.current || phase === "paid") return;
    if (!window.Razorpay) { setError("Checkout is still loading. Please wait a moment or refresh this page."); return; }
    if (securityEnabled && !token) { setError("Please complete the security check first."); return; }
    if (purpose === "donation" && !validAmount) { setError("Enter an amount between ₹1 and ₹10,000, with up to two decimal places."); return; }
    if (purpose === "project" && !testMode && !reference.trim() && !quote) { setError("Enter your project or invoice reference first."); return; }
    lock.current = true; callbackStarted.current = false;
    setPhase("creating"); setError(""); setMessage("");
    try {
      const order = await post<Order>("/api/create-order", { amount: selectedAmount, currency, purpose, reference:quote?.reference||reference,...(quote?{...(quote.id?{accountQuoteId:quote.id}:{quoteToken:quote.token}),paymentChoice:quote.choice}:{}), turnstileToken: token });
      if (!/^order_[A-Za-z0-9]{6,64}$/.test(order.order_id) || order.amount !== selectedAmount || order.currency !== currency) {
        throw new Error("The order details could not be verified. Refresh the page and try again.");
      }
      const checkout = new window.Razorpay({
        key: keyId, order_id: order.order_id, amount: order.amount, currency: order.currency,
        name: "KITTY CORP", description: `${testMode ? "Test: " : ""}${purpose === "donation" ? "Voluntary contribution" : purpose === "project" ? `Project payment${reference ? ` · ${reference}` : ""}` : "KITTY CORP payment"}`,
        image: `${window.location.origin}/brand/monogram-small-v2.webp`, theme: { color: "#252720" },
        retry: { enabled: true },
        config: paymentDisplay,
        handler: value => {
          if (callbackStarted.current) return;
          callbackStarted.current = true;
          void verify(value);
        },
        modal: { ondismiss: () => {
          if (callbackStarted.current) return;
          lock.current = false; setPhase("idle");
          setMessage("Checkout closed. No payment was confirmed.");
        } },
      });
      checkout.on("payment.failed", () => {
        // Razorpay keeps the modal open so the visitor can retry there.
        if (!callbackStarted.current) setError("The payment failed. Try another payment method in checkout, or close it and try again.");
      });
      setPhase("open"); checkout.open();
    } catch (failure) {
      lock.current = false; setPhase("idle");
      setError(failure instanceof Error ? failure.message : "Checkout could not open. Please try again.");
    } finally { resetSecurity(); }
  }

  return <section className="checkout-card" aria-labelledby="checkout-title" aria-busy={busy}>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive"
      onReady={() => { setScriptReady(true); setScriptError(""); }}
      onError={() => setScriptError("Checkout could not load. Check your connection and refresh this page.")} />
    {purpose === "donation" && phase === "paid" ? <div className="support-complete" role="status" aria-live="polite">
      <div className="support-complete-check" aria-hidden="true"><svg viewBox="0 0 64 64"><circle className="support-check-circle" cx="32" cy="32" r="29"/><path className="support-check-mark" d="M18 33l9 9 20-21"/></svg></div>
      <span className="support-complete-eyebrow">CONTRIBUTION CONFIRMED</span>
      <h2>Thank you{supporterName.trim() ? ", " + supporterName.trim() : ""}.</h2>
      <p>Your support means a lot to KITTY CORP. It helps us keep building and researching independently.</p>
      <div className="support-complete-amount"><span>Contribution</span><strong>{formattedAmount}</strong></div>
      <div className="support-complete-reference"><span>Payment reference</span><code>{paymentId}</code></div>
      <button type="button" className="button button-gold checkout-button" onClick={downloadSupportReceipt}><CreditCard size={17}/> Download confirmation</button>
      <a className="support-complete-home" href="/">Back to KITTY CORP</a>
      <p className="support-complete-note">This downloadable confirmation is for your records and is not a tax receipt.</p>
    </div> : <>
    {!quote?.id&&phase==="idle"&&<CustomerSignIn disabled={busy}/ >}
    <div className="checkout-card-top"><CreditCard size={22} aria-hidden="true"/><span className="checkout-mode">{testMode ? "TEST MODE" : "SECURE CHECKOUT"}</span></div>
    <h2 id="checkout-title">{purpose === "donation" ? "Choose your contribution." : purpose === "project" ? "Your project payment." : testMode ? "Try the checkout." : "Complete your payment."}</h2>
    <p>{testMode ? "This checkout is in test mode. No real money changes hands." : "Review the amount, then continue to Razorpay to choose your payment method."}</p>
    {purpose === "project" && !quote && <div className="checkout-field"><label htmlFor="project-reference">Project or invoice reference{testMode ? " (optional in test mode)" : ""}</label><input id="project-reference" value={reference} maxLength={80} placeholder="e.g. KITTY-2026-01" onChange={event => setReference(event.target.value)} disabled={busy || phase !== "idle"}/><span>Use the reference provided by the KITTY team.</span></div>}
    {purpose === "donation" && <div className="checkout-field"><label htmlFor="supporter-name">Name (optional)</label><input id="supporter-name" type="text" autoComplete="name" maxLength={80} value={supporterName} onChange={event => setSupporterName(event.target.value)} disabled={busy || phase !== "idle"} placeholder="Your name"/><span>Your name can appear on your downloadable confirmation.</span></div>}
    {purpose === "donation" && <div className="checkout-field"><label htmlFor="donation-amount">Contribution in rupees</label><div className="donation-presets">{[100, 250, 500, 1000].map(value => <button type="button" key={value} aria-pressed={donation === String(value)} disabled={busy || phase !== "idle"} onClick={() => setDonation(String(value))}>₹{value}</button>)}</div><input id="donation-amount" type="number" inputMode="decimal" min="1" max="10000" step="0.01" value={donation} onChange={event => setDonation(event.target.value)} disabled={busy || phase !== "idle"}/><span>₹1 minimum · Suggested amounts help make the contribution meaningful. Entirely voluntary.</span></div>}
    <div className="checkout-total"><span>{testMode ? "Test amount" : "Payment amount"}</span><strong>{formattedAmount}</strong></div>
    <LocalPrice amount={Number.isFinite(selectedAmount)?selectedAmount:0}/><p className="checkout-methods">Choose UPI, cards or another available method in checkout.</p>
    {testMode && <p className="checkout-upi-note">UPI QR and payment-app options depend on Razorpay’s account settings and may not appear in test mode.</p>}
    {securityEnabled && (phase === "idle" || phase === "creating" || phase === "open") && <Turnstile action="payment-order" onToken={setToken} resetKey={attempt}/>}
    {phase === "idle" && !scriptError && (!scriptReady || (securityEnabled && !token)) && <p className="checkout-loading-status" role="status">{!scriptReady ? "Loading Razorpay securely…" : "Checking your connection securely… This usually takes a moment."}</p>}
    {scriptError && <p className="checkout-error" role="alert">{scriptError}</p>}
    {error && <p className="checkout-error" role="alert">{error}</p>}
    {message && <p className={phase === "paid" ? "checkout-success" : "checkout-message"} role="status">{phase === "paid" && <Check size={17} aria-hidden="true"/>}{message}</p>}
    {paymentId && <p className="checkout-reference">Payment reference <code>{paymentId}</code></p>}
}
    {(phase === "pending" || phase === "unconfirmed") ? <button className="button button-gold checkout-button" onClick={() => { if (pending.current && !lock.current) void verify(pending.current); }}>Check payment status</button>
      : <button className="button button-gold checkout-button" onClick={() => void pay()}
        disabled={!scriptReady || Boolean(scriptError) || busy || phase === "paid" || (securityEnabled && !token) || (purpose === "donation" && !validAmount)}>
        {busy && <LoaderCircle size={17} className="checkout-spinner" aria-hidden="true"/>}
        {phase === "paid" ? "Payment complete" : phase === "creating" ? "Preparing checkout…" : phase === "open" ? "Checkout open…" : phase === "verifying" ? "Verifying payment…" : !scriptReady ? "Loading checkout…" : securityEnabled && !token ? "Checking security…" : `${testMode ? "Pay test" : "Pay"} ${formattedAmount}`}
      </button>}
    <p className="checkout-security"><ShieldCheck size={14} aria-hidden="true"/>Payment details are handled by Razorpay.</p>
  </>}\n  </section>;
}
