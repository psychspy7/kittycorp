import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { SecretChatDownload, SecretChatMark, secretChatFeatures } from "@/components/kitty/secretchat";
import { secretChat } from "@/lib/secretchat";
import { publishedLaunch } from "@/lib/launches-server";
import { fileSize } from "@/lib/launches";
import { notFound } from "next/navigation";
import Link from "next/link";
import { mediaHref } from "@/lib/company-content";
export const dynamic = "force-dynamic";

const defaultMetadata: Metadata = {
  title: "SecretChat — Private conversations for Android",
  description: "Download SecretChat by Kitty Corp. Invitation-only rooms, encrypted messages, device-encrypted history, and an optional fingerprint lock. Android 7.0+.",
  alternates: { canonical: "/secretchat" },
  openGraph: { title: "SecretChat · Private by intention.", description: "Kitty Corp’s new Android app. Your people. Your private space.", url: "/secretchat", images: [{ url: "/secretchat/icon-v1.png", width: 192, height: 192, alt: "SecretChat" }] },
};
export async function generateMetadata(): Promise<Metadata> {
  const launch = await publishedLaunch("secretchat");
  if (!launch) return { title: "Launch unavailable", robots: { index: false } };
  return { ...defaultMetadata, title: `${launch.name} — ${launch.tagline}`, description: launch.description, openGraph: { title: launch.name, description: launch.description, url: "/secretchat", images: [{ url: launch.icon_path ? mediaHref(launch.icon_path) : "/secretchat/icon-v1.png", width: 512, height: 512, alt: `${launch.name} icon` }] } };
}

export default async function SecretChatPage() {
  const launch = await publishedLaunch("secretchat");
  if (!launch) notFound();
  return (
    <>
      <SiteHeader />
      <main id="main" className="secretchat-page">
        <section className="secretchat-product-hero" aria-labelledby="product-title">
          <Link className="text-link" href="/"><ArrowLeft size={16} /> Back to Kitty Corp</Link>
          <div className="secretchat-product-grid">
            <div>
              <span className="status-pill"><span /> NEW FROM KITTY CORP · ANDROID BETA</span>
              <h1 id="product-title">{launch.name}.<br /><em>{launch.tagline}</em></h1>
              <p className="secretchat-product-intro">{launch.description}</p>
              <SecretChatDownload launch={launch} />
              <p className="download-meta">v{launch.version} · {fileSize(launch.apk_bytes)} · {launch.android}</p>
              <a className="text-link" href="#install">How to install <ArrowUpRight size={16} /></a>
            </div>
            <div className="secretchat-product-art"><SecretChatMark size={192} iconPath={launch.icon_path} /><span>SECRETCHAT<span>BY KITTY CORP</span></span><div className="secretchat-art-ring" aria-hidden="true" /></div>
          </div>
        </section>

        <section className="section secretchat-features" aria-labelledby="features-title">
          <div className="section-kicker"><span>BUILT AROUND YOUR CONVERSATIONS</span><span className="kicker-line" /></div>
          <h2 id="features-title">Privacy in the <em>details.</em></h2>
          <div className="secretchat-feature-grid">{secretChatFeatures.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={26} strokeWidth={1.4} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section id="install" className="section secretchat-install" aria-labelledby="install-title">
          <div><span className="micro-label">FROM DOWNLOAD TO FIRST CONVERSATION</span><h2 id="install-title">A few taps.<br /><em>You’re in.</em></h2><p>{launch.android} required. This APK is installed directly, outside the Play Store.</p><SecretChatDownload launch={launch} /></div>
          <ol className="install-steps">
            <li><span>01</span><div><h3>Download the APK.</h3><p>Tap the download button on your Android phone. If you’re on a computer or iPhone, open this page on your Android phone.</p></div></li>
            <li><span>02</span><div><h3>Open it and confirm installation.</h3><p>Open the file from Downloads. If Android asks, allow installation from the browser or file manager you used, then tap Install. You can turn that permission off afterward. Keep Play Protect enabled.</p></div></li>
            <li><span>03</span><div><h3>Sign in. Invite your people.</h3><p>Open SecretChat, sign in with Google, then create a room or enter a private invitation code. Keep room invitations private.</p></div></li>
          </ol>
        </section>

        <section id="privacy" className="section secretchat-privacy" aria-labelledby="privacy-title">
          <span className="micro-label">KNOW WHAT YOU’RE SHARING</span>
          <h2 id="privacy-title">Privacy, <em>in plain language.</em></h2>
          <div className="secretchat-privacy-grid">
            <div><h3>Your messages</h3><p>The Android service relays encrypted messages live. A phone that is offline misses messages sent while disconnected. Up to 500 received messages per room are stored locally; signing in on a new phone does not restore them. Uninstalling or clearing app data removes local history. Normal updates preserve it.</p><h3>Your account</h3><p>Kitty Corp’s administrator can view account and room metadata, including the last IP address observed by the backend. Supabase handles authentication and encrypted delivery; Google handles Google sign-in and optional Firebase notifications. Notification alerts do not contain chat text.</p></div>
            <div><h3>Your choices</h3><p>The app includes no advertising or analytics SDKs, and message content is not collected for model training. Biometric lock and room alerts are optional. Screenshot protection has a verified administrator exception; it cannot stop another camera or protect a compromised device.</p><h3>The limits</h3><p>Anyone with a valid invitation can enter its room and access future messages while connected. No app can guarantee complete security or anonymity. SecretChat is a beta release and has not undergone an independent security audit.</p><a className="text-link" href="/contact?subject=SecretChat%20privacy">Privacy questions or account deletion <ArrowUpRight size={16} /></a></div>
          </div>
        </section>

        <section className="secretchat-release" aria-labelledby="release-title">
          <Download size={24} aria-hidden="true" /><div><h2 id="release-title">The official Android release.</h2><p>v{launch.version} · {fileSize(launch.apk_bytes)}</p>{launch.release_notes && <p className="release-notes">{launch.release_notes}</p>}<details><summary>Verify your download (SHA-256)</summary><code>{launch.apk_sha256}</code><p>Package: {secretChat.packageName}. Compare this checksum with your downloaded APK. A matching checksum confirms the file matches this release.</p></details></div><SecretChatDownload launch={launch} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
