import https from 'node:https';

async function fetchLive() {
  const res = await fetch('https://thekittycorp.com');
  const html = await res.text();
  console.log('Status:', res.status);
  console.log('Has hidden lg:flex:', html.includes('hidden lg:flex'));
  console.log('Has menu-toggle:', html.includes('menu-toggle'));
  console.log('Has kitty-mobile-menu:', html.includes('kitty-mobile-menu'));
  console.log('Has Open navigation:', html.includes('Open navigation'));
  const headerMatch = html.match(/<header[\s\S]*?<\/header>/);
  if (headerMatch) {
    console.log('=== HEADER HTML ===');
    console.log(headerMatch[0]);
  }
}

fetchLive().catch(console.error);
