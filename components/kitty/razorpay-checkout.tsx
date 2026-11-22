"use client";

import {CustomerSignIn} from "./customer-sign-in";
import {customerAuthorization} from "@/lib/customer-request";
import {LocalPrice} from "./local-currency";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Check, Download, CreditCard, LoaderCircle, ShieldCheck } from "lucide-react";
import { Turnstile } from "./turnstile";
import type { PaymentPurpose } from "@/lib/razorpay-server";
import { PaymentResult } from "./payment-result";

type PaymentResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type Order = { order_id: string; amount: number; currency: string };
type Verification = { success: boolean; verified: boolean; paid: boolean; status: string; payment_id: string };
type PaymentOutcome = { status: "success" | "failure"; title: string; description: string; reference?: string };
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
  modal: { ondismiss: () => void }; retry: { enabled: boolean }; prefill?: { name?: string; email?: string };
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
  const [outcome, setOutcome] = useState<PaymentOutcome | null>(null);
  const [donation, setDonation] = useState(String(initialDonationAmount ?? 49));
  const [supporterEmail, setSupporterEmail] = useState("");
  const [supporterMessage, setSupporterMessage] = useState("");
  const [reference, setReference] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [paidAt, setPaidAt] = useState<Date | null>(null);
  const lock = useRef(false);
  const pending = useRef<PaymentResponse | null>(null);
  const callbackStarted = useRef(false);
  const outcomeRef = useRef<PaymentOutcome | null>(null);
  const busy = phase === "creating" || phase === "open" || phase === "verifying";
  useEffect(()=>{onLockChange?.(busy || phase === "pending" || phase === "unconfirmed" || phase === "paid");},[busy,phase,onLockChange]);
  const selectedAmount = purpose === "donation" ? Math.round(Number(donation) * 100) : amount;
  const validAmount = Number.isSafeInteger(selectedAmount) && selectedAmount >= (purpose === "donation" ? 4_900 : 100) && selectedAmount <= (purpose === "donation" ? 999_900 : 100_000_000) && (purpose !== "donation" || /^\d+(\.\d{1,2})?$/.test(donation));
  const validSupporter = supporterName.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supporterEmail.trim()) && supporterMessage.length <= 180;
  const formattedAmount = new Intl.NumberFormat("en-IN", { style: "currency", currency }).format((Number.isFinite(selectedAmount) ? selectedAmount : 0) / 100);

  function resetSecurity() { setToken(""); setAttempt(value => value + 1); }
  function publishOutcome(next: PaymentOutcome) { outcomeRef.current = next; setOutcome(next); setError(""); setMessage(""); }
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
        publishOutcome({ status: "success", title: testMode ? "Test payment complete" : "Payment successful", description: testMode ? "No real money was charged. This was a test transaction." : purpose === "donation" ? "Your Fuel Us purchase is confirmed. Thank you for fueling our engineers at KITTY CORP." : "Payment received. Please keep this payment reference for your records.", reference: value.razorpay_payment_id });
      } else if (result.paid === false && result.status === "authorized") {
        setPhase("pending");
        outcomeRef.current = null; setOutcome(null);
        setMessage("Your payment is authorized and awaiting capture. Please don’t pay again. You can check its status below.");
      } else { throw new Error("The payment is not confirmed. Please check its status before trying another payment."); }
    } catch (failure) {
      setPhase("unconfirmed");
      publishOutcome({ status: "failure", title: "Payment could not be confirmed", description: (failure instanceof Error ? failure.message : "We couldn’t confirm the payment.") + " If your bank shows a debit, do not pay again. Check payment status or contact KITTY CORP.", reference: value.razorpay_payment_id });
    } finally { lock.current = false; }
  }


  function downloadSupportReceipt() {
    const escapeXml = (value: string) => value.replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[character] || character));
    const dateText = (paidAt || new Date()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const donor = supporterName.trim();
    const email = supporterEmail.trim();
    const note = supporterMessage.trim();
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="760" viewBox="0 0 1000 760">',
      '<rect width="1000" height="760" rx="36" fill="#f7f8f5"/><rect x="40" y="40" width="920" height="680" rx="28" fill="#fff" stroke="#e3e8e2"/>',
      '<circle cx="500" cy="155" r="68" fill="#e6f7eb"/><path d="M466 156l23 23 48-53" fill="none" stroke="#18864b" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>',
      '<text x="500" y="270" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#17251b">' + (testMode ? 'Test payment complete' : 'Fuel Us purchase confirmed') + '</text>',
      '<text x="500" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" fill="#59665c">' + escapeXml(donor) + '</text>',
      '<text x="500" y="355" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#59665c">' + escapeXml(email) + '</text>',
      '<text x="500" y="425" text-anchor="middle" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#17251b">' + escapeXml(formattedAmount) + '</text>',
      '<text x="500" y="470" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#59665c">' + (testMode ? 'Test checkout · no real money charged' : 'Fuel Us ☕ · KITTY CORP') + '</text>',
      note ? '<text x="500" y="510" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#59665c" textLength="740" lengthAdjust="spacingAndGlyphs">' + escapeXml(note) + '</text>' : '',
      '<line x1="130" y1="550" x2="870" y2="550" stroke="#e3e8e2"/>',
      '<text x="140" y="595" font-family="Arial,sans-serif" font-size="18" fill="#66716a">Payment reference</text><text x="140" y="628" font-family="Arial,sans-serif" font-size="20" fill="#17251b">' + escapeXml(paymentId) + '</text>',
      '<text x="860" y="595" text-anchor="end" font-family="Arial,sans-serif" font-size="18" fill="#66716a">Date</text><text x="860" y="628" text-anchor="end" font-family="Arial,sans-serif" font-size="20" fill="#17251b">' + escapeXml(dateText) + '</text>',
      '<text x="500" y="685" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#849087">Payment confirmation for your records · Not an invoice</text></svg>'
    ].join("");
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kitty-corp-coffee-" + (paymentId || "receipt") + ".svg";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadFuelPerks() {
    const escapeXml = (value:string) => value.replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[character] || character));
    const name = escapeXml(supporterName.trim() || "KITTY CORP supporter");
    const note = escapeXml(supporterMessage.trim() || "Fueling ideas into reality.");
    const badge = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#101820"/><stop offset="1" stop-color="#173f2a"/></linearGradient></defs><rect width="1200" height="700" rx="56" fill="url(#g)"/><circle cx="950" cy="130" r="240" fill="#23a45b" opacity=".12"/><text x="80" y="110" fill="#91d5a8" font-family="Arial,sans-serif" font-size="28" letter-spacing="8">KITTY CORP · FUEL US</text><text x="80" y="285" fill="#fff" font-family="Arial,sans-serif" font-size="82" font-weight="700">Thank you,</text><text x="80" y="390" fill="#fff" font-family="Arial,sans-serif" font-size="68">${name}</text><text x="80" y="480" fill="#b9e8c8" font-family="Arial,sans-serif" font-size="36">${note}</text><text x="80" y="610" fill="#91d5a8" font-family="Arial,sans-serif" font-size="24">A LITTLE FUEL. A LOT OF CURIOSITY. ☕</text></svg>`;
    const mobile = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="2560" viewBox="0 0 1440 2560"><defs><linearGradient id="w" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#070b12"/><stop offset=".55" stop-color="#102b20"/><stop offset="1" stop-color="#071018"/></linearGradient><radialGradient id="r"><stop stop-color="#2ba45b" stop-opacity=".4"/><stop offset="1" stop-color="#2ba45b" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="2560" fill="url(#w)"/><circle cx="1200" cy="400" r="850" fill="url(#r)"/><text x="110" y="250" fill="#9bd7ad" font-family="Arial,sans-serif" font-size="30" letter-spacing="8">KITTY CORP</text><text x="110" y="1050" fill="#fff" font-family="Arial,sans-serif" font-size="100" font-weight="700">Beyond</text><text x="110" y="1170" fill="#fff" font-family="Arial,sans-serif" font-size="100" font-weight="700">Intelligence.</text><text x="110" y="1350" fill="#b8d9c4" font-family="Arial,sans-serif" font-size="46">For a better &amp; safer future.</text><text x="110" y="2240" fill="#9bd7ad" font-family="Arial,sans-serif" font-size="34">THANK YOU, ${name.toUpperCase()}</text><text x="110" y="2320" fill="#b8d9c4" font-family="Arial,sans-serif" font-size="28">${note}</text></svg>`;
    const desktop = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440"><defs><linearGradient id="w" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#070b12"/><stop offset=".55" stop-color="#102b20"/><stop offset="1" stop-color="#071018"/></linearGradient><radialGradient id="r"><stop stop-color="#2ba45b" stop-opacity=".4"/><stop offset="1" stop-color="#2ba45b" stop-opacity="0"/></radialGradient></defs><rect width="2560" height="1440" fill="url(#w)"/><circle cx="2200" cy="350" r="1000" fill="url(#r)"/><text x="180" y="180" fill="#9bd7ad" font-family="Arial,sans-serif" font-size="34" letter-spacing="8">KITTY CORP</text><text x="180" y="600" fill="#fff" font-family="Arial,sans-serif" font-size="150" font-weight="700">Beyond Intelligence.</text><text x="180" y="780" fill="#b8d9c4" font-family="Arial,sans-serif" font-size="66">For a better &amp; safer future.</text><text x="180" y="1260" fill="#9bd7ad" font-family="Arial,sans-serif" font-size="40">THANK YOU, ${name.toUpperCase()} · ☕</text><text x="180" y="1340" fill="#b8d9c4" font-family="Arial,sans-serif" font-size="34">${note}</text></svg>`;
    for (const [file,content] of [["kitty-corp-supporter-badge.svg",badge],["kitty-corp-wallpaper-mobile.svg",mobile],["kitty-corp-wallpaper-desktop.svg",desktop]]) {
      const url=URL.createObjectURL(new Blob([content],{type:"image/svg+xml;charset=utf-8"}));
      const a=document.createElement("a");a.href=url;a.download=file;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  }

  async function pay() {
    if (lock.current || pending.current || phase === "paid") return;
    if (!window.Razorpay) { setError("Checkout is still loading. Please wait a moment or refresh this page."); return; }
    if (securityEnabled && !token) { setError("Please complete the security check first."); return; }
    if (purpose === "donation" && !validAmount) { setError("Enter an amount between ₹49 and ₹9,999, with up to two decimal places."); return; }
    if (purpose === "donation" && !validSupporter) { setError("Enter your name and a valid email. The optional message must be 180 characters or fewer."); return; }
    if (purpose === "project" && !testMode && !reference.trim() && !quote) { setError("Enter your project or invoice reference first."); return; }
    lock.current = true; callbackStarted.current = false;
    outcomeRef.current = null; setOutcome(null);
    setPhase("creating"); setError(""); setMessage("");
    try {
      const order = await post<Order>("/api/create-order", { amount: selectedAmount, currency, purpose, reference:quote?.reference||reference,...(purpose === "donation" ? { supporterName: supporterName.trim(), supporterEmail: supporterEmail.trim(), supporterMessage: supporterMessage.trim() } : {}),...(quote?{...(quote.id?{accountQuoteId:quote.id}:{quoteToken:quote.token}),paymentChoice:quote.choice}:{}), turnstileToken: token });
      if (!/^order_[A-Za-z0-9]{6,64}$/.test(order.order_id) || order.amount !== selectedAmount || order.currency !== currency) {
        throw new Error("The order details could not be verified. Refresh the page and try again.");
      }
      const checkout = new window.Razorpay({
        key: keyId, order_id: order.order_id, amount: order.amount, currency: order.currency,
        name: "KITTY CORP", description: `${testMode ? "Test: " : ""}${purpose === "donation" ? "Fuel Us coffee purchase" : purpose === "project" ? `Project payment${reference ? ` · ${reference}` : ""}` : "KITTY CORP payment"}`, prefill: purpose === "donation" ? { name: supporterName.trim(), email: supporterEmail.trim() } : undefined,
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
          if (outcomeRef.current?.status !== "failure") setMessage("Checkout closed. No payment was confirmed.");
        } },
      });
      checkout.on("payment.failed", () => {
        // Razorpay keeps the modal open so the visitor can retry there; the animated result remains after it closes.
        if (!callbackStarted.current) publishOutcome({ status: "failure", title: "Oops! Payment failed", description: "Razorpay could not complete this attempt. Try another payment method in checkout, or close it and try again." });
      });
      setPhase("open"); checkout.open();
    } catch (failure) {
      lock.current = false; setPhase("idle");
      publishOutcome({ status: "failure", title: "Checkout could not start", description: failure instanceof Error ? failure.message : "Checkout could not open. Please try again." });
    } finally { resetSecurity(); }
  }

  return <section className="checkout-card" aria-labelledby="checkout-title" aria-busy={busy}>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive"
      onReady={() => { setScriptReady(true); setScriptError(""); }}
      onError={() => setScriptError("Checkout could not load. Check your connection and refresh this page.")} />
    {purpose === "donation" && phase === "paid" ? <div className="support-complete" role="status" aria-live="polite">
      <div className="support-complete-check" aria-hidden="true"><svg viewBox="0 0 64 64"><circle className="support-check-circle" cx="32" cy="32" r="29"/><path className="support-check-mark" d="M18 33l9 9 20-21"/></svg><img className="support-complete-logo" src="/brand/kitty-corp-logo-transparent.png" alt="" /></div>
      <span className="support-complete-eyebrow">{testMode ? "TEST PAYMENT COMPLETE" : "FUEL US · PURCHASE CONFIRMED"}</span>
      <h2>{testMode ? "Test checkout complete." : "Thank you" + (supporterName.trim() ? ", " + supporterName.trim() : "") + "."}</h2>
      <p>{testMode ? "No real money was charged. This was a test transaction." : "Thank you for fueling our engineers at KITTY CORP. Your purchase is confirmed. We’ll email you updates soon."}</p>
      <p className="support-complete-contact"><strong>{supporterName.trim()}</strong><br/>{supporterEmail.trim()}</p>
      {supporterMessage.trim() && <p className="support-complete-message">{supporterMessage.trim()}</p> }
      <div className="support-complete-amount"><span>{testMode ? "Test amount" : "Purchase amount"}</span><strong>{formattedAmount}</strong></div>
      <div className="support-complete-reference"><span>Payment reference</span><code>{paymentId}</code></div>
      <button type="button" className="button button-gold checkout-button" onClick={downloadSupportReceipt}><Download size={17}/> Download payment confirmation</button>
      {Number(donation)>=49 && <button type="button" className="button button-outline checkout-button" onClick={downloadFuelPerks}><Download size={17}/> Download supporter badge &amp; wallpapers</button>}
      {Number(donation)>=5000 && <a className="button button-outline checkout-button" href="/contact">Talk with our team</a>}
      <a className="support-complete-home" href="/">Back to KITTY CORP</a>
      <p className="support-complete-note">{testMode ? "Test confirmation only · No real contribution received." : "This downloadable payment confirmation is for your records; it is not an invoice."}</p>
    </div> : outcome?.status === "success" ? <PaymentResult {...outcome} /> : <>
    {outcome?.status === "failure" && <PaymentResult {...outcome} />}
    {purpose !== "donation" && !quote?.id && phase === "idle" && <CustomerSignIn disabled={busy} /> }
    <div className="checkout-card-top"><CreditCard size={22} aria-hidden="true"/><span className="checkout-mode">{testMode ? "TEST MODE" : "SECURE CHECKOUT"}</span></div>
    <h2 id="checkout-title">{purpose === "donation" ? "Buy us a coffee." : purpose === "project" ? "Your project payment." : testMode ? "Try the checkout." : "Complete your payment."}</h2>
    <p>{testMode ? "This checkout is in test mode. No real money changes hands." : purpose === "donation" ? "Fuel our engineers. ₹49–₹5,000 includes a custom thank-you message, supporter badge and wallpapers. ₹5,000–₹9,999 includes all of that plus a conversation with our team." : "Review the amount, then continue to Razorpay to choose your payment method."}</p>
    {purpose === "project" && !quote && <div className="checkout-field"><label htmlFor="project-reference">Project or invoice reference{testMode ? " (optional in test mode)" : ""}</label><input id="project-reference" value={reference} maxLength={80} placeholder="e.g. KITTY-2026-01" onChange={event => setReference(event.target.value)} disabled={busy || phase !== "idle"}/><span>Use the reference provided by the KITTY team.</span></div>}
    {purpose === "donation" && <div className="checkout-field"><label htmlFor="supporter-name">Your name <span aria-hidden="true">*</span></label><input id="supporter-name" type="text" autoComplete="name" maxLength={80} required value={supporterName} onChange={event => setSupporterName(event.target.value)} disabled={busy || phase !== "idle"} placeholder="Name"/><span>Shown on your confirmation.</span></div>}
    {purpose === "donation" && <div className="checkout-field"><label htmlFor="supporter-email">Email <span aria-hidden="true">*</span></label><input id="supporter-email" type="email" autoComplete="email" maxLength={254} required value={supporterEmail} onChange={event => setSupporterEmail(event.target.value)} disabled={busy || phase !== "idle"} placeholder="you@example.com"/><span>Required for your purchase confirmation. It is recorded in the payment order notes.</span></div>}
    {purpose === "donation" && <div className="checkout-field"><label htmlFor="supporter-message">Message (optional)</label><textarea id="supporter-message" maxLength={180} rows={3} value={supporterMessage} onChange={event => setSupporterMessage(event.target.value)} disabled={busy || phase !== "idle"} placeholder="Leave a note for KITTY CORP"/><span>{supporterMessage.length}/180</span></div> }
    {purpose === "donation" && <div className="checkout-field"><label htmlFor="donation-amount">Fuel Us purchase amount (INR)</label><div className="fuel-presets">{[49, 500, 1000, 5000, 9999].map(value => <button type="button" key={value} aria-pressed={donation === String(value)} disabled={busy || phase !== "idle"} onClick={() => setDonation(String(value))}>₹{value}</button>)}</div><input id="donation-amount" type="number" inputMode="decimal" min="49" max="9999" step="0.01" value={donation} onChange={event => setDonation(event.target.value)} disabled={busy || phase !== "idle"}/><span>Minimum ₹49 · Maximum ₹9,999.</span></div> }
    <div className="checkout-total"><span>{testMode ? "Test amount" : "Payment amount"}</span><strong>{formattedAmount}</strong></div>
    <LocalPrice amount={Number.isFinite(selectedAmount)?selectedAmount:0}/><p className="checkout-methods">Choose UPI, cards or another available method in checkout.</p>
    {testMode && <p className="checkout-upi-note">UPI QR and payment-app options depend on Razorpay’s account settings and may not appear in test mode.</p>}
    {securityEnabled && (phase === "idle" || phase === "creating" || phase === "open") && <Turnstile action="payment-order" onToken={setToken} resetKey={attempt}/>}
    {phase === "idle" && !scriptError && (!scriptReady || (securityEnabled && !token)) && <p className="checkout-loading-status" role="status">{!scriptReady ? "Loading Razorpay securely…" : "Checking your connection securely… This usually takes a moment."}</p>}
    {scriptError && <p className="checkout-error" role="alert">{scriptError}</p>}
    {error && !outcome && <p className="checkout-error" role="alert">{error}</p>}
    {message && !outcome && <p className={phase === "paid" ? "checkout-success" : "checkout-message"} role="status">{phase === "paid" && <Check size={17} aria-hidden="true"/>}{message}</p>}
    {paymentId && <p className="checkout-reference">Payment reference <code>{paymentId}</code></p>}
    {(phase === "pending" || phase === "unconfirmed") ? <button className="button button-gold checkout-button" onClick={() => { if (pending.current && !lock.current) void verify(pending.current); }}>Check payment status</button>
      : <button className="button button-gold checkout-button" onClick={() => void pay()}
        disabled={!scriptReady || Boolean(scriptError) || busy || phase === "paid" || (securityEnabled && !token) || (purpose === "donation" && (!validAmount || !validSupporter))}>
        {busy && <LoaderCircle size={17} className="checkout-spinner" aria-hidden="true"/>}
        {phase === "paid" ? "Payment complete" : phase === "creating" ? "Preparing checkout…" : phase === "open" ? "Checkout open…" : phase === "verifying" ? "Verifying payment…" : !scriptReady ? "Loading checkout…" : securityEnabled && !token ? "Checking security…" : `${testMode ? "Pay test" : "Pay"} ${formattedAmount}`}
      </button>}
    <p className="checkout-security"><ShieldCheck size={14} aria-hidden="true"/>Payment details are handled by Razorpay.</p>
  </>}
  </section>;
}
