"use client";
import { LocalPrice } from "./local-currency";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { Check, ArrowUpRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { kittyCustomerAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "@/lib/kitty-customer";
import type { MembershipCatalog } from "@/lib/membership-types";
import { Turnstile } from "./turnstile";

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
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch {
      setError("Google sign-in could not finish. Check that this website is authorized in Firebase and try again.");
    }
  }

  async function status() {
    if (!pending || pending.uid !== current.current?.uid || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const generation = epoch.current;
    try {
      const r = await request<{ active: boolean; testMode?: boolean; status?: string }>("status", { intentId: pending.id });
      if (generation === epoch.current) {
        setMessage(
          r.active
            ? r.testMode
              ? "Test membership verified. This does not unlock production access."
              : "Membership active. Verified patron credentials connected to your Google account."
            : r.status === "authorized"
            ? "Payment authorized; capture is pending. Please do not pay again."
            : "No captured payment is confirmed yet. You can check again."
        );
        if (r.active) setPending(null);
      }
    } catch (e) {
      if (generation === epoch.current) setError((e as Error).message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  async function pay(planId: string) {
    if (lock.current || pending) return;
    if (!user) {
      await login();
      return;
    }
    if (!window.Razorpay || !ready) {
      setError("Checkout is still loading.");
      return;
    }
    if (securityEnabled && !token) {
      setError("Complete the security check first.");
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
        description: (order.testMode ? "TEST · " : "") + "1-Year Verified Patron Membership",
        image: window.location.origin + "/brand/monogram-small-v1.webp",
        theme: { color: "#070911" },
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
                    ? "Test membership verified. No production access or real charge."
                    : "Verified Patron Membership is active. Your credential is tied to this Google account."
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
              setMessage("Checkout closed. No membership was activated. Check status if you attempted a payment.");
              void request("cancel", { intentId: order.intentId }).catch(() => {});
            }
          },
        },
      });
      checkout.on("payment.failed", () => {
        if (generation === epoch.current) setError("Payment failed. Retry in Razorpay or close checkout.");
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

  // Find featured 1-year patron plan or fallback to default
  const featuredPlan = catalog.plans.find((p) => p.product === "kitty") || catalog.plans[0];

  return (
    <>
      <section className="membership-account" aria-label="Membership account">
        <div>
          <ShieldCheck size={19} className="text-[#38bdf8]" />
          <span>{user ? "Patron Account: " + (user.email || "Signed-in account") : "Connect your Google account to manage verified credentials."}</span>
        </div>
        {user ? (
          <button disabled={busy} onClick={() => void kittyCustomerAuth().then(signOut)}>
            Switch account
          </button>
        ) : (
          <button onClick={() => void login()}>Sign in with Google</button>
        )}
      </section>

      {account && (
        <p className="membership-current" role="status">
          {account.paid
            ? `Verified Patron Membership active until ${new Date(account.expiresAt).toLocaleDateString()}. Membership extends your research briefings access.`
            : "Your account is connected. No active verified membership is on file."}
        </p>
      )}

      {!catalog.purchasesEnabled && (
        <p className="membership-paused" role="status">
          Public patron intake is currently invitation-only while research batches are processed. You may submit an inquiry for private enrollment.
        </p>
      )}

      {catalog.testMode && catalog.purchasesEnabled && (
        <p className="membership-paused">TEST MODE · No real currency is charged. Test verification is isolated from production records.</p>
      )}

      <div className="membership-grid">
        {/* 1. Primary Architecture: 1-Year Verified Metallic Membership */}
        <article className="membership-card is-featured">
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
            <Sparkles size={14} className="text-[#38bdf8]" />
            <span>VERIFIED PATRON CREDENTIALS</span>
          </div>
          <span className="eyebrow">KITTY CORP · PHYSICAL AI &amp; ROBOTICS</span>
          <h2>1-Year Verified Membership</h2>
          
          <div className="membership-price">
            {featuredPlan && featuredPlan.amount !== null
              ? "₹" + (featuredPlan.amount / 100).toLocaleString("en-IN")
              : "₹9,900"}
            <small> / year · verified patron</small>
          </div>
          {featuredPlan && featuredPlan.amount !== null && <LocalPrice amount={featuredPlan.amount} />}

          {/* 3D Metallic Card Preview on Architectural Pedestal */}
          <div className="my-2 relative flex items-center justify-center p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
            <div className="w-full h-36 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-4 border border-zinc-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-white font-mono text-[10px] font-bold tracking-[0.2em]">KITTY CORP</span>
                <span className="text-[9px] font-mono text-[#38bdf8] border border-[#38bdf8]/40 px-1.5 py-0.5 rounded">NFC</span>
              </div>
              <div className="text-center my-auto">
                <div className="text-[11px] tracking-[0.25em] font-bold text-zinc-200 uppercase">MEMBERSHIP</div>
                <div className="text-[9px] text-[#38bdf8] font-mono tracking-wider mt-0.5">RESEARCH PATRON</div>
              </div>
              <div className="flex justify-between items-end text-[8px] font-mono text-zinc-500 border-t border-zinc-800 pt-2">
                <span>VERIFIED 1-YEAR</span>
                <span>2026—2027</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            Full annual patron credentials supporting physical-world AI and autonomous robotics engineering.
          </p>

          <ul>
            <li>
              <Check size={16} />
              <span><strong>Laser-Etched Metallic NFC Card</strong> (Delivered to verified patrons)</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Cryptographic Digital Credential</strong> (Tied to your patron account)</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Private Quarterly Engineering Briefings</strong> &amp; telemetry logs</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Early Whitepaper Access</strong> (01 AgriYaan &amp; 02 Green Energy)</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Direct Updates from Virat Anand</strong> (Founder &amp; Chief Technologist)</span>
            </li>
          </ul>

          <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
            <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <span>Strict Non-Equity Disclosure: Voluntary research support. Confers no equity, voting shares, dividends, or financial profit participation.</span>
          </div>

          <button
            className="button button-gold"
            disabled={
              !catalog.purchasesEnabled ||
              busy ||
              !!pending ||
              (!!user && (!ready || (securityEnabled && !token)))
            }
            onClick={() => void pay(featuredPlan?.id || "kitty-plus")}
          >
            {!catalog.purchasesEnabled
              ? "Private Enrollment (Inquire)"
              : busy
              ? "Processing verification…"
              : user && (!ready || (securityEnabled && !token))
              ? "Preparing secure checkout…"
              : user
              ? "Join 1-Year Verified Membership"
              : "Sign in to Join Membership"}
          </button>
        </article>

        {/* 2. Voluntary Research Support Card */}
        <article className="membership-card">
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
            <ShieldCheck size={14} className="text-[#38bdf8]" />
            <span>OPEN LAB PATRONAGE</span>
          </div>
          <span className="eyebrow">OPEN INNOVATION · LAB CONTRIBUTION</span>
          <h2>Research Supporter</h2>
          
          <div className="membership-price">
            Voluntary<small> · custom amount</small>
          </div>

          <p className="text-xs text-zinc-400">
            Directly accelerate open robotics research, agricultural rover chassis manufacturing, and clean energy control benchmarks.
          </p>

          <ul>
            <li>
              <Check size={16} />
              <span><strong>Open Robotics Support</strong> (Chassis fabrication &amp; sensor acquisition)</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Public Research Whitepaper Acknowledgments</strong> (Optional named attribution)</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Direct Research Digest</strong> sent biannually to contributors</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Zero Corporate Overhead</strong> — 100% applied directly to lab R&amp;D</span>
            </li>
          </ul>

          <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
            <AlertCircle size={15} className="text-zinc-500 shrink-0 mt-0.5" />
            <span>Contributions are voluntary scientific donations and do not constitute commercial product purchases.</span>
          </div>

          <a className="button button-outline" href="/payments?purpose=donation">
            Contribute to Research <ArrowUpRight size={16} />
          </a>
        </article>

        {/* 3. Commercial Digital Studio Gateway */}
        <article className="membership-card">
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
            <ArrowUpRight size={14} className="text-[#38bdf8]" />
            <span>COMMERCIAL STUDIO</span>
          </div>
          <span className="eyebrow">DIGITAL SOLUTIONS · SEPARATE STUDIO</span>
          <h2>Digital Solutions Studio</h2>
          
          <div className="membership-price">
            Commercial<small> · INR-first pricing</small>
          </div>

          <p className="text-xs text-zinc-400">
            For businesses seeking tailored web design, business automation pipelines, and custom AI integration solutions.
          </p>

          <ul>
            <li>
              <Check size={16} />
              <span><strong>Premium Websites</strong> (Tailored high-performance digital presence)</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Business Automation</strong> (Custom workflow &amp; CRM pipelines)</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>AI Solutions</strong> (Fine-tuned models &amp; intelligent assistants)</span>
            </li>
            <li>
              <Check size={16} />
              <span><strong>Fixed Scope &amp; Milestones</strong> with dedicated engineer support</span>
            </li>
          </ul>

          <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
            <AlertCircle size={15} className="text-zinc-500 shrink-0 mt-0.5" />
            <span>Note on Inclusions &amp; Exclusions: Membership inclusions cover 1 business website build, digital solution access, updates, and event eligibility. Legal exclusions apply to third-party compute, domain registrations, and advertising spend.</span>
          </div>

          <a
            className="button button-outline"
            href="https://demo.thekittycorp.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore Digital Studio <ArrowUpRight size={16} />
          </a>
        </article>
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
        <p className="membership-result" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="membership-error" role="alert">
          {error}
        </p>
      )}
      {pending && (
        <button className="button button-outline" disabled={busy} onClick={() => void status()}>
          Check payment status
        </button>
      )}
    </>
  );
}
