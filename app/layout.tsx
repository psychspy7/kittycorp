import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/kitty/google-analytics";
import { googleAnalyticsId } from "@/lib/analytics-config";
import { LogoMotionProvider } from "@/components/kitty/logo-motion";
import { MaintenanceWatcher } from "@/components/kitty/maintenance-watcher";
import { AssistantLauncher } from "@/components/kitty/assistant-launcher";
import { publicAssistantPresentation } from "@/lib/assistant-presentation";
import "./globals.css";
import "./refined.css";
import "./final.css";
import "./credibility.css";
import "./ecosystem.css";
import "./business.css";
import "./professional.css";
import "@/components/kitty/website-assistant.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://kittycorp.vercel.app"),
  title: {
    default: "KITTY CORP — Software & independent technology.",
    template: "%s · Kitty Corp",
  },
  description:
    "KITTY CORP builds business websites, web applications and Android apps. Explore our products and work directly with the team building them.",
  icons: { icon: "/brand/monogram.png", apple: "/brand/monogram.png" },
  openGraph: {
    title: "KITTY CORP — Software & independent technology.",
    description: "Business websites, web applications and Android apps. See our shipped work and discuss your project with the team building it.",
    type: "website",
    siteName: "Kitty Corp",
    images: [{url: "/opengraph-image",width:1200,height:630,alt:"KITTY CORP"}],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "Kitty Corp",
    description: "Websites, applications and independent technology.",
  },
};
async function PublicAssistant() {
  const {settings,siteKey} = await publicAssistantPresentation();
  return <AssistantLauncher settings={settings} siteKey={siteKey}/>;
}
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3607548169127113" />
        <link rel="preload" href="/fonts/geist-latin-v1.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dirtyline-36d-v1.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <LogoMotionProvider>{children}<Suspense fallback={null}><PublicAssistant /></Suspense></LogoMotionProvider>
        <Suspense fallback={null}><MaintenanceWatcher /></Suspense>
        <Suspense fallback={null}><GoogleAnalytics measurementId={googleAnalyticsId()} /></Suspense>
        <Toaster theme="light" position="bottom-right" richColors />
      </body>
    </html>
  );
}
