import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/kitty/google-analytics";
import { googleAnalyticsId } from "@/lib/analytics-config";
import { MaintenanceWatcher } from "@/components/kitty/maintenance-watcher";
import { LogoMotionProvider } from "@/components/kitty/logo-motion";
import "./globals.css";
import "./refined.css";
import "./final.css";
import "./credibility.css";
import "./ecosystem.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://kittycorp.vercel.app"),
  title: {
    default: "KITTY CORP — Software & independent technology.",
    template: "%s · Kitty Corp",
  },
  description:
    "Need a business website, web application or Android app? Work directly with KITTY CORP. Explore our live websites and released products, then tell us what you want to build.",
  icons: { icon: "/brand/monogram.png", apple: "/brand/monogram.png" },
  openGraph: {
    title: "KITTY CORP — Software & independent technology.",
    description: "Business websites, web applications and Android apps. See our shipped work and discuss your project with the team building it.",
    type: "website",
    siteName: "Kitty Corp",
  },
  twitter: {
    card: "summary",
    title: "Kitty Corp",
    description: "Websites, applications and independent technology.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head><link rel="preload" href="/fonts/geist-latin-v1.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /><link rel="preload" href="/fonts/dirtyline-36d-v1.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <LogoMotionProvider>{children}</LogoMotionProvider>
        <Suspense fallback={null}><MaintenanceWatcher /></Suspense>
        <Suspense fallback={null}><GoogleAnalytics measurementId={googleAnalyticsId()} /></Suspense>
        <Toaster theme="light" position="bottom-right" richColors />
      </body>
    </html>
  );
}
