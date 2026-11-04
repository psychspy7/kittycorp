import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://challenges.cloudflare.com https://apis.google.com https://*.firebaseapp.com https://widget.thunderbolt.com https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://challenges.cloudflare.com https://*.firebaseapp.com https://accounts.google.com https://widget.thunderbolt.com",
  "connect-src 'self' https://mgkghnblbisubympudaa.supabase.co wss://mgkghnblbisubympudaa.supabase.co https://lumberjack.razorpay.com https://api.razorpay.com https://open.er-api.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com https://www.google-analytics.com https://*.thunderbolt.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");


const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.html": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kittycorp.vercel.app" }],
        destination: "https://thekittycorp.com/:path*",
        permanent: true,
      },
      {
        source: "/research/suvid-ai/:path*",
        destination: "/research",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspDirectives },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self 'https://checkout.razorpay.com')",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
      { source: "/downloads/:file*.apk", headers: [
        { key: "Content-Type", value: "application/vnd.android.package-archive" },
        { key: "Content-Disposition", value: "attachment" },
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ] },
      { source: "/brand/:file*.webp", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/secretchat/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/ecosystem/:file*.svg", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/lisa/:file*.webp", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/fonts/:file*.woff2", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/fonts/:file*.otf", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
