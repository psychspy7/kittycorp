import {headers} from "next/headers";
import {LocalCurrencyProvider} from "@/components/kitty/local-currency";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/kitty/google-analytics";
import { googleAnalyticsId } from "@/lib/analytics-config";
import { LogoMotionProvider } from "@/components/kitty/logo-motion";
import { MaintenanceWatcher } from "@/components/kitty/maintenance-watcher";
import { AssistantLauncher } from "@/components/kitty/assistant-launcher";
import { publicAssistantPresentation } from "@/lib/assistant-presentation";
import { websiteOrigin } from "@/lib/site-metadata";
import "./globals.css";
import "./refined.css";
import "./final.css";
import "./credibility.css";
import "./ecosystem.css";
import "./business.css";
import "./professional.css";
import "./final-refinement.css";
import "./commercial-update.css";
import "./conversion.css";
import "./product-research.css";
import "./venture-showcase.css";
import "./company-home.css";
import "@/components/kitty/website-assistant.css";
export const metadata: Metadata = {
  metadataBase: new URL(websiteOrigin()),
  title: {
    default: "KITTY CORP — Digital solutions & intelligent systems.",
    template: "%s · Kitty Corp",
  },
  description:
    "KITTY CORP builds websites, software and AI workflows for businesses, and explores robotics and intelligent systems.",
  icons: { icon: "/brand/monogram.png", apple: "/brand/monogram.png" },
  openGraph: {
    title: "KITTY CORP — Digital solutions & intelligent systems.",
    description: "Websites, software and AI workflows for business. Early research in robotics and intelligent systems.",
    type: "website",
    siteName: "Kitty Corp",
    images: [{url: "/opengraph-image",width:1200,height:630,alt:"KITTY CORP"}],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "KITTY CORP",
    description: "Digital solutions for business. Intelligent systems and robotics in development.",
  },
};
async function PublicAssistant() {
  const presentation = await publicAssistantPresentation().catch(() => null);
  if (!presentation) return null;
  return <AssistantLauncher settings={presentation.settings} siteKey={presentation.siteKey} />;
}
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const country=(await headers()).get("x-vercel-ip-country")||"";
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3607548169127113" />
        <link rel="preload" href="/fonts/geist-latin-v1.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/runiga-v1.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <LocalCurrencyProvider country={country}><LogoMotionProvider>{children}<Suspense fallback={null}><PublicAssistant /></Suspense></LogoMotionProvider></LocalCurrencyProvider>
        <Suspense fallback={null}><MaintenanceWatcher /></Suspense>
        <Suspense fallback={null}><GoogleAnalytics measurementId={googleAnalyticsId()} /></Suspense>
        <Toaster theme="light" position="bottom-right" richColors />
      </body>
    </html>
  );
}
