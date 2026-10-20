# Meeting revisions — frontend task sequence

User authorized frontend implementation and polish on 19 October 2026. Existing HTML/CSS/vanilla JavaScript, local demo storage, LVCC blue/white design, desktop 1440 × 960. No backend work. Stop after each independently reviewable task with screenshots and test results.

These are frontend prototype decisions, not a claim of clinic/client approval of a new BRD baseline. BRD v2.2.1 remains the reference except for the explicitly authorized frontend revisions below. Preserve previous Task 1–5 implementation and QA history. Previous Task 6 (inventory/reports) waits behind this revision sequence.

## Confirmed by the user

- Second RFID tap opens a quick discharge confirmation; it does not complete immediately.
- Checkout happens on actual transfer of care, not merely sending a referral message to the doctor.
- Keep backend integration out of this work.

## Revision 1: Today scan flow

Bounded change to existing identification: ID-shaped scan hero, waiting/found/not-found states, automatic navigation after feedback, manual school-ID/name fallback. Preserve in-clinic and attention lists. Matched identity opens unsaved visit or existing work; no encounter, discharge, stock movement or email from a scan alone. Unknown scan opens registration carrying the scanned identifier, without creating a record or inferring Visitor. Ambiguous matches require explicit selection. Protect against duplicate Enter/scan submissions and stale delayed navigation.

Files: `js/views/today.js`, `js/views/scan-hero.js`, `js/intake.js`, `js/patient-flows.js`, registration view/mapping support, `css/app.css`, `tests/scan.test.mjs`. Existing `tests/intake.test.mjs` remains intact. Reuse existing local icons, Open Sans and tokens; this is an existing-design-system change, without a new image concept or asset dependency.

- [x] Tests first: known/unknown/ambiguous routing without clinical side effects; duplicate scan gate; scanned identifier preserved; saved school-patient RFID mapping works on next lookup.
- [x] Implement hero and scan feedback; keep manual recovery available.
- [x] Verify desktop workflow, keyboard behavior, screenshots and complete Node suite; stop for review.

Revision 1 checkpoint: 69 Node tests and nine desktop browser checks pass. See `docs/superpowers/qa/2026-10-19-meeting-revision1-desktop.md`. Stop before Revision 2.

## Revision 2: Registration and incomplete records

Department-led school classification and searchable dependent education fields; no separate Faculty type. Personal contact optional. Define minimum-save versus complete-record validation for student identity and emergency contact, show incomplete state and support later editing. Demo MIS suggestions only; never claim a live MIS connection. Resolve conflicting classification rules explicitly before implementing inference: empty school data is not proof of Visitor. Preserve stable local identifiers and existing histories.

Revision 2 frontend rules: Higher ed/Basic ed → Student; Staff or school ID with no selected department → Staff; explicit No school department and no identifiers → Visitor. An unknown RFID or blank form stays unclassified. Student saves require name, school ID, RFID and program/year or grade/section; emergency name/number may be completed later. All categories require emergency name/number for Record complete. Personal contact/relationship remain optional. Staff/visitor identity minimums are name plus a defined classification. Invalid supplied phone values are rejected.

Files: `js/profiles.js`, `js/profile-flows.js`, `js/views/profiles.js`, patient views/controller, `js/clinic.js` identity description, CSS, `tests/profiles.test.mjs`. Previous registration API/tests remain for earlier contracts; the active form uses the department-led profile service. The old scan-view test was updated to assert the approved removal of category navigation while retaining scanned identifiers.

- [x] Test stale edits, inference, student requirements, incomplete/complete status, collisions, failed persistence, history preservation, school-managed identity and identity-only school suggestions.
- [x] Implement dynamic searchable fields, optional personal contact, deferred emergency completion, local lookup, Edit details and authored profile history.
- [x] Verify desktop registration/editing, screenshots and full suite; stop before Revision 3.

Revision 2 checkpoint: 81 Node tests, 11 desktop checks. See `docs/superpowers/qa/2026-10-19-meeting-revision2-desktop.md`. No backend or responsive work; school suggestions are fictional. Note limits/edit-security refinements remain Revision 3.

## Revision 3: Record editing and note polish

Separate patient identification from operator edit authorization. Preserve original clinical authorship and correction history; patient RFID/ID can confirm identity but does not grant permissions. Add declared, configurable frontend note limits/counters and blank validation; exact backend parity is not claimed while backend work is excluded. Select and document prototype limits before implementation. Polish incomplete-record editing.

Prototype ruling: 2,000 characters per note field, configured in `js/note-rules.js`. Applies to follow-up, visit, correction reason, referral and manual message follow-up textareas. Counters/validation retain over-limit text; legacy text is never truncated. Patient details, existing notes and clinical correction entry require a unique matching RFID/school ID/local patient ID while keeping operator sessions separate. New notes/ongoing care stay quick to record. Confirmation is temporary; no production security claim.

- [x] Preserve author/time, previous versions, immutable email snapshots and stale/failed-save protection.
- [x] Add identity confirmation, note counters, blank/limit validation and unsaved-note protection.
- [x] Verify Node suite and desktop 1440 × 960; stop before Revision 4.

Revision 3 checkpoint: 90 Node tests and 11 desktop browser checks. See `docs/superpowers/qa/2026-10-19-meeting-revision3-desktop.md`.

## Revision 4: Quick visit and tap-to-discharge confirmation

Pre-Revision4 correction requested and implemented October19: simplify Today scan panel to automatic detection plus Search by name/Register patient. Remove manual ID fields and Continue/Find patient. Found auto-opens unsaved/existing work, unknown auto-opens registration; ambiguous matches retain safe recovery. No extra resume dialog on automatic scans. Desktop verification: 95 Node tests and eight browser checks; see `docs/superpowers/qa/2026-10-19-automatic-scan-desktop.md`. This correction does not start Revision4.

Reduce routine clicks using automatic time/operator, optional clinical details and clear medicine/supply quantities. Second scan of an active patient opens a quick confirmation with outcome and the nurse-email explanation. Keep a discharge button fallback, explicit completion, duplicate prevention and accurate simulated email state. A repeated keyboard/reader event must not discharge someone accidentally.

Revision4 rulings: saved active encounter, rather than a raw tap counter, determines discharge eligibility. Repeat scans before the first visit save resume the unsaved draft. Unsaved clinical changes block quick discharge and offer Review visit. Opening/cancelling confirmation makes no storage write. Keep in clinic is initially focused; duplicate reader bursts and implicit form submissions cannot confirm. Capture arrival time from the local arrival draft; clinical author is the saving operator. Existing referral state and inventory are preserved.

- [x] Test stale rejection first, read-only scan selection, draft-only arrivals, required outcome, legacy complaint preservation, idempotency, failed saves, automatic timing and quick form rendering.
- [x] Implement quick entry, second-tap dialog, manual Discharge fallback and accurate pending summary handoff.
- [x] Verify desktop1440×960 and full suite; stop before Revision5.

Revision4 checkpoint: **105 Node tests**, **10 desktop browser checks**, five screenshots; see `docs/superpowers/qa/2026-10-19-meeting-revision4-desktop.md`. No backend or phone/tablet work.

## Revision 5: Referral and actual transfer

Simplify the nurse referral log. Contacting the doctor for advice keeps the patient active. An explicit actual-transfer action collects needed completion facts and checks the patient out; unresolved follow-up remains available. Preserve original summary snapshots, attempts, advice and author history.

Revision5 rulings: actual transfer requires a destination facility, an explicit actual-departure confirmation and Confirm transfer and checkout. Optional notes are limited by the shared policy; transfer time/operator are recorded automatically at confirmation. No doctor reply is required for an urgent transfer. Checkout uses the existing completed-visit path inside one storage commit and retains referral state. Dirty care, stale revisions and failed saves block partial completion. Ordinary actions no longer use the ambiguous action-or-transfer label. Existing completed visits are preserved, not converted into another transfer.

- [x] Test stale rejection first, doctor contact/action without checkout, confirmed transfer, urgent/repeated transfer, visitor support, validation, dirty/finished/mislinked records, failed persistence, late reply/resolution, immutable snapshots and escaped views.
- [x] Add explicit transfer form, patient care status, fewer primary referral actions and pending summary link; preserve histories and follow-up after checkout.
- [x] Verify Node suite and desktop1440×960; stop before Revision6.

Revision5 checkpoint: **116 Node tests**, **10 desktop checks**, five screenshots. See `docs/superpowers/qa/2026-10-19-meeting-revision5-desktop.md`. No backend or phone/tablet work; no new Figma frames claimed.

## Revision 6: Account and consistency pass

Password-only account editing, read-only username, show/hide password with default masking. Review dashboard routes, wording and empty/error states. Record frontend access controls as a simulation; no production RBAC claim. SQA tab-count questions belong to academic/test planning, not invented product screens.

Revision6 rulings: reuse one accessible password control on login/account, default masked with type-button Show/Hide eye controls. Submission re-masks; failed validation preserves entries; successful change clears fields. Read-only username is outside the password form and refers changes to school support. Preserve the existing in-memory password simulation; UI and README explain reset on reload rather than adding password persistence or backend authentication. Recheck operator/session after asynchronous password validation. Reject spaces-only new passwords alongside existing length/confirmation/current-password checks.

- [x] Test session loss during password validation, password-only/read-only account, masked accessible controls, invalid/new password behavior and no stored credentials.
- [x] Implement shared Show/Hide controls and account wording. Fix higher-ed Today descriptions, old unknown-card wording and unlinked-referral care status.
- [x] Verify desktop1440×960 account flows, main routes, empty/recovery states, screenshots and full suite; stop before inventory/reports.

Revision6 checkpoint: **123 Node tests**, **10 desktop checks**, five screenshots; see `docs/superpowers/qa/2026-10-19-meeting-revision6-desktop.md`. Frontend simulation only; no backend, production RBAC or phone/tablet verification.

## Then resume previous Task 6

Inventory stock reconciliation and reports, as a separate approved task after these revisions. Phone/tablet layouts remain deferred; no backend or admin workspace introduced.

Task 6 was separately authorized after approval of Revision 6 and is now implemented for review. Inventory additions/count adjustments/history, saved-visit stock reconciliation and filtered/printable reports follow the original plan. Verification: 137 Node tests, 11 desktop checks, ten captures and two A4 PDF checks. See `../qa/2026-10-19-task6-desktop.md`. Stop here; backend and phone/tablet remain deferred.

Task 7 was separately approved and completed on20 October2026: frontend only, desktop1440×960. Final verification139 Node tests and86 browser checks across nine suites. Two final-review data/draft issues were fixed and password-eye targets polished; see README Final desktop checkpoint. Phone/tablet and backend remain deferred. Stop after this checkpoint.
