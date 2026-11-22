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
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./final.css";
import "./warm-architecture.css";

const shareTitle = "KITTY CORP — Beyond Intelligence | For a Better & Safer Future";
const shareDescription =
  "KITTY CORP — Beyond Intelligence. Building for a better and safer future through robotics, AI, autonomous systems and digital solutions.";

export const metadata: Metadata = {
  metadataBase: new URL(websiteOrigin()),
  title: {
    default: "KITTY CORP — Beyond Intelligence | For a Better & Safer Future",
    template: "%s",
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
        url: "/opengraph-image?v=20261122-beyond-intelligence",
        width: 1200,
        height: 630,
        alt: "KITTY CORP — Beyond Intelligence | For a Better & Safer Future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: ["/opengraph-image?v=20261122-beyond-intelligence"],
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
        <Analytics />
      </body>
    </html>
  );
}
