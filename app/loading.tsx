import Image from "next/image";
export default function Loading() {
  return <main className="route-loading" role="status" aria-live="polite">
    <Image unoptimized src="/brand/monogram-small-v2.webp" alt="" width={56} height={56} className="route-loading-logo" />
    <span className="route-loading-name">KITTY CORP</span>
    <span className="route-loading-caption">Loading page</span>
    <span className="route-loading-spinner" aria-hidden="true" />
  </main>;
}
