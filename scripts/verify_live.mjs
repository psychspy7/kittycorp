async function verifyLive() {
  console.log("Checking live site at https://thekittycorp.com ...");
  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      const res = await fetch("https://thekittycorp.com/urjayaan");
      console.log(`[Attempt ${attempt}] GET /urjayaan -> ${res.status}`);
      if (res.status === 200) {
        const text = await res.text();
        if (text.includes("KITTY UrjaYaan")) {
          console.log("CONFIRMED! KITTY UrjaYaan is LIVE on the production domain!");
          
          const homeRes = await fetch("https://thekittycorp.com/");
          const homeText = await homeRes.text();
          console.log("Homepage status:", homeRes.status);
          console.log("Live has new monogram:", homeText.includes("monogram-small-v1.webp"));
          console.log("Live has FooterNewsletter / subscribe:", homeText.includes("Subscribe to Updates"));
          console.log("Live has LiveVisitorCounter:", homeText.includes("kc-live-telemetry") || homeText.includes("active now"));
          return true;
        }
      }
    } catch (e) {
      console.log(`Attempt ${attempt} network error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 6000));
  }
  console.log("Still building/deploying on Cloudflare. Cloudflare build typically takes 1-2 minutes.");
  return false;
}
verifyLive();
