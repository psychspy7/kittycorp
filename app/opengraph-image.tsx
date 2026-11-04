/* eslint-disable @next/next/no-img-element -- Satori ImageResponse requires inline data URIs */
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
        padding: "54px 70px",
        background: "#070911",
        color: "#f4f5ff",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Ambient background glow accents */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(105, 220, 242, 0.16) 0%, rgba(93, 72, 207, 0.08) 50%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-50px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(93, 72, 207, 0.18) 0%, rgba(105, 220, 242, 0.05) 50%, transparent 70%)",
        }}
      />

      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={logoData} alt="" width={62} height={62} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: 3, color: "#ffffff" }}>
              KITTY CORP
            </span>
            <span style={{ fontSize: 11, letterSpacing: 2, color: "#69dcf2", fontWeight: 600 }}>
              INDEPENDENT TECHNOLOGY COMPANY
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid rgba(105, 220, 242, 0.4)",
            borderRadius: 99,
            padding: "9px 18px",
            background: "rgba(105, 220, 242, 0.08)",
            color: "#69dcf2",
            fontSize: 12,
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#69dcf2" }} />
          <span>STUDIO &amp; LABS · INDIA</span>
        </div>
      </div>

      {/* Main Hero Typography */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 54,
          maxWidth: 1060,
          
        }}
      >
        <span
          style={{
            fontSize: 74,
            lineHeight: 1.05,
            letterSpacing: -2.5,
            fontWeight: 800,
            color: "#ffffff",
          }}
        >
          Built for business.
        </span>
        <span
          style={{
            marginTop: 8,
            fontSize: 66,
            lineHeight: 1.08,
            letterSpacing: -2,
            fontWeight: 600,
            color: "#69dcf2",
          }}
        >
          Curious about what’s next.
        </span>
        <span
          style={{
            marginTop: 24,
            fontSize: 23,
            lineHeight: 1.45,
            color: "#c4c9db",
            maxWidth: 920,
          }}
        >
          Websites, full-stack software and AI workflows for modern business, alongside forward research in robotics and intelligent systems.
        </span>
      </div>

      {/* Division Badges */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 38,
          
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(169, 158, 255, 0.28)",
            borderRadius: 12,
            padding: "12px 20px",
            background: "rgba(16, 22, 42, 0.8)",
          }}
        >
          <span style={{ fontSize: 11, color: "#a99eff", letterSpacing: 1.5, fontWeight: 700 }}>
            01 DIGITAL SOLUTIONS
          </span>
          <span style={{ fontSize: 14, color: "#f4f5ff", marginTop: 4 }}>
            Websites · Custom Software · AI Workflows
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(105, 220, 242, 0.28)",
            borderRadius: 12,
            padding: "12px 20px",
            background: "rgba(16, 22, 42, 0.8)",
          }}
        >
          <span style={{ fontSize: 11, color: "#69dcf2", letterSpacing: 1.5, fontWeight: 700 }}>
            02 INTELLIGENCE &amp; ROBOTICS
          </span>
          <span style={{ fontSize: 14, color: "#f4f5ff", marginTop: 4 }}>
            Autonomous Rovers · Companion AI · Solar Systems
          </span>
        </div>
      </div>

      {/* Footer Meta Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          borderTop: "1px solid rgba(169, 158, 255, 0.2)",
          paddingTop: 18,
          color: "#a5b0cb",
          fontSize: 14,
          letterSpacing: 1.5,
          fontWeight: 600,
          
        }}
      >
        <span>WEB · SOFTWARE · AI AGENTS · ROBOTICS</span>
        <span style={{ color: "#ffffff" }}>THEKITTYCORP.COM</span>
      </div>
    </div>,
    size,
  );
}
