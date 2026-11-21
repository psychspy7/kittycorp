"use client";

import Image from "next/image";
import { LocalPrice } from "./local-currency";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { Check, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, AlertCircle, HeartHandshake, Layers } from "lucide-react";
import { kittyCustomerAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "@/lib/kitty-customer";
import type { MembershipCatalog } from "@/lib/membership-types";
import { Turnstile } from "./turnstile";
import Link from "next/link";

type Callback = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type AccountStatus = { paid: boolean; expiresAt: number; freeRemainingSeconds: number };

async function accountStatus(user: User, signal: AbortSignal) {
  const bearer = await user.getIdToken();
  const response = await fetch("/api/memberships/me", {
    headers: { Authorization: "Bearer " + bearer },
    cache: "no-store",
    signal,
  });
  const data = (await response.json()) as AccountStatus & { error?: string };
  if (!response.ok) throw Error(data.error || "Your current membership could not be checked.");
  return data;
}

type Order = { intentId: string; keyId: string; orderId: string; amount: number; currency: string; testMode: boolean };

export function Memberships({ catalog, securityEnabled }: { catalog: MembershipCatalog; securityEnabled: boolean }) {
  const [account, setAccount] = useState<AccountStatus | null>(null);
  const [user, setUser] = useState<User | null>(null),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [token, setToken] = useState(""),
    [revision, setRevision] = useState(0);
  const [pending, setPending] = useState<{ id: string; uid: string } | null>(null);
  const epoch = useRef(0),
    lock = useRef(false),
    current = useRef<User | null>(null),
    callbackUsed = useRef(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined,
      alive = true;
    void kittyCustomerAuth()
      .then((auth) => {
        if (!alive) return;
        unlisten = onAuthStateChanged(auth, (next) => {
          if (current.current?.uid !== next?.uid) {
            epoch.current++;
            setMessage("");
            setError("");
            setPending(null);
            setAccount(null);
          }
          current.current = next;
          setUser(next);
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
      unlisten?.();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    void accountStatus(user, controller.signal)
      .then((status) => {
        if (!controller.signal.aborted && current.current?.uid === user.uid) setAccount(status);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [user]);

  async function request<T = Record<string, unknown>>(path: string, body?: unknown) {
    const account = current.current;
    if (!account) throw new Error("Sign in with Google to manage your verified patron credentials.");
    const uid = account.uid,
      bearer = await account.getIdToken();
    if (current.current?.uid !== uid) throw new Error("Account changed. Start again.");
    const response = await fetch("/api/memberships/" + path, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + bearer },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000),
    });
    const data = (await response.json()) as T & { error?: string };
    if (!response.ok) throw new Error(data.error || "Membership request failed.");
    if (current.current?.uid !== uid) throw new Error("Account changed. Check the purchase with its original account.");
    return data as T;
  }

  async function login() {
    if (lock.current) return;
    setError("");
    try {
      const auth = await kittyCustomerAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (e) {
      setError((e as Error).message || "Google sign-in could not be completed.");
    }
  }

  async function status() {
    if (!pending || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const r = await request<{ active: boolean; paid: boolean; testMode?: boolean }>(
        "status?intentId=" + encodeURIComponent(pending.id)
      );
      if (r.active && r.paid) {
        setPending(null);
        setMessage(
          r.testMode
            ? "Test membership verified. No production access or real charge."
            : "KITTY ONE Membership is verified and active."
        );
      } else {
        setMessage("Payment status: awaiting capture or bank clearance.");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  async function pay(planId: string) {
    if (lock.current) return;
    if (!user) {
      await login();
      return;
    }
    if (!ready || typeof window.Razorpay !== "function") {
      setError("Payment checkout is loading. Please wait a moment and try again.");
      return;
    }
    if (securityEnabled && !token) {
      setError("Please complete the verification check before proceeding.");
      return;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    callbackUsed.current = false;
    const generation = epoch.current,
      uid = user.uid,
      id = crypto.randomUUID();
    try {
      const order = await request<Order>("order", { id, planId, turnstileToken: token });
      if (generation !== epoch.current) return;
      setPending({ id: order.intentId, uid });
      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "KITTY CORP",
        description: (order.testMode ? "TEST · " : "") + "KITTY ONE Annual Membership ($249 USD)",
        image: window.location.origin + "/brand/monogram.png",
        theme: { color: "#2457D6" },
        retry: { enabled: true },
        handler: (value: Callback) => {
          if (callbackUsed.current || generation !== epoch.current) return;
          callbackUsed.current = true;
          lock.current = true;
          setBusy(true);
          void request<{ active: boolean; paid: boolean; testMode?: boolean }>("verify", { ...value, intentId: order.intentId })
            .then((r) => {
              if (generation !== epoch.current) return;
              if (r.active && r.paid) {
                setPending(null);
                setMessage(
                  r.testMode
                    ? "Test membership verified. No production charge."
                    : "KITTY ONE Membership is active. Welcome to our research patron network."
                );
              } else setMessage("Payment is awaiting capture or reconciliation. Please do not pay again; check its status.");
            })
            .catch((e) => {
              if (generation === epoch.current) setError((e as Error).message);
            })
            .finally(() => {
              lock.current = false;
              setBusy(false);
            });
        },
        modal: {
          ondismiss: () => {
            if (callbackUsed.current) return;
            lock.current = false;
            setBusy(false);
            if (generation === epoch.current) {
              setMessage("Checkout closed. No membership was activated.");
              void request("cancel", { intentId: order.intentId }).catch(() => {});
            }
          },
        },
      });
      checkout.on("payment.failed", () => {
        if (generation === epoch.current) setError("Payment failed. Please retry in Razorpay or use an alternate method.");
      });
      checkout.open();
    } catch (e) {
      if (generation === epoch.current) setError((e as Error).message);
      lock.current = false;
      setBusy(false);
    } finally {
      setToken("");
      setRevision((x) => x + 1);
    }
  }

  const featuredPlan = catalog.plans.find((p) => p.product === "kitty") || catalog.plans[0];

  return (
    <div className="w-full">
      {/* Account Verification Bar */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] mb-10 shadow-sm" aria-label="Membership account">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#2457D6] shrink-0" />
          <span className="text-sm font-medium text-[#191B1D]">
            {user ? "Signed in as: " + (user.email || "Patron Account") : "Sign in with Google to tie membership credentials to your verified identity."}
          </span>
        </div>
        {user ? (
          <button
            disabled={busy}
            onClick={() => void kittyCustomerAuth().then(signOut)}
            className="text-xs font-mono px-4 py-2 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[#292D31] hover:bg-[#E9E6E0] transition-colors"
          >
            Switch Account
          </button>
        ) : (
          <button
            onClick={() => void login()}
            className="text-xs font-medium px-5 py-2.5 rounded-full bg-[#191B1D] !text-white hover:bg-[#292D31] transition-all shrink-0 shadow-sm inline-flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 16.14 15.645 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.47 0 2.815.535 3.86 1.415l2.4-2.4C16.89 3.48 14.7 2.6 12.24 2.6 7.07 2.6 2.88 6.79 2.88 12s4.19 9.4 9.36 9.4c5.4 0 8.98-3.795 8.98-9.14 0-.61-.06-1.2-.18-1.74h-8.8v-.235z"/>
            </svg>
            <span className="!text-white">Sign in with Google</span>
          </button>
        )}
      </section>

      {account && (
        <div className="p-4 rounded-xl border border-[#2457D6]/30 bg-[#2457D6]/5 text-sm text-[#191B1D] mb-8" role="status">
          {account.paid
            ? `KITTY ONE Active until ${new Date(account.expiresAt).toLocaleDateString()}. Your research access and website privilege are active.`
            : "Account connected. No active membership on record."}
        </div>
      )}

      {!catalog.purchasesEnabled && (
        <div className="p-4 rounded-xl border border-[#D9D6CF] bg-[#E9E6E0] text-sm text-[#292D31] mb-8" role="status">
          Public membership intake is currently invitation-only while hardware production runs are processed. You may submit an inquiry for private enrollment.
        </div>
      )}

      {catalog.testMode && catalog.purchasesEnabled && (
        <div className="p-3 rounded-lg border border-[#D9D6CF] bg-[#FBFAF7] text-xs font-mono text-[#73777C] mb-6">
          TEST MODE · No real currency is charged.
        </div>
      )}

      {/* =========================================================================
          SINGLE FEATURED PLAN: KITTY ONE ($249 USD)
          ========================================================================= */}
      <div className="max-w-3xl mx-auto mb-16">
        <article className="p-8 sm:p-12 rounded-3xl border-2 border-[#2457D6] bg-[#FBFAF7] shadow-[0_8px_40px_rgba(36,87,214,0.08)] relative">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2457D6] text-white text-[11px] font-mono tracking-wider uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SINGLE ANNUAL MEMBERSHIP</span>
            </span>
            <span className="text-xs font-mono text-[#73777C]">ANNUAL PATRON PASS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-3">
            KITTY ONE
          </h2>

          <p className="text-base sm:text-lg text-[#62676D] font-light mb-8">
            Our exclusive annual patron membership supporting independent physical AI, agricultural robotics, and clean energy systems.
          </p>

          <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-[#D9D6CF]">
            <span className="text-4xl sm:text-5xl font-normal font-[family-name:var(--font-display)] text-[#191B1D]">
              $249
            </span>
            <span className="text-base text-[#73777C] font-light">USD / year</span>
            <span className="text-sm font-mono text-[#2457D6] ml-2">
              (approx. ₹20,900 INR)
            </span>
          </div>

          {/* =========================================================================
              CSS MOCKUP: METALLIC NFC CARD (ANODIZED TITANIUM FINISH)
              ========================================================================= */}
          <div className="my-8 p-6 rounded-2xl bg-[#E9E6E0] border border-[#D9D6CF] flex flex-col items-center justify-center">
            <div className="w-full max-w-sm aspect-[1.586/1] rounded-2xl p-6 relative overflow-hidden shadow-[0_20px_48px_rgba(0,0,0,0.35)] border border-stone-500/40 bg-gradient-to-br from-[#1C1E22] via-[#2D3136] to-[#121316] text-[#E2E5E8] flex flex-col justify-between select-none">
              {/* Brushed Titanium Sheen Layer */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

              {/* Top Header: Logo, Name & Contactless */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <Image
                    unoptimized
                    src="/brand/monogram-small-v1.webp"
                    alt="KITTY CORP"
                    width={26}
                    height={26}
                    className="object-contain brightness-125"
                  />
                  <div>
                    <span className="font-mono text-xs tracking-[0.24em] font-semibold text-white uppercase block">
                      KITTY CORP
                    </span>
                    <span className="text-[8px] font-mono tracking-widest text-stone-400 uppercase">
                      RESEARCH CREDENTIAL
                    </span>
                  </div>
                </div>

                {/* Contactless waves SVG */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-white/20 text-[9px] font-mono text-stone-300">
                  <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
                    <path d="M12 19a8.5 8.5 0 0 1 0-12" strokeLinecap="round" />
                    <path d="M15.5 21.5a12 12 0 0 1 0-17" strokeLinecap="round" />
                  </svg>
                  <span>NFC</span>
                </div>
              </div>

              {/* Middle Section: Smart Chip & Credential Info */}
              <div className="relative z-10 flex items-center justify-between my-auto py-2">
                {/* Smart Chip Contact Graphic */}
                <div className="w-11 h-8 rounded-md bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] p-[1px] shadow-sm relative overflow-hidden">
                  <div className="w-full h-full rounded-[5px] bg-gradient-to-br from-[#E2B755] to-[#B8860B] grid grid-cols-3 grid-rows-2 gap-[1px] p-[2px]">
                    <div className="border-r border-b border-[#7B5B00]/40 rounded-tl-[3px]" />
                    <div className="border-b border-[#7B5B00]/40" />
                    <div className="border-l border-b border-[#7B5B00]/40 rounded-tr-[3px]" />
                    <div className="border-r border-[#7B5B00]/40 rounded-bl-[3px]" />
                    <div className="" />
                    <div className="border-l border-[#7B5B00]/40 rounded-br-[3px]" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[13px] sm:text-[15px] font-mono tracking-[0.25em] text-white font-medium uppercase">
                    KITTY ONE
                  </div>
                  <div className="text-[9px] font-mono tracking-widest text-[#E5E7EB] uppercase mt-0.5">
                    ANNUAL RESEARCH PATRON
                  </div>
                </div>
              </div>

              {/* Bottom Laser Engraved Info */}
              <div className="flex items-end justify-between text-[9px] font-mono text-[#E5E7EB] border-t border-white/20 pt-2.5 relative z-10">
                <div>
                  <span className="block text-[7.5px] text-stone-400 uppercase tracking-widest">PATRON ID</span>
                  <span className="tracking-wider text-white">KC-2026-PATRON</span>
                </div>
                <div className="text-right">
                  <span className="block text-[7.5px] text-stone-400 uppercase tracking-widest">EDITION</span>
                  <span className="tracking-wider text-stone-200">BATCH 01 · PHYSICAL AI</span>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#62676D] font-light text-center mt-4 max-w-md">
              Physical metallic NFC cards ship with the inaugural production batch. Digital research credentials and website build privileges activate immediately upon enrollment.
            </p>
          </div>

          {/* =========================================================================
              THE 5 DISTINCT BENEFITS
              ========================================================================= */}
          <div className="mb-10">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#73777C] mb-4">
              Included Annual Benefits
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3.5 text-[15px] sm:text-[16px] text-[#292D31]">
                <div className="w-5 h-5 rounded-full bg-[#2457D6]/10 text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-medium text-[#191B1D]">Laser-Etched Metallic NFC Card</strong>
                  <p className="text-xs text-[#62676D] font-light mt-0.5">Custom-engraved physical membership card delivered upon production run completion.</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5 text-[15px] sm:text-[16px] text-[#292D31]">
                <div className="w-5 h-5 rounded-full bg-[#2457D6]/10 text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-medium text-[#191B1D]">Early Research Access</strong>
                  <p className="text-xs text-[#62676D] font-light mt-0.5">Direct access to unpublished research whitepapers, kinematics simulation models, and telemetry logs.</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5 text-[15px] sm:text-[16px] text-[#292D31]">
                <div className="w-5 h-5 rounded-full bg-[#2457D6]/10 text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-medium text-[#191B1D]">Quarterly Engineering Briefings</strong>
                  <p className="text-xs text-[#62676D] font-light mt-0.5">Private quarterly written briefings and engineering updates directly from founder Virat Anand.</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5 text-[15px] sm:text-[16px] text-[#292D31]">
                <div className="w-5 h-5 rounded-full bg-[#2457D6]/10 text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-medium text-[#191B1D]">Priority Allocations &amp; Future Surprises</strong>
                  <p className="text-xs text-[#62676D] font-light mt-0.5">Priority allocations for upcoming experimental hardware runs and member invitations.</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5 text-[15px] sm:text-[16px] text-[#292D31]">
                <div className="w-5 h-5 rounded-full bg-[#2457D6]/10 text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-medium text-[#191B1D]">One Free Business Website</strong>
                  <p className="text-xs text-[#62676D] font-light mt-0.5">
                    Designed and built by our commercial Digital Solutions Studio (valued at $1,500+). Domain &amp; hosting separate.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal / Non-Equity Disclosure */}
          <div className="p-4 rounded-xl bg-[#F5F2EA] border border-[#D9D6CF] text-xs text-[#62676D] flex items-start gap-3 mb-8">
            <AlertCircle className="w-4 h-4 text-[#2457D6] shrink-0 mt-0.5" />
            <span>
              <strong>Strict Non-Equity Disclosure:</strong> KITTY ONE is a patron membership supporting independent research. It confers no equity shares, voting rights, dividends, or financial profit participation.
            </span>
          </div>

          {/* Purchase Button */}
          <button
            className="w-full py-4 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] !text-white text-[15px] font-medium transition-all shadow-[0_4px_16px_rgba(36,87,214,0.25)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-wait"
            disabled={
              !catalog.purchasesEnabled ||
              busy ||
              !!pending ||
              (!!user && (!ready || (securityEnabled && !token)))
            }
            onClick={() => void pay(featuredPlan?.id || "kitty-plus")}
          >
            <span className="!text-white font-medium">
              {!catalog.purchasesEnabled
                ? "Private Enrollment (Inquire)"
                : busy
                ? "Processing verification…"
                : user && (!ready || (securityEnabled && !token))
                ? "Preparing secure checkout…"
                : user
                ? "Join KITTY ONE: $249 / Year"
                : "Sign in with Google to Join"}
            </span>
            <ArrowRight className="w-4 h-4 !text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </article>
      </div>

      {/* =========================================================================
          SEPARATE OFFERINGS: VOLUNTARY SUPPORT & DIGITAL STUDIO
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        
        {/* Support Callout */}
        <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-2">
              Voluntary Research Support
            </h3>
            <p className="text-sm text-[#62676D] font-light leading-relaxed mb-6">
              Prefer not to join an annual membership? You can support our open robotics and clean energy research with any voluntary contribution amount.
            </p>
          </div>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2457D6] hover:underline"
          >
            <span>Support Our Research</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Digital Studio Callout */}
        <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-2">
              Digital Solutions Studio
            </h3>
            <p className="text-sm text-[#62676D] font-light leading-relaxed mb-6">
              Need custom web software, business automation pipelines, or intelligent agent workflows built for your enterprise? Explore our commercial studio.
            </p>
          </div>
          <a
            href="https://demo.thekittycorp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2457D6] hover:underline"
          >
            <span>Explore Studio Demos</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {catalog.plans.some((p) => p.purchasable) && (
        <>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
            onReady={() => setReady(true)}
            onError={() => setError("Razorpay checkout could not load.")}
          />
          {securityEnabled && <Turnstile action="payment-order" onToken={setToken} resetKey={revision} />}
        </>
      )}

      {message && (
        <div className="p-4 rounded-xl border border-green-300 bg-green-50 text-sm text-green-900 max-w-2xl mx-auto mb-6" role="status">
          {message}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl border border-red-300 bg-red-50 text-sm text-red-900 max-w-2xl mx-auto mb-6" role="alert">
          {error}
        </div>
      )}
      {pending && (
        <div className="text-center mb-6">
          <button
            className="px-6 py-2.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-sm text-[#191B1D] hover:bg-[#E9E6E0] transition-colors"
            disabled={busy}
            onClick={() => void status()}
          >
            Check payment status
          </button>
        </div>
      )}
    </div>
  );
}
