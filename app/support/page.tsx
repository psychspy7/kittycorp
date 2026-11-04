import type { Metadata } from "next";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { BottomSupport } from "@/components/kitty/bottom-support";
import { pageMetadata } from "@/lib/site-metadata";
import { Heart } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Support KITTY CORP",
  "Support our independent research in robotics, agricultural rovers, and open digital experiments. Choose any contribution amount.",
  "/support"
);

export default function SupportPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="public-page wrap support-page">
        <div className="page-heading">
          <span className="eyebrow">
            <Heart size={14} className="text-cyan-400" />
            VOLUNTARY SUPPORT &amp; EXPERIMENTS
          </span>
          <h1>Help us keep building.</h1>
          <p>
            KITTY CORP operates independently. Your contributions directly fund hardware prototypes, agricultural field testing for AGRIYAAN, and experimental AI tools.
          </p>
        </div>

        <BottomSupport />
      </main>
      <SiteFooter />
    </>
  );
}
