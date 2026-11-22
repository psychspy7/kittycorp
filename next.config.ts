import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://challenges.cloudflare.com https://apis.google.com https://*.firebaseapp.com https://widget.thunderbolt.com https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://challenges.cloudflare.com https://*.firebaseapp.com https://accounts.google.com https://widget.thunderbolt.com",
  "connect-src 'self' https://challenges.cloudflare.com https://mgkghnblbisubympudaa.supabase.co wss://mgkghnblbisubympudaa.supabase.co https://lumberjack.razorpay.com https://api.razorpay.com https://open.er-api.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com https://www.google-analytics.com https://*.thunderbolt.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");


const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  } as unknown as NonNullable<NextConfig["experimental"]>,
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
      { source: "/studio", destination: "/services", permanent: true },
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
      {
        source: "/launches/exam-preparation",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/secretchat",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/secretchat/:path*",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/launches/kitty-ai",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/launches/kitty-ai/:path*",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/kitty-ai",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/kitty-ai/:path*",
        destination: "/projects",
        permanent: true,
      },
      { source: "/services", destination: "https://demo.thekittycorp.com", permanent: true },
      { source: "/services/:path*", destination: "https://demo.thekittycorp.com", permanent: true },
      { source: "/pricing", destination: "https://demo.thekittycorp.com", permanent: true },
      { source: "/pricing/:path*", destination: "https://demo.thekittycorp.com", permanent: true },
      { source: "/appointments", destination: "https://demo.thekittycorp.com", permanent: true },
      { source: "/appointments/:path*", destination: "https://demo.thekittycorp.com", permanent: true },
      { source: "/projects/quote", destination: "https://demo.thekittycorp.com", permanent: true },
      { source: "/projects/quote/:path*", destination: "https://demo.thekittycorp.com", permanent: true },
      { source: "/buddy", destination: "/projects", permanent: true },
      { source: "/buddy/:path*", destination: "/projects", permanent: true },
      { source: "/memberships", destination: "/support", permanent: true },
      { source: "/memberships/:path*", destination: "/support", permanent: true },
      { source: "/products", destination: "/projects", permanent: true },
      { source: "/products/:path*", destination: "/projects", permanent: true },
      { source: "/examify", destination: "/projects", permanent: true },
      { source: "/examify/:path*", destination: "/projects", permanent: true },
      { source: "/chat", destination: "/projects", permanent: true },
      { source: "/chat/:path*", destination: "/projects", permanent: true },
      { source: "/launches/examify", destination: "/projects", permanent: true },
      { source: "/launches/examify/:path*", destination: "/projects", permanent: true },
      { source: "/launches/secretchat", destination: "/projects", permanent: true },
      { source: "/launches/secretchat/:path*", destination: "/projects", permanent: true },
      {
        source: "/play",
        destination: "/",
        permanent: true,
      },
      {
        source: "/play/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/urjaan",
        destination: "/urjayaan",
        permanent: true,
      },
      {
        source: "/urjaan/:path*",
        destination: "/urjayaan",
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
      {
        source: "/((?!api|kitten|abcdefghijklmnopqrstuvwxyz|account|_next).*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/kitten/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/kitten",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/abcdefghijklmnopqrstuvwxyz/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/abcdefghijklmnopqrstuvwxyz",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/account/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/account",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/photography/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      { source: "/downloads/:file*.apk", headers: [
        { key: "Content-Type", value: "application/vnd.android.package-archive" },
        { key: "Content-Disposition", value: "attachment" },
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ] },
      { source: "/brand/:file*.webp", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/ecosystem/:file*.svg", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/fonts/:file*.woff2", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/fonts/:file*.otf", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
