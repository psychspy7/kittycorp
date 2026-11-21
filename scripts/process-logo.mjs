import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const darkPath = "C:/Users/HP/.gemini/antigravity/brain/90a8abe9-a481-4fd5-b2c9-dcbe70585572/.user_uploaded/media_1795253724894_364b8702.jpg";
const lightPath = "C:/Users/HP/.gemini/antigravity/brain/90a8abe9-a481-4fd5-b2c9-dcbe70585572/.user_uploaded/media_1795253857214_0d182106.jpg";

async function run() {
  const { data: darkRaw, info } = await sharp(darkPath).raw().toBuffer({ resolveWithObject: true });
  const { data: lightRaw } = await sharp(lightPath).raw().toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const totalPixels = width * height;

  // Background colors:
  // Dark corner ~ (18, 19, 21)
  const bDark = [darkRaw[0], darkRaw[1], darkRaw[2]];
  // Light corner ~ (255, 255, 255)
  const bLight = [lightRaw[0], lightRaw[1], lightRaw[2]];

  console.log("Background dark:", bDark, "Light:", bLight);

  const rgbaBuffer = Buffer.alloc(totalPixels * 4);

  let solidCount = 0;
  let transparentCount = 0;
  let semiCount = 0;

  for (let i = 0; i < totalPixels; i++) {
    const srcIdx = i * 3;
    const dstIdx = i * 4;

    const dr = darkRaw[srcIdx];
    const dg = darkRaw[srcIdx + 1];
    const db = darkRaw[srcIdx + 2];

    const lr = lightRaw[srcIdx];
    const lg = lightRaw[srcIdx + 1];
    const lb = lightRaw[srcIdx + 2];

    // Difference in each channel relative to background difference
    const diffR = (lr - dr) / (bLight[0] - bDark[0]);
    const diffG = (lg - dg) / (bLight[1] - bDark[1]);
    const diffB = (lb - db) / (bLight[2] - bDark[2]);

    // Average difference factor (1.0 = pure background, 0.0 = pure foreground)
    const bgFactor = Math.max(0, Math.min(1, (diffR + diffG + diffB) / 3));
    let alpha = 1.0 - bgFactor;

    // Clean up micro noise in deep background
    if (alpha < 0.01) {
      alpha = 0;
      transparentCount++;
    } else if (alpha > 0.99) {
      alpha = 1.0;
      solidCount++;
    } else {
      semiCount++;
    }

    let fr, fg, fb;
    if (alpha <= 0) {
      fr = 0;
      fg = 0;
      fb = 0;
    } else if (alpha >= 1.0) {
      fr = dr;
      fg = dg;
      fb = db;
    } else {
      // Reconstruct foreground
      fr = Math.round(Math.max(0, Math.min(255, (dr - (1 - alpha) * bDark[0]) / alpha)));
      fg = Math.round(Math.max(0, Math.min(255, (dg - (1 - alpha) * bDark[1]) / alpha)));
      fb = Math.round(Math.max(0, Math.min(255, (db - (1 - alpha) * bDark[2]) / alpha)));
    }

    rgbaBuffer[dstIdx] = fr;
    rgbaBuffer[dstIdx + 1] = fg;
    rgbaBuffer[dstIdx + 2] = fb;
    rgbaBuffer[dstIdx + 3] = Math.round(alpha * 255);
  }

  console.log(`Pixels: solid=${solidCount}, transparent=${transparentCount}, semi=${semiCount}`);

  // Now create the transparent master
  const transparentMaster = sharp(rgbaBuffer, {
    raw: { width, height, channels: 4 }
  });

  const brandDir = "public/brand";
  if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

  // 1. Transparent PNG & WebP (Full 1024x1024)
  await transparentMaster.clone().png({ quality: 100, compressionLevel: 9 }).toFile(path.join(brandDir, "kitty-corp-logo-transparent.png"));
  await transparentMaster.clone().webp({ quality: 95, lossless: true }).toFile(path.join(brandDir, "kitty-corp-logo-transparent.webp"));

  // 2. Dark version (with exact dark background)
  await sharp(darkPath).png({ quality: 100 }).toFile(path.join(brandDir, "kitty-corp-logo-dark.png"));
  await sharp(darkPath).webp({ quality: 95 }).toFile(path.join(brandDir, "kitty-corp-logo-dark.webp"));

  // 3. Light version (with clean white background)
  await sharp(lightPath).png({ quality: 100 }).toFile(path.join(brandDir, "kitty-corp-logo-light.png"));
  await sharp(lightPath).webp({ quality: 95 }).toFile(path.join(brandDir, "kitty-corp-logo-light.webp"));

  // 4. Update the standard existing brand assets so existing references use the new logo:
  // monogram-v1.webp (512x512)
  await transparentMaster.clone().resize(512, 512).webp({ quality: 95 }).toFile(path.join(brandDir, "monogram-v1.webp"));
  // monogram-small-v1.webp (128x128)
  await transparentMaster.clone().resize(128, 128).webp({ quality: 95 }).toFile(path.join(brandDir, "monogram-small-v1.webp"));
  // monogram.png (512x512 transparent PNG)
  await transparentMaster.clone().resize(512, 512).png().toFile(path.join(brandDir, "monogram.png"));
  // silver-mark-v1.webp (512x512)
  await transparentMaster.clone().resize(512, 512).webp({ quality: 95 }).toFile(path.join(brandDir, "silver-mark-v1.webp"));
  // monogram-og-v1.png (1200x630 OpenGraph with luxury dark background)
  const logoForOg = await transparentMaster.clone().resize(320, 320).png().toBuffer();
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 18, g: 19, b: 21 }
    }
  })
    .composite([
      { input: logoForOg, top: 155, left: 440 }
    ])
    .png()
    .toFile(path.join(brandDir, "monogram-og-v1.png"));

  // 5. Favicons and app icons
  const fav32 = await transparentMaster.clone().resize(32, 32).png().toBuffer();
  fs.writeFileSync("public/favicon.ico", fav32);
  if (fs.existsSync("app/favicon.ico")) {
    fs.writeFileSync("app/favicon.ico", fav32);
  }
  await transparentMaster.clone().resize(512, 512).png().toFile("app/icon.png");
  await transparentMaster.clone().resize(180, 180).png().toFile("app/apple-icon.png");
  await transparentMaster.clone().resize(192, 192).png().toFile("public/icon-192.png");
  await transparentMaster.clone().resize(512, 512).png().toFile("public/icon-512.png");

  console.log("All logo assets created successfully!");
}

run().catch(console.error);
