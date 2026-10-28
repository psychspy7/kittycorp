import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kittycorp.vercel.app" }],
        destination: "https://thekittycorp.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
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
    ];
  },
};

export default nextConfig;
