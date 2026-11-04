# Enterprise Startup Polish & Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

This execution plan addresses all requirements requested to elevate KITTY CORP (https://thekittycorp.com) into a world-class, professional technology startup presence.

---

### Task 1: Fix Button Consistency ("Start a project" border radius)
- **Problem:** In `app/company-home.css`, `.company-theme .company-button` has `border-radius: 999px` (full pill), while 10+ other buttons across the site have standardized `6px` / `8px` rounded corners.
- **Solution:** Change `border-radius: 999px;` in `app/company-home.css` (line 277) to `border-radius: 6px;` to match `.button-gold`, `.button-outline`, and the rest of the design system.

### Task 2: Fix Internal Links Opening in New Tabs
- **Problem:** Several internal links (such as feedback and membership links in `website-assistant.tsx` and toast fallback in `launch-announcement.tsx`) use `target="_blank"`.
- **Solution:** 
  - In `components/kitty/website-assistant.tsx`, remove `target="_blank"` and `rel="noopener noreferrer"` from internal links to `/contact` and `/memberships`.
  - In `components/kitty/launch-announcement.tsx`, only apply `target="_blank"` if the target URL is external (`http://` or `https://`), keeping internal routes (`/launches/...`) in the same tab.

### Task 3: Redesign Social Preview Card (OpenGraph Image)
- **Problem:** `app/opengraph-image.tsx` currently renders an outdated cream/light background (`#f7f6f0`) with old styling, so link previews on WhatsApp, Twitter/X, LinkedIn, Discord, and iMessage look outdated and low contrast.
- **Solution:**
  - Redesign `app/opengraph-image.tsx` with an ultra-premium Obsidian dark aesthetic (`#070911`), glowing violet/cyan ambient light, modern typography, division badges ("01 Digital Solutions · 02 Intelligence & Robotics"), and the official monogram.
  - Bump OpenGraph cache-buster version from `?v=20261103` to `?v=20261104-v2` in `lib/site-metadata.ts` and `app/layout.tsx`.

### Task 4: Add `llms.txt` and `llms-full.txt` for AI Indexing
- **Problem:** Modern AI search agents and tools (Perplexity, Claude, ChatGPT, Cursor) look for `/llms.txt` to understand the company's offerings, products, and documentation.
- **Solution:**
  - Create `public/llms.txt` following the official llmstxt.org specification, summarizing KITTY CORP, its divisions, shipped products (EXAMIFY, KITTY AI, SecretChat), and the KITTY One $199 USD subscription.
  - Create `public/llms-full.txt` providing comprehensive technical and product references.

### Task 5: Enhance Sitemap, Robots.txt & Metadata Indexing
- **Problem:** Verify all live public routes are present in `app/sitemap.ts` and properly handled in `app/robots.ts`.
- **Solution:**
  - Add `/memberships` and ensure all active public routes are present in `app/sitemap.ts`.
  - Ensure canonical host resolution `https://thekittycorp.com` is consistently used.

### Task 6: Add Live Active Visitor Counter Widget
- **Problem:** The user requested a live visitor counter at the bottom showing active visitors, defaulting to a natural 90–100 baseline with organic fluctuations and real visitor deltas.
- **Solution:**
  - Create `components/kitty/live-visitor-counter.tsx` with obsidian glass styling, pulsing emerald/cyan indicator dot, accessible status role, and smooth randomized jitter (90–100+).
  - Integrate it into `components/kitty/site-footer.tsx`.

### Task 7: Optimize Google Analytics & Cookie Integration
- **Problem:** Ensure Google Analytics (`G-9V2T4Z9RJP`) is optimized, recognizes `/memberships` as a tracked public route, respects cookie consent choices, and tracks conversions.
- **Solution:**
  - In `lib/site-analytics.ts`, add `/memberships` to `publicPages`.
  - Wire conversion events for KITTY One subscription clicks.
  - Ensure cookie consent selection in `components/kitty/cookie-consent.tsx` dynamically grants or updates Google consent mode.

### Task 8: SSL Certificate Verification & Guidance
- **Problem:** Clarify SSL certificate deployment for the custom domain and ensure code-level HTTPS enforcement.
- **Solution:**
  - Verify that Next.js headers enforce HSTS preloading, upgrade-insecure-requests, and explain to the user how Cloudflare/Vercel/Let's Encrypt managed SSL handles certificate rotation with zero cost and zero maintenance.

### Task 9: Verification & Testing
- Run `npm run lint`.
- Run `npm run check:website`.
- Run `npm run build:next`.
- Push to GitHub `origin/main` and mirror to `KITTY CORP A-G/Source`.
