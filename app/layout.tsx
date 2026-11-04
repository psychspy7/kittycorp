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

const shareTitle = "KITTY CORP | Independent Technology Company";
const shareDescription =
  "KITTY CORP builds websites, custom software and practical AI workflows for businesses, while exploring robotics and intelligent systems.";

export const metadata: Metadata = {
  metadataBase: new URL(websiteOrigin()),
  title: {
    default: "KITTY CORP — Digital solutions & intelligent systems.",
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
        url: "/opengraph-image?v=20261103",
        width: 1200,
        height: 630,
        alt: "KITTY CORP — Independent technology company building websites, software and AI workflows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: ["/opengraph-image?v=20261103"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const country = (await headers()).get("x-vercel-ip-country") || "";
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
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
          <Script
            id="thunderbolt-widget"
            src="https://widget.thunderbolt.com/embed.js"
            data-id="83f8e69b9311ce4f8e4396a115e7cd14f1820d6d9dc35387b2cdaee634445fde"
            strategy="lazyOnload"
          />
          <SiteToaster />
          <CookieConsent />
        </SiteThemeProvider>
      </body>
    </html>
  );
}
