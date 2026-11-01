# KITTY CORP design and interaction system

This is the working visual system for the public company site. Keep future changes inside these constraints so the site stays recognizable and readable.

## Typography

- **Geist** is the interface and body family. Use it for navigation, forms, body copy, labels and controls.
- **Runiga** is the display face for the homepage headline and selected editorial section headings. Do not use it for paragraphs, buttons, forms or small labels.
- Keep the active site to these two typefaces. The other supplied demo faces are not part of the public interface system.
- Use a fluid 1.25 modular scale from a 16px base: 16, 20, 25, 31, 39, 49, 61 and 76px. Fluid headings may interpolate between those steps with `clamp()`.
- Main home headline: `clamp(50px, 5.1vw, 72px)`. Section headings: `clamp(32px, 3.5vw, 46px)`. Body copy: `clamp(15px, 1.4vw, 18px)`.
- Prefer normal weight and modest negative tracking. Give labels a little tracking, not a novelty font.

## Color

| Role | Token | Value |
| --- | --- | --- |
| Main background | `--company-bg` | `#101213` |
| Quiet surface | `--company-panel` | `#171a1b` |
| Raised surface | `--company-panel-strong` | `#1e2223` |
| Main text | `--company-ink` | `#f2f1eb` |
| Secondary text | `--company-muted` | `#a8aaa7` |
| Structure | `--company-line` | `#ffffff22` |
| Warm metal accent | `--company-gold` | `#c8ad79` |

Keep the gold for small markers, active states and restrained emphasis. Avoid neon gradients and decorative glow.

## Spacing and layout

- Use a 1320px content width, centered inside the 1600px homepage canvas.
- Shared horizontal gutter: `clamp(22px, 6vw, 94px)`.
- Fluid space tokens: `--company-space-1` through `--company-space-5` in `app/company-home.css`. Use the same tokens for repeated section rhythm instead of introducing arbitrary values.
- Lay out divisions as editorial columns on wide screens and a single column below 850px. Keep forms and product details readable at 680px and below.
- Use 1px structural borders and generous empty space. Reserve filled panels for proof, forms and controls.

## Motion and accessibility

- Use `cubic-bezier(.22, 1, .36, 1)` for short interface transitions. Keep hover movement to a few pixels and never require motion to understand a control.
- Continuous logo marquees can use linear timing for a seamless loop; they must stop for reduced motion or keyboard focus.
- Keep `prefers-reduced-motion` support. Do not add cursor-following effects or scroll-trigger animations to every text block.

## Backend and page data

- The Studio login request retains its existing same-origin and rate-limit checks, Google PKCE exchange, approved-email and owner-UUID allowlist, and signed session cookie.
- The login JSON still uses the existing `turnstileToken` field. It is optional only when `TURNSTILE_ENABLED` is not `true`; when enabled, the server verifies it and fails closed. No credential or customer payload was added to the browser.
- The homepage reads only the public company/product, launch, journal and founder fields already used by the site. Suvid AI records are hidden from public output without deleting database records.
- Preserve the existing cache policies, explicit query projections, server-side validation and payment controls. Do not add a new client data-fetching layer unless a measured need justifies it.

## Review checklist

- Keep copy factual: distinguish delivered digital work from robotics concepts under exploration.
- Keep only one primary home for each repeated product or idea.
- Check keyboard focus, mobile line breaks, reduced motion and public links before release.
- Keep the canonical domain `https://thekittycorp.com`; legacy `kittycorp.vercel.app` URLs should redirect while retaining paths and query parameters.
