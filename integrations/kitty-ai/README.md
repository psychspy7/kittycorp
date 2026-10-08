# KITTY AI website gateway

`websiteChat.ts` is the separate, stateless website route for the existing KITTY AI Cloudflare Worker. The canonical app source remains in the sibling `KITTY AI/backend/` project.

Worker integration:

1. Copy `websiteChat.ts` beside `backend/src/index.ts` and import `websiteChat` from `./websiteChat`.
2. Add `WEBSITE_GATEWAY_TOKEN?: string` to `Env` in `types.ts`.
3. Dispatch `/api/website/chat` to `websiteChat(request, env)` **before** the Firebase authentication branch. The route performs its own server gateway authentication.
4. Save a fresh gateway token of at least 32 characters as the Worker secret `WEBSITE_GATEWAY_TOKEN`. Keep the same value only in the website's private runtime configuration as `KITTY_AI_GATEWAY_TOKEN`.
5. Set `KITTY_AI_WEBSITE_URL` to `https://kitty-ai-v2.kitty-ai.workers.dev/api/website/chat` in that private configuration. The website supports server-only environment overrides or its encrypted database runtime configuration, read through `getRuntimeConfiguration()`. Never place these credentials in public environment variables, browser props, source archives or GitHub.
6. Run backend type checks and tests, review the Worker diff, then deploy the existing Worker. Do not use a temporary account or change the app's Firebase configuration, vault key, databases or owner identity.

The website route uses the existing Workers AI binding and a bounded Cloudflare text model. It does not read private app conversations, memories, accounts or provider keys. Website quota counters are stored separately under `website_chat` in the existing `usage` table, with hard limits of 150 total requests/day and 30 requests per hashed visitor/day. Website counters older than seven days are removed when requests arrive. No visitor messages or generated replies are persisted there. The website applies additional same-origin, bot verification and rate limiting before forwarding requests.

Studio can adjust presentation, tone instructions, conversation length, output length and temperature. These settings are configuration; they do not train or fine-tune model weights. The public context is derived from published website records, with no private Studio inbox data.

## Verified deployment

The reviewed gateway was deployed to the existing `kitty-ai-v2` Worker on 8 October 2026, version `8c6f00a1-7952-4ba4-8e3f-922cefe8b82b`. Its existing D1, Hyperdrive, Workers AI, assets, Firebase and owner bindings were preserved. Anonymous gateway requests returned HTTP 401. One authorized bounded request returned HTTP 200 with an actual website-services answer from Workers AI.

Local Worker type checks passed; the complete backend security suite passed 62 tests. The website proxy's 20 isolated checks verify origin protection, missing credentials, quota failures, challenge failures, fixed upstream host, UTF-8 bounds and invalid provider replies using mocks.

Future KITTY AI backend deployments must preserve this module, its route dispatch and the separate Worker secret. Redeploying an older app backend without the gateway will stop the website assistant.
