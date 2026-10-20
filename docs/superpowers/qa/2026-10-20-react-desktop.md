# React desktop verification — 20 October 2026

Scope: current nurse UI/workflows migrated to React; desktop 1440×960 only. The existing tokens, local fonts/icons/login background and approved meeting flows are retained. No backend files were changed. Browser plugin was unavailable; Native Playwright with local Edge was used.

## Results

- Node domain, repository, transport, contract and React-render suite: **148 passed, 0 failed**. Retained the original 139 checks. Stale revision rejection remains covered before stale data can mutate saved records.
- Production build: passed, including index, email/demo simulator and intake simulator entries, local fonts, icons and background.
- Demo browser journeys: **89 checks passed across ten suites**, including 12 primary nurse routes, registration/incomplete records, record/note edits, quick visits, tap confirmation, completion/Messages, referral actual transfer, account, inventory and reports.
- API-mode browser fixtures: **5 checks passed** for email login/bearer/no demo seed, referred checkout ambiguity/disabled discharge, actual supply details, password payload and 401 token clearing.
- Production-build route/interaction sweep: **8 checks passed**, 12 routes, no recorded page/console errors, clipping, broken images or remote asset requests. Refresh/Back, category filters, complaint/date composition, sign-out route guards and corrupt-data recovery download passed.
- Single-page and multipage A4 logs: generated from the React report view and checked for repeated headings, final record and margins. No production PDF service is implied.

Each suite uses isolated fictional browser data. Existing user browser records were not reset. Phone/tablet and live backend/delivery were not tested.

## Fixes reproduced during verification

Corrected React field/datalist rendering, safe dialog focus, duplicate-scan/implicit-submit discharge guards, unsaved-note protection, persistent visit draft Save/Discard navigation, session-expiry routing and collapsed discharge notes. Original authored histories and immutable email snapshots remain intact. API contract tests caught referred status being treated as completed and issued supplies being omitted; both were fixed with regression tests. Invalid ID objects/booleans are rejected rather than normalized into fictional keys.

One fresh read-only migration review was completed; its two Important API mapping findings were fixed and retested. No additional backend integration or layout redesign was added.

## Local evidence

Evidence is outside the repository and not needed to run the app:

`C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/react-migration/`

It includes per-suite `qa-result.json` files, `draft-checks.json`, `final-checks.json`, `production-desktop-smoke.json`, `api-mode.json`, screenshots and report PDFs. Earlier failed screenshots/runs remain diagnostic history; final suite results determine the checkpoint. Compare current screenshots with the prior `clinic-task7` checkpoint. The migration preserves that approved UI; this is not a claim of renewed pixel-level inspection of every historical Figma frame.

The backend-ready boundary and every route's UI/prepared/blocked status are in `docs/FRONTEND_BACKEND_HANDOFF.md`. Demo mode is the default. No live integration or production security acceptance is claimed.
