<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Verified latest source snapshot

This project has its own repository. Never merge its Git history or publish it to another Kitty-Corp project's repository.

After a major change: run the relevant project checks, then refresh ONLY this project's clean source snapshot before finishing. From the workspace's Source File Zip directory, run Update-Source-Zips.ps1 -Project website, or python source_archive.py --project website. The updater validates a temporary ZIP before replacing this project's SOURCE-LATEST.zip. If validation fails, keep the existing snapshot and report the error. Never remove the old verified snapshot first.

Keep credentials, environment files, original signing keys, private user data and live database state out of clean source ZIPs. Preserve them locally. Source ZIPs include working source and a continuation guide, while the live .git directory and the correct existing GitHub repository retain history. No automatic push or deployment is authorized by archive refresh.

## Latest commercial update — 18 October 2026
Read handover/UPDATE-2026-10-18.md and handover/VERIFIED-RELEASE-2026-10-18.md before relying on earlier release notes. The reusable prompt is handover/CONTINUATION-PROMPT-2026-10-18.txt. LISA remains an assisted purchase; see LISA-DISTRIBUTION-GUIDE.md.
