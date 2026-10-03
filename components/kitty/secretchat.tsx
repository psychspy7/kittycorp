import { ArrowUpRight, Download, Fingerprint, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { downloadHref, fileSize, type Launch } from "@/lib/launches";
import Image from "next/image";

export function SecretChatMark({ size = 72 }: { size?: number }) {
  return <Image className="secretchat-icon" src="/secretchat/icon-v1.webp" alt="SecretChat app icon" width={size} height={size} unoptimized />;
}

export function SecretChatDownload({ launch, className = "" }: { launch: Launch; className?: string }) {
  return (
    <a className={`button button-gold ${className}`} href={downloadHref(launch)} download>
      Download Android APK <Download size={18} aria-hidden="true" />
    </a>
  );
}

export function SecretChatSection({ launch }: { launch: Launch }) {
  return (
    <section id="secretchat" className="section secretchat-section" aria-labelledby="secretchat-title">
      <div className="section-kicker"><span>JUST LAUNCHED / SECRETCHAT</span><span className="kicker-line" /></div>
      <div className="secretchat-panel">
        <div className="secretchat-copy">
          <span className="status-pill"><span /> AVAILABLE ON ANDROID · BETA</span>
          <h2 id="secretchat-title">Your people.<br /><em>Your private space.</em></h2>
          <p>{launch.description}</p>
          <div className="secretchat-actions"><SecretChatDownload launch={launch} /><a className="text-link" href="/secretchat">Explore SecretChat <ArrowUpRight size={17} /></a></div>
          <p className="download-meta">v{launch.version} · {fileSize(launch.apk_bytes)} · {launch.android}</p>
        </div>
        <div className="secretchat-preview">
          <div className="secretchat-orbit" aria-hidden="true" />
          <SecretChatMark size={140} />
          <span className="secretchat-wordmark">SecretChat<span>PRIVATE BY INTENTION.</span></span>
          <div className="secretchat-preview-facts"><span><LockKeyhole size={15} /> Encrypted conversations</span><span><KeyRound size={15} /> Invite-only rooms</span><span><Fingerprint size={15} /> Optional fingerprint lock</span></div>
          <a className="text-link" href="/secretchat#privacy">How your privacy works <ArrowUpRight size={15} /></a>
        </div>
      </div>
    </section>
  );
}

export const secretChatFeatures = [
  { icon: LockKeyhole, title: "Encrypted before it leaves.", text: "Messages use AES-256-GCM encryption on participants’ devices before transmission. Private room invitations unlock the conversation." },
  { icon: ShieldCheck, title: "History stays on your device.", text: "Received history is encrypted using Android Keystore. The mobile service keeps no cloud chat archive or administrator decryption key." },
  { icon: Fingerprint, title: "An extra layer at the door.", text: "Enable fingerprint or strong biometric unlock, with device PIN or password recovery. Screenshot protection is enabled for normal accounts." },
  { icon: KeyRound, title: "An invitation, not a feed.", text: "Create a private room for 1–24 hours and share its code with your people. Extensions need approval; administrator groups can stay open." },
];
