async function checkRobots() {
  const routes = ['/', '/projects', '/research', '/company', '/memberships', '/contact', '/buddy', '/agriyaan', '/urjaan'];
  for (const route of routes) {
    try {
      const res = await fetch(`https://thekittycorp.com${route}`);
      const xRobots = res.headers.get('x-robots-tag');
      const html = await res.text();
      const metaMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*>/i);
      console.log(`${route.padEnd(15)} | Status: ${res.status} | X-Robots-Tag: ${xRobots || 'none'} | Meta: ${metaMatch ? metaMatch[0] : 'none'}`);
    } catch (e) {
      console.error(route, e.message);
    }
  }
}

checkRobots();
