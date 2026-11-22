/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "THE KITTY CORP | For a Better Future | Building with purpose, thinking beyond today.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const imageBuffer = await readFile(join(process.cwd(), "public/brand/opengraph-preview.png"));
  const base64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#000",
        margin: 0,
        padding: 0,
      }}
    >
      <img
        src={base64}
        alt="THE KITTY CORP | For a Better Future."
        width={1200}
        height={630}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>,
    size,
  );
}
