import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import "./refined.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://kittycorp.vercel.app"),
  title: {
    default: "KITTY CORP — Technology we actually want to use.",
    template: "%s · Kitty Corp",
  },
  description:
    "KITTY CORP is an independent technology company building personal AI, autonomous systems and intelligent software. Small team. Real work in progress.",
  icons: { icon: "/brand/monogram.png", apple: "/brand/monogram.png" },
  openGraph: {
    title: "KITTY CORP — Technology we actually want to use.",
    description: "Personal AI, autonomous systems and intelligent software, built by a small team.",
    type: "website",
    siteName: "Kitty Corp",
  },
  twitter: {
    card: "summary",
    title: "Kitty Corp",
    description: "Still early. Still building.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head><link rel="preload" href="/fonts/geist-latin-v1.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
