import {LocalCurrencyProvider} from "@/components/kitty/local-currency";
import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/kitty/google-analytics";
import { googleAnalyticsId } from "@/lib/analytics-config";
import { LogoMotionProvider } from "@/components/kitty/logo-motion";
import { MaintenanceWatcher } from "@/components/kitty/maintenance-watcher";
import { websiteOrigin } from "@/lib/site-metadata";
import { SiteThemeProvider } from "@/components/kitty/theme-provider";
import { SiteToaster } from "@/components/kitty/site-toaster";
import { RouteProgress } from "@/components/kitty/route-progress";
import "./globals.css";
import "./final.css";
import "./warm-architecture.css";

const shareTitle = "KITTY CORP | For a Better Future | Building with Purpose";
const shareDescription =
  "Building with purpose | Thinking beyond today. Building a safer, brighter future.";

export const metadata: Metadata = {
  metadataBase: new URL(websiteOrigin()),
  title: {
    default: "KITTY CORP | For a Better Future | Building with Purpose",
    template: "%s | KITTY CORP",
  },
  description: shareDescription,
  applicationName: "KITTY CORP",
  icons: { icon: "/brand/monogram.png", apple: "/brand/monogram.png" },
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: websiteOrigin(),
    type: "website",
    siteName: "KITTY CORP",
    locale: "en_US",
    images: [
      {
        url: "https://thekittycorp.com/brand/opengraph-preview.jpg?v=20261123-future",
        secureUrl: "https://thekittycorp.com/brand/opengraph-preview.jpg?v=20261123-future",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "THE KITTY CORP | For a Better Future | Building with purpose, thinking beyond today.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KittyCorphq",
    creator: "@KittyCorphq",
    title: shareTitle,
    description: shareDescription,
    images: ["https://thekittycorp.com/brand/opengraph-preview.jpg?v=20261123-future"],
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "28.6139;77.2090",
    ICBM: "28.6139, 77.2090",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const country = "";
  return (
    <html lang="en" data-theme="warm" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-3607548169127113" />
        <link
          rel="preload"
          href="/fonts/geist-latin-v1.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/runiga-v1.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <RouteProgress />
        <SiteThemeProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <LocalCurrencyProvider country={country}>
            <LogoMotionProvider>{children}</LogoMotionProvider>
          </LocalCurrencyProvider>
          <Suspense fallback={null}>
            <MaintenanceWatcher />
          </Suspense>
          <Suspense fallback={null}>
            <GoogleAnalytics measurementId={googleAnalyticsId()} />
          </Suspense>
          <SiteToaster />
        </SiteThemeProvider>
      </body>
    </html>
  );
}
