/* eslint-disable @next/next/no-img-element -- Satori's ImageResponse needs an inline data URI; next/image is unavailable in this renderer. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "KITTY CORP — Independent technology company building websites, software and AI workflows";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/brand/monogram-og-v1.png"));
  const logoData = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "58px 72px",
        background: "#f7f6f0",
        color: "#20251f",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={logoData} alt="" width={58} height={58} />
          <span style={{ fontSize: 27, fontWeight: 700, letterSpacing: 2.5 }}>
            KITTY CORP
          </span>
        </div>
        <div
          style={{
            display: "flex",
            border: "1px solid #c9c7b9",
            borderRadius: 99,
            padding: "11px 18px",
            color: "#626b5d",
            fontSize: 14,
            letterSpacing: 1.5,
          }}
        >
          INDEPENDENT TECHNOLOGY COMPANY
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 76,
          maxWidth: 1000,
        }}
      >
        <span
          style={{
            fontSize: 76,
            lineHeight: 1.08,
            letterSpacing: -3,
            fontWeight: 700,
          }}
        >
          Built for business.
        </span>
        <span
          style={{
            marginTop: 8,
            fontSize: 67,
            lineHeight: 1.1,
            letterSpacing: -2.5,
            fontWeight: 500,
            color: "#7b6848",
          }}
        >
          Curious about what’s next.
        </span>
        <span
          style={{
            marginTop: 27,
            fontSize: 23,
            lineHeight: 1.45,
            color: "#5c6259",
            maxWidth: 850,
          }}
        >
          Websites, custom software and practical AI workflows, with research
          into robotics and intelligent systems.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          borderTop: "1px solid #d4d1c5",
          paddingTop: 22,
          color: "#626b5d",
          fontSize: 17,
          letterSpacing: 1,
        }}
      >
        <span>WEB · SOFTWARE · AI · ROBOTICS</span>
        <span>THEKITTYCORP.COM</span>
      </div>
    </div>,
    size,
  );
}
