# LVCC Clinic Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for native execution after the user reviews this plan and selects execution. Do not delegate without user authorization. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current responsive clinic Figma design into a working, local, browser-based prototype matching BRD v2.2.0 and the user's supplied Build Web Apps brief.

**Architecture:** Use semantic HTML, reusable CSS components, and native JavaScript modules. A hash router renders clinic screens; a transactional localStorage repository owns fictional records, revisions, stock movements, and message events. Mock adapters simulate school identities, card lookup, sign-in, and message delivery without contacting external services.

**Tech Stack:** HTML, CSS, vanilla JavaScript; no frontend framework, package dependencies, or build step. Use the bundled Node runtime for domain tests and a static HTTP server for browser verification.

**Spec:** The user-supplied Build Web Apps brief in `C:/Users/daniel/.codex/attachments/5f2a0611-279c-4fed-b46e-9ecae353bb72/Pasted text.txt`; `docs/BRD.md` v2.2.0. `docs/System_Flow_and_UX_Specification.md` v0.1 supplies compatible workflow detail only; latest user instructions and BRD supersede its administrative scope and older storage assumptions.

## Status and implementation audit

Approved by the user on October 15, 2026 for Native execution, with a review stop after each task. Task 1 was approved. Task 2 is implemented for review; Tasks 3–7 have not started. The supplied brief defines the desired design and behavior.

User adjustments: inventory every current Figma screen/state and map it to a route before completing Task 1; inspect each screen node before implementing it; use native ES modules importable by Node; test stale-revision rejection first; keep concurrency simple; show desktop/phone Figma comparisons and test results, then await the user's go-ahead after each task.

- The repository contains design documentation, Figma authoring helpers, and PDFs. It has no `index.html`, application CSS, JavaScript application, package manifest, or existing rendered implementation to repair.
- Read `AGENT.md`, both actual source documents directly under `docs/`, and current design QA records. The historical source-directory names in AGENT.md do not exist; the actual source paths are explicit in this plan.
- Live high-fidelity Figma design context and screenshots inspected: Today desktop `174:4244`, Today phone `174:4394`, login desktop `177:4259`, in file `j9OCbJk4L7CjZxtqbHbRAq`. These current nodes establish the visual reference, rather than historical pages.
- Source records identify the current page as `Clinic app · Responsive`, `174:4208`. Inspect additional current screen nodes before implementing their contents; do not infer fidelity from historical authoring scripts alone.
- Visual foundations observed: Open Sans, primary `#0369a1`, canvas `#f5f8fc`, surface `#ffffff`, text `#0f172a`, muted `#475569`, border `#cbd5e1`, subtle border `#e2e8f0`, selected `#e0f2fe`; 8px controls, 12px cards, 44px buttons, 48px inputs, 232px desktop navigation, 32px desktop content gutters, and 16px phone gutters. Card shadow is `0 3px 12px rgba(15,23,42,.05)`.
- The desktop login places a 480px form to the right of the supplied proportional building illustration. The phone design uses a compact menu and stacked actions.
- Figma's example reader-ready and email-sent states cannot become unconditional runtime claims. Render actual mock-adapter status, preserve failed attempts, and keep simulator controls outside ordinary clinic screens.
- Current BRD defers administration and excludes doctor access and clearances. Earlier administrative sections in AGENT.md, the flow specification, and the old Figma implementation plan are superseded for this deliverable.

## Global Constraints

- "plain HTML, CSS, and vanilla JavaScript only. No frameworks or build step."
- "Administration is deferred."
- "No doctor login, doctor portal, clearance module, patient portal, or new features outside the BRD."
- "Keep simulation controls outside ordinary clinic screens."
- "Never use real patient information or store real credentials."
- "Email failure must not undo the completed visit."
- "Preserve the original email snapshot if the visit is later corrected."
- "Visitors must not require school ID, RFID, grade, or department."
- "Do not display requirement codes, release codes, fixture labels, or implementation terminology in the interface."
- Match existing Figma rather than generating a replacement visual concept. Download its provided SVG/image assets locally, with the supplied original illustration reused unchanged; no screenshot becomes an application asset. Preserve historical Figma and documentation.
- Maintain Today, Patients, Referrals, Inventory, Reports; Messages and My account remain utilities. No clinical privileges arise from being a patient or school employee.
- Use `sessionStorage` for the simulated session and localStorage only for fictional application data and draft recovery. Never persist entered passwords; own-password behavior is an explicit non-secure demonstration using disposable demonstration values.
- Document that browser-local persistence cannot provide production authentication, shared-device confidentiality, cross-device uniqueness, server audit integrity, real email, or real MIS/RFID integration.
- Use synchronous optimistic revision checks immediately before persistence and storage-event warnings. Reject stale saves without discarding entered values. No Web Locks or distributed-concurrency guarantees; localStorage is not an atomic compare-and-swap service.

## File structure and shared contracts

| File | Responsibility |
|---|---|
| `index.html` | Accessible shell, application root, module entry, live feedback region |
| `css/tokens.css` | Figma colors, typography, spacing, sizes, shadows |
| `css/app.css` | Shared components, shell, responsive layouts, print rules |
| `js/app.js` | Routing, session guard, page lifecycle, delegated actions |
| `js/ui.js` | Safe text rendering, fields, buttons, cards, badges, dialog/focus helpers |
| `js/data.js` | Fictional patients, school identities, visits, referrals, inventory, sample messages |
| `js/store.js` | Versioned storage, atomic commits, revisions, migration/error handling |
| `js/clinic.js` | Identification, registration, encounters, corrections, stock reconciliation |
| `js/messages.js` | Summary snapshots, stable event identity, retry/attempt history |
| `js/services.js` | Separated mock session, school identity, card, and delivery adapters |
| `js/views/access.js` | Login, account, session-ended states |
| `js/views/patients.js` | Today, search, registration, patient records |
| `js/views/visits.js` | New/ongoing/completed visits, completion and correction forms |
| `js/views/follow-up.js` | Referrals and Messages views |
| `js/views/operations.js` | Stock movements, reports, print output |
| `assets/` | Downloaded exact Figma icons, original login image, local font if available |
| `demo.html`, `js/demo.js` | Separate simulator configuration and recovery controls |
| `tests/clinic.test.mjs`, `tests/messages.test.mjs` | Built-in Node tests for state transitions and integrity |
| `README.md` | Launch instructions, fictional sign-in examples, simulator usage, limitations |

Repository API: `readState()` returns a detached snapshot; `commit(change, expectedRevision)` persists one validated complete state or throws without announcing success. Domain functions receive state, explicit inputs, actor, and clock and return the changed state/result; rendering has no direct storage mutations. Persist dates as ISO strings and display them consistently in Asia/Manila.

Primary entities: patient, school identity/RFID mapping, visit, visit revision, patient note, referral/activity, stock item/movement, message event/attempt, and draft. Reference internal IDs in code only; show human-readable names and school IDs where useful.

## Review Focus

1. A storage write fails during visit completion: keep form values and do not create a send attempt or stock side effect (Tasks 1, 3, 4).
2. Double completion or two tabs save the same patient: one active visit and one completion-summary event; reject stale revisions (Tasks 1, 3, 4).
3. A visit correction changes supplies and clinical text: reconcile only the stock delta and preserve the original sent summary (Tasks 3, 4, 6).
4. Physician advice arrives after a transferred visit is completed: record follow-up without reopening the encounter (Task 5).
5. School data contains conflicting keys, a changed card, or provisional matches: require explicit resolution; preserve visitors and clinical history (Task 2).

## Task 1: Application foundation and persistence

**Files:** `index.html`, `css/tokens.css`, `css/app.css`, `js/app.js`, `js/ui.js`, `js/data.js`, `js/store.js`, `js/services.js`, `js/views/access.js`, `README.md`, `tests/clinic.test.mjs`.

**Interfaces:** Produce shared UI helpers, `readState()`, `commit(change, expectedRevision)`, `requireSession()`, and the routing lifecycle. Domain functions consume plain state snapshots, avoiding browser dependencies in tests.

- [x] Inventory all 348 screen/state frames and four guides, read their live node content and map routes in `docs/figma-screen-inventory.json` and `docs/figma-route-map.md`. Inspect high-fidelity current nodes for implemented screens and extract tokens/assets. Download exact icons, original illustration and Open Sans to `assets/`.
- [x] Test stale revision first (red then green). Add and pass failure/corruption/unavailable-storage, detached reads, nested-save and failed-sign-out checks.
- [x] Implement shell/navigation, login/session guard, sign-out, inactivity handling and own-password simulation for fictional nurse/assistant accounts. No persisted passwords, signup or role picker.
- [x] Implement storage initialization, simple revision checks, storage-event warnings, failure recovery and escaped rendering. Add minimal `package.json` with `type:module` for Node/browser imports.
- [x] Run `node --test tests/clinic.test.mjs`: 11 pass. Verify implemented browser flows, responsive reflow, console health and screenshots. Compare desktop/phone login, Today and account against current Figma. Pause for review before Task 2.

## Task 2: Intake and patient records

**Files:** `js/clinic.js`, `js/views/patients.js`, `js/data.js`, `js/services.js`, `tests/clinic.test.mjs`.

**Interfaces:** `identifyPatient(state, value)` returns match/ambiguous/unknown; `registerPatient(state, input, actor, now)` returns patient reference; `startOrResumeVisit(state, patientId, actor, now)` returns the existing active visit or patient draft; `mergeSchoolIdentities(state, records)` updates identity only and reports conflicts.

- [x] Test unique, unknown, ambiguous and repeated card input, name-search explicit selection, duplicate school IDs, visitor registration without school fields, and school-identity changes preserving history/visitor data.
- [x] Implement Today with dynamic ongoing work and attention counts. Provide dedicated scan/manual-ID entry and partial-name lookup. Reader status reflects simulation, with no false hardware-connected claim.
- [x] Implement category filters, type-aware registration, duplicate recovery, patient history/date/complaint filters and authored/timestamped notes. Existing registration remains findable after later visit failure.
- [x] Preserve per-patient drafts when changing routes/patients; implement Stay, Save and switch, and Discard and switch where appropriate. Invalid Save and switch must retain current input.
- [x] Verify Students/Staff/Visitors/All patients results, repeated scan resumes, and new patient intake has no completed visit/message/stock effects. Test changed and ambiguous school mappings through the separate simulator.

Task 2 verification: 23 Node tests passed (11 foundation + 12 intake); browser category/search, registration, duplicate recovery, notes, draft reload/switching, repeated/unknown/ambiguous identification and two-tab stale-save rejection passed. Desktop/phone comparison boards are under the external visualization folder `clinic-task2`. Separate simulator: `assets/intake-simulator.html`. Task 2 includes only the minimal reason/status ongoing save needed for safe switching; assessment, treatment and completion remain Task 3.

## Task 3: Care documentation, completion and corrections

**Files:** `js/clinic.js`, `js/views/visits.js`, `tests/clinic.test.mjs`.

**Interfaces:** `saveVisit(state, input, actor, now)`, `completeVisit(state, input, actor, now)`, and `correctVisit(state, visitId, input, reason, actor, now)`. Completion atomically stores the visit, stock delta and one pending message event before delivery processing.

- [ ] Test required-field failures, one active encounter, repeated completion, stale tab writes, storage failure, all four outcomes, and correction audit preservation.
- [ ] Implement complaint selection/Other, relevant vitals with units, assessment, treatment, supplies, ongoing state and final outcome/notes. Validate finite values and sensible input formats without inventing clinical decision rules.
- [ ] Separate Save visit, Continue care, Complete visit and correction actions. Show persistent patient identity and pre-completion email explanation. Store revision author/time/reason; never change patient identity to correct a wrongly linked encounter.
- [ ] Verify saved ongoing work resumes after refresh; invalid/save-failed completion preserves form and produces no email; completed records leave Today but stay in history; later attendance creates a distinct encounter.

## Task 4: Completion summaries and Messages

**Files:** `js/messages.js`, `js/services.js`, `js/views/follow-up.js`, `js/views/visits.js`, `tests/messages.test.mjs`, `demo.html`, `js/demo.js`.

**Interfaces:** `buildNurseSummary(state, visit)` creates an immutable subject/body snapshot; `processMessage(eventId)` persists attempt results for the existing event; `retryMessage(eventId)` retries only eligible unresolved events; `recordManualFollowUp(eventId, note, actor, now)` appends history.

- [ ] Test exactly one nurse-summary event for a saved completion, all patient types/outcomes, no events for ordinary saves/scans, failure without visit rollback, retry idempotency, missing recipient, and correction preserving original content.
- [ ] Implement a designated fictional `example.com` nurse recipient and approved-data demonstration template. Include saved patient/visit/outcome facts only; do not invent missing assessments or vitals.
- [ ] Implement inbox, status filters, complete email content, visit links, timestamps and attempts. Render Pending/Sent/Failed/Missing recipient from stored mock results, never from the click itself.
- [ ] Keep pre-existing concerned-party examples separate; do not automatically activate unapproved routing or expose clinical summaries to an adviser. Failed examples permit retry/manual follow-up.
- [ ] Add separate simulator controls for pending/success/failure/missing address, storage failure, session state, identity updates, and fictional data reset. Normal clinical pages contain no testing controls.
- [ ] Exercise completion -> View in Messages -> matching nurse email -> completed visit, including refresh, double-click, pending processing and failed retry recovery.

## Task 5: Nurse-managed referral follow-up

**Files:** `js/clinic.js`, `js/views/follow-up.js`, `tests/clinic.test.mjs`.

**Interfaces:** `prepareReferral(state, visitId, input, actor, now)` and `appendReferralActivity(state, referralId, activity, actor, now)` preserve attributable history and validate transitions.

- [ ] Test Prepared does not assert contact, actual contact records Awaiting doctor reply, recorded advice requires source/time, resolution retains history, and late replies never reopen completed visits.
- [ ] Implement list/status filters, reason/contact, actual Messenger contact, reply/advice, action/resolution forms and printable summary. Keep encounter completion separate from referral resolution.
- [ ] Verify pending follow-up remains visible after an external-transfer completion. No in-app Messenger inbox, doctor approval, or doctor login.

## Task 6: Inventory, reports and printing

**Files:** `js/clinic.js`, `js/views/operations.js`, `css/app.css`, `tests/clinic.test.mjs`.

**Interfaces:** `adjustStock(state, itemId, delta, reason, actor, now)`, `reconcileVisitSupplies(state, visitId, previous, next, actor, now)`, `reportRows(state, filters)` and print-specific view renderers.

- [ ] Test repeated save does not deduct twice; supply correction applies only the delta; insufficient stock is explained without partial commit; fractional quantities respect each item's unit.
- [ ] Implement search, stock additions/adjustments with reasons, quantity/unit display and movement history. Avoid hardcoded stock totals detached from visits.
- [ ] Implement printable daily patient log, monthly totals, complaint/type breakdowns, student grade/section and staff department breakdowns, frequent-patient listing, date/complaint/category filters.
- [ ] Verify reports derive from saved data, include visitors without school fields, and print without navigation/forms or clipped columns. No reports link to deferred administrative screens.

## Task 7: Responsive and workflow verification

**Files:** Appropriate implementation files and `README.md`; keep temporary browser scripts/screenshots outside committed source.

**Interfaces:** Exercise the complete static app over HTTP, using the same routes and domain functions delivered above.

- [ ] Run `node --test tests/clinic.test.mjs tests/messages.test.mjs`; all domain assertions must pass. Confirm no syntax errors or remote temporary Figma URLs in shipped assets/code.
- [ ] Use the in-app browser for rendered checks where available. If unavailable, use bundled Playwright and record the fallback reason; avoid new browser dependencies unless required.
- [ ] Verify app URL/title, meaningful first render, console health, working primary controls, refresh/back navigation, validation recovery, and no forbidden scope/codes in normal screens.
- [ ] Compare Figma and rendered screenshots at 1440x960, 1024x960 and 390x844; additionally check 320px reflow and keyboard focus. Verify labels, dialogs, contrast, 44px target height, visible focus and readable statuses; do not claim full WCAG conformance from these checks alone.
- [ ] Execute BRD scenarios AC1-AC10 and AC12-AC22 as applicable to the local mock prototype; AC11 is deferred. Record simulation boundaries for authentication, multi-device concurrency, real equipment, school data and delivery providers.
- [ ] Verify every visible asset is a nonempty local file rendered in the intended slot with correct proportions. Compare supplied login image and current reference against the browser screenshot with `view_image`.
- [ ] Document launch command, fictional account examples, simulator route, storage reset/recovery, implementation limitations and unverified integrations. Open the running app for the user.

## Plan self-review

- Scope covers the supplied seven workflow groups and relevant BRD acceptance scenarios. Production integrations and deferred work remain outside this frontend deliverable.
- Failure and idempotency checks belong to the domain tasks that own the mutations, not merely UI smoke tests.
- All modules expose plain data contracts and use a single commit boundary, preventing partial stock/message side effects on a failed visit save.
- Exact per-screen composition must be inspected from live Figma before its implementation. Existing inspected foundations establish the shared style, not permission to invent remaining layouts.
- Selected execution: **Native**, as approved by the user, with an explicit review stop after every task. Task 2 is ready for review; wait for go-ahead before Task 3.
