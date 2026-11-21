async function check() {
  console.log("Polling live domain for new deployment...");
  for (let i = 1; i <= 20; i++) {
    try {
      const res = await fetch("https://thekittycorp.com/buddy");
      console.log(`[Attempt ${i}] https://thekittycorp.com/buddy -> ${res.status}`);
      if (res.status === 200) {
        const text = await res.text();
        if (text.includes("KITTY Buddy") && text.includes("Concept Exploration")) {
          console.log("SUCCESS! Commit 6b78316 is LIVE on https://thekittycorp.com!");
          
          // Verify home page changes:
          const homeRes = await fetch("https://thekittycorp.com/");
          const homeHtml = await homeRes.text();
          console.log("Homepage status:", homeRes.status);
          console.log("Has no em-dashes:", !/[\u2014\u2013]/.test(homeHtml));
          console.log("Has no numbered prefixes:", !/0[1-9]\s*·\s*[A-Z]/.test(homeHtml));
          console.log("Has Buddy in footer/initiatives:", homeHtml.includes("/buddy"));
          console.log("Has dark Earth footer:", homeHtml.includes("dark-earth-footer.webp"));
          return true;
        }
      }
    } catch (e) {
      console.log(`Attempt ${i} network error:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 8000));
  }
  console.log("Timed out waiting for live deployment.");
  return false;
}

check();
