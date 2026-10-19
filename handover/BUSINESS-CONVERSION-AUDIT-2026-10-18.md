# Business conversion audit — 18 October 2026

Reviewed the active repository, route/API inventory, forms, payment/identity boundaries, public cache, metadata, publishing and existing release tests before changes.
Baseline: ab7d695dafdcc3fd090666d6e68514c394cc99bc. Preserve unrelated linkedin-agent-skill files.

| Problem | Change | Business reason | Risk |
|---|---|---|---|
| Products and checkout interrupt first-contact flow | Services → real internal work → process → support → enquiry → Labs/research | Help a buyer understand and contact the team | Low |
| Initial enquiry asks for payment decisions and many fields | Four required fields; optional detail/account/AI controls collapsed; payment decided after quote | Reduce effort without promising free development | Medium: validate API, guest and tracking paths |
| Service scope is broad | Three explicit offers and coaching/agency pages | Make relevance and separately billed costs clear | Low |
| Suvid concept has no distinct destination | Research page with proposed milestones and evidence limits | Separate long-term research from available services | Low |
| Conversion measurement is page-only | Consent-gated fixed-label events; no field values or raw errors | Measure interest and form completion without private contents | Medium: test consent and private-route denial |
| Contact subjects are silently dropped | Allow known purchase/research/investor contexts and send subject | Preserve enquiry intent in Studio/email | Medium |
| Upcoming domain migration spans multiple providers | Document exact provider checklist; keep existing domain/settings now | Avoid sign-in, challenge, webhook and canonical regressions | Low now; provider changes require purchased domain |
| Achievement supplied by owner | Team Prometheus Top 500 Hack in Hills '26, Round 2; official event link | Publish a specific attributable milestone | Low; no win, endorsement or private invitation claims |

No production schema, credential, environment or payment calculation changes are planned. Keep live public dataset caching and authenticated responses private. Layout reads country headers, so removing page force-dynamic flags alone would not produce safe static rendering.
The first-contact route keeps email as the supported contact channel to preserve acknowledgements and private-quote ownership; no synthetic email records are introduced.
