import {headers} from "next/headers";
import {LocalCurrencyProvider} from "@/components/kitty/local-currency";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/kitty/google-analytics";
import { googleAnalyticsId } from "@/lib/analytics-config";
import { LogoMotionProvider } from "@/components/kitty/logo-motion";
import { MaintenanceWatcher } from "@/components/kitty/maintenance-watcher";
import { websiteOrigin } from "@/lib/site-metadata";
import { SiteThemeProvider } from "@/components/kitty/theme-provider";
import { SiteToaster } from "@/components/kitty/site-toaster";
import { CookieConsent } from "@/components/kitty/cookie-consent";
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
import "./system-theme.css";
import "../src/shaders/threeui.css";
import "./ui-refresh.css";
import "./gemini-home.css";
import "./obsidian-home.css";
import "./warm-architecture.css";

const shareTitle = "KITTY CORP | Physical-World Intelligence";
const shareDescription =
  "KITTY CORP develops Physical-World Intelligence through AI robotics, agricultural systems, solar energy intelligence and a Digital Solutions Studio.";

export const metadata: Metadata = {
  metadataBase: new URL(websiteOrigin()),
  title: {
    default: "KITTY CORP • Physical-World Intelligence & AI Robotics",
    template: "%s · Kitty Corp",
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
        url: "/opengraph-image?v=20261121-seo",
        width: 1200,
        height: 630,
        alt: "KITTY CORP — Physical-World Intelligence, AI Robotics and Digital Solutions Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: ["/opengraph-image?v=20261121-seo"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const country = (await headers()).get("x-vercel-ip-country") || "";
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
          href="/fonts/runiga-v1.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body>
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
