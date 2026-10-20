# LVPRMS React Frontend Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for the previously selected Native execution. Steps use checkbox (`- [x]`) syntax. Preserve existing approvals and do not restart design discovery. This written plan is ready for review; implementation has not started.

**Goal:** Convert the completed LVPRMS nurse frontend to React, preserve the approved desktop UI/workflows, prepare verified API service boundaries, and push the tested frontend to `https://github.com/DanielCasimiro67/LVPRMS.git` for backend-developer handoff.

**Architecture:** React components own the UI and form state; existing tested pure domain rules remain reusable. An explicit demo adapter preserves current functionality; an injected API client and capability map account for the reference Laravel endpoints without fabricating support for incompatible writes. Preserve hash-route deep links, existing CSS/fonts/icons and current fictional browser records.

**Tech Stack:** React, React DOM, React Router, Vite, JavaScript/JSX, existing CSS; native Node domain/contract tests and bundled Playwright/Edge for desktop verification. No new CSS framework, Redux, backend framework or database.

**Spec:** `docs/superpowers/specs/2026-10-20-react-api-migration-design.md`; verified source/field gaps in `docs/react-api-repository-audit.md`.

## Global constraints

- Current LVPRMS UI is the authority. `DanielCasimiro67/La-Verdad-Patient-Record-Management-System-LVPMS-` is a read-only API reference, not the destination and not replacement UI.
- Push only to the existing `origin`, verified as `DanielCasimiro67/LVPRMS.git`; use the current feature branch unless user specifies another. No force push, backend overwrite, merge or deployment.
- Nurse/assistant only. Desktop1440×960. Phone/tablet, admin/doctor/clearance UI and backend code changes remain excluded.
- BRD v2.2.1 plus approved meeting revisions win over incompatible controllers. No invented severity, premature referral checkout, fake email delivery or silently discarded inputs.
- Demo is explicit and remains the default handoff experience. API mode never silently falls back to demo success. Missing API capabilities remain clearly unavailable; backend fixes are documented.
- Preserve existing139 Node tests and data migration/revision protections. React must own its rendered subtree; do not mount the old DOM-mutating app beneath React or use HTML string injection to claim conversion.
- Keep API modules directly importable in Node. Inject `baseUrl`, `fetchImpl`, `tokenStore` and unauthorized handling. Read Vite environment only at bootstrap; document exactly one versioned API-root convention.
- Do not stage the ignored reference checkout, local credentials, browser data, screenshots, generated build output or dependencies. Commit the dependency lockfile and safe configuration example.

## Review focus

1. Re-rendering during a dirty form must not clear input, change its captured revision or overwrite another patient's draft.
2. React effects must clean up scanner listeners/timers and never process one scan twice under StrictMode/remount.
3. Retrying an uncertain server write must not create duplicate visits/supply deductions/notifications or disguise partial failure.
4. Patient IDs, categories, full names and unknown clinical fields must not be guessed from loose normalization.
5. Production build must retain fonts/icons/login background and working deep links; development tooling must not expose ignored backend-reference/secrets directories.

## File responsibilities

- `src/main.jsx`, `src/app/App.jsx`, `src/app/router.jsx`: React entry, route registry and protected shell.
- `src/app/ClinicProvider.jsx`: explicit mode/session/data wiring, cached state and guarded commands.
- `src/components/`: shared controls, cards, identity/status components, password toggles, note fields and confirmation dialogs.
- `src/features/access/`, `today/`, `patients/`, `visits/`, `messages/`, `referrals/`, `inventory/`, `reports/`: React pages and scoped forms.
- `src/services/api-client.js`, `api-contracts.js`, `api-adapter.js`, `demo-adapter.js`: HTTP transport, capability/DTO mappings, supported server calls and demo bridge.
- Existing pure `js/clinic.js`, `visits.js`, `profiles.js`, `messages.js`, `referrals.js`, `inventory.js`, `reports.js`, `store.js` and rules: retain/reuse. Old DOM controllers are retired from the runtime only after replacement parity.
- `vite.config.js`, `package.json`, lockfile, `.env.example`, `index.html`: development/build configuration and final entry.
- `tests/api-client.test.mjs`, `tests/react-adapter.test.mjs`, `tests/react-render.test.mjs`: transport, state transitions and component render checks; browser interactions provide behavioral verification.
- README, existing route map, API handoff and backend-fix documents: teammate setup and exact connected/demo/unavailable status.

## Task 1: React foundation and data boundaries

**Interfaces:** `createApiClient({baseUrl,fetchImpl,tokenStore,onUnauthorized})`; a demo adapter exposing `read()`, `commit(change,expectedRevision)` and explicit session operations; a capability record for supported/blocked API operations. React state snapshots remain stable until a successful command or explicit reload.

- [x] Write failing Node transport/adapter tests: JSON envelopes/validation,401 cleanup, URL versioning/encoding, abort handling, no invented IDs, stale revision, failed save and no demo fallback. Run and observe the expected missing-module failures.
- [x] Add compatible React/Vite/router dependencies and lockfile. Preserve the runnable legacy frontend while establishing a temporary React development entry; avoid scaffold overwrite.
- [x] Implement injected transport, explicit demo adapter and capability definitions. Reuse existing pure domain code; React StrictMode must not seed/write during render.
- [x] Add Vite configuration and safe example variables (`VITE_DATA_MODE=demo`, `VITE_API_BASE_URL=/api/v1`). Exclude private/reference directories from development serving; use local source assets with build-resolved URLs.
- [x] Run native tests and a React shell build/render check. Expected: previous139 tests plus new contract tests pass; shell renders without a competing legacy runtime. Commit foundation after checks.

## Task 2: Access, Today and patient records in React

**Interfaces:** Shared controlled fields/dialogs; patient-specific form state; provider commands retain captured revision. Router preserves existing path/query semantics. API sign-in uses email while demo retains fictional usernames.

- [x] Add failing checks for default masking/read-only username, session bootstrap/loss, unique scan handoff without writes, duplicate scan cleanup, registration inference, incomplete-record completion, distinct complaint/date filters and note editing/history.
- [x] Implement shell/login/account/session recovery, Today scan hero and manual name-search/register fallbacks as React components. Retain safe scan timing and ignore editable controls/dialogs.
- [x] Implement patient list/filters, department-led registration and record/detail editing. Keep student identity and incomplete emergency-contact rules; Faculty displays as Staff. Unsupported API fields are unavailable rather than discarded.
- [x] Implement patient identity confirmation, authored note add/edit/history, configurable counters and unsaved-work guards. Status/context rerenders cannot reset entered text.
- [x] Run Node/component tests and browser flows at1440×960: refresh/back, unknown/ambiguous cards, school/staff/visitor registration, blank/over-limit/stale/failed notes, account keyboard/expiry. Compare existing visual references and inspect assets. Commit after checks.

## Task 3: Visits, completion, Messages and referrals in React

**Interfaces:** React forms invoke existing domain save/complete/correct/discharge/transfer commands in demo mode. API capabilities are checked before mutation; backend status enums are not replacements for approved clinical states.

- [x] Add failing checks for draft separation, required complaint/state, optional vitals/supplies, distinct Save/Complete, dirty navigation, second-tap confirmation and exactly-once summary/stock effects.
- [x] Implement new/ongoing/completion/completed/correction views in React, preserving patient identity, allergy/blood-type Not recorded, collapsed optional fields and actual message status.
- [x] Implement Messages filters/detail/body/attempts/retry/manual follow-up, including the Task7 dirty-text/status-rerender fix. No API log creation is treated as actual sending.
- [x] Implement referral list/detail/contact/reply/action/resolve/actual-transfer/print. Doctor contact never checks out; only confirmed actual transfer completes care. Referral preparation API write stays blocked while its server side effect conflicts.
- [x] Run domain/component/browser tests for failure, missing recipient, stale writes, double completion, urgent/repeated transfer, late reply, immutable summaries and reference asset/layout parity. Expected: complete demo journeys still work with no legacy document-mutating controllers. Commit after checks.

## Task 4: Inventory, reports and backend handoff

**Interfaces:** Inventory/report pages consume shared normalized models. Native print views have no navigation/forms. Every declared nurse endpoint has an exact client method/capability classification; unsupported workflow writes remain disabled in API mode.

- [x] Add failing React/adapter tests for unit/fraction rules, delta reconciliation, stock history and report/date/category/complaint behavior; retain all existing domain tests.
- [x] Implement inventory search/low-stock/add/count-adjust/history and daily/monthly/complaint/frequent reports/printing in React. Preserve current opening-stock baseline and no retroactive deductions.
- [x] Finish all verified API read/auth/password mappings and contract fixtures. Record missing backend fields/transactions/endpoints and explicitly classify each nurse workflow as supported, read-only or blocked. Do not fabricate live connectivity without a running test backend.
- [x] Replace the main entry with the React app once parity is demonstrated. Keep necessary standalone simulator/recovery functionality usable; remove legacy runtime imports without deleting unrelated historical/domain files.
- [x] Run full Node/component tests, production build and complete desktop browser regressions. Verify twelve primary nurse routes plus forms, all real buttons, console/errors, keyboard/focus, refresh/back, private-path handling, bundled assets and single/multipage prints. No phone/tablet claim.
- [x] Update README with `npm install`, `npm run dev`, `npm run build`, demo credentials, modes/configuration and handoff limits. Update route map, API contract/fix list and progress. Review the final full change with one fresh reviewer as required by executing-plans; fix Important findings with regression tests.
- [x] Verify staged files contain only intended frontend, tests, assets, lockfile and documentation. Confirm `origin` URL and remote branch state; reconcile non-destructively if needed. Commit and push the tested current feature branch to `DanielCasimiro67/LVPRMS.git` without force. Report commit/branch, tests/build/browser results and backend blockers, then stop.

## Approval and execution

The latest user clarification authorizes the destination and confirms the reference-only backend role. This is the concrete written implementation plan for review before product changes. Continue using Native execution after approval; do not ask again for the repository destination or execution-method choice. Pushing the new frontend is already explicitly authorized and should occur after verification, without another permission gate except an actual environment approval requirement or conflicting remote changes.


## Execution checkpoint — 20 October 2026

User approved Native execution, preserving current UI/workflows, desktop 1440×960 and pushing to LVPRMS. Foundation committed as 22150ee. React parity and handoff completed in the existing checkout. Retained the 139 original tests; added native transport, adapter, DTO/route and React field render checks (148 total). Existing browser journeys were adapted to React; real failures were reproduced and corrected, not hidden by replacing the UI with the reference repo. One fresh review's two Important mapping findings were corrected with RED/GREEN regressions. Full results are in the React QA checkpoint.

Execution adjustments: no new backend server was supplied, so API verification uses fixtures. Unsupported clinical operations remain disabled; all 24 nurse route methods are prepared, but only documented reads/auth/password are called by screens. No phone/tablet, backend schema changes, deployment or live-delivery claim. The historical source files remain available but are absent from the clinical React entry. Standalone simulators remain native modules. Final push uses the current clinic-web-app branch, not main.
