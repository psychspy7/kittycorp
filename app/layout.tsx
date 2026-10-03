import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://kittycorp.vercel.app"),
  title: {
    default: "Kitty Corp — Building what comes next.",
    template: "%s · Kitty Corp",
  },
  description:
    "One founder. Big ideas. Meet SecretChat for Android: private rooms and encrypted conversations. Discover Kitty Corp’s products, experiments, and what comes next.",
  icons: { icon: "/brand/monogram.png", apple: "/brand/monogram.png" },
  openGraph: {
    title: "Kitty Corp — Building what comes next.",
    description: "Solo founder. Big vision. Real work in progress.",
    type: "website",
    siteName: "Kitty Corp",
  },
  twitter: {
    card: "summary",
    title: "Kitty Corp",
    description: "Building what comes next.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
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
