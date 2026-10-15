# LVPRMS Interactive Figma Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execution method awaits the user's selection. Native execution is recommended here; do not delegate before authorization or an applicable skill requirement.

**Goal:** Build and verify a complete interactive LVPRMS desktop prototype covering clinical and administrative work in the existing Figma file.

**Architecture:** Create a separate revision inside the existing file, with semantic foundations and reusable components preceding screen composition. Keep clinical and administrative workspaces distinct. Use named fictional fixtures and explicit state transitions to demonstrate integrations and recovery without claiming real persistence or service connections.

**Tech Stack:** Figma Design, variables, text styles, auto layout, component sets and instances, prototype reactions/overlays and supported prototype variables; Figma connector for inspection, authoring, and screenshots. No production application code.

**Spec:** `docs/System_Flow_and_UX_Specification.md`, v0.1, October 14, 2026; companion business source `docs/BRD.md`, v2.1.0; governing instructions `AGENT.md`.

## Approval and source record

- Navigation and detailed workflows were previously approved, as recorded in AGENT.md and specification section 1.
- On October 14, 2026, the user replied **"approve"** to the written-spec review request identifying v0.1 and its proposed screen composition, permissions, data structure, UX foundations, recovery, and prototype coverage. This authorizes planning. It does not constitute school operational sign-off or a signed BRD baseline.
- The requested source directories are absent. The two actual source files are directly under `docs/`; they were read in full. Use these reviewed files for this plan. If newer source documents are subsequently supplied, assess the differences before implementation rather than replacing the sources.
- Plan status: **prepared and self-reviewed; awaiting user review and execution-method selection**.
- Figma inventory checked read-only on October 14, 2026: file `j9OCbJk4L7CjZxtqbHbRAq`, existing page `0:1` named `Page 1`, containing imported screen components, screens, and hidden state instances. Existing work includes historical doctor and spike concepts that must not enter the revision. Existing prototype functionality has not been verified.

## Global Constraints

The following exact specification statements apply throughout:

- "RFID identifies the patient and opens Log New Visit; it does not authenticate staff or save the encounter."
- "MIS supplies school identity data only. Clinic assessments, encounters, and visitor records are maintained locally; no clinical writeback to MIS."
- "The nurse contacts the doctor through Messenger, then records replies and actions. No physician login, doctor portal, or automated Messenger integration."
- "Clearances are excluded."
- "One active encounter is permitted per patient, across users/devices."
- "Referral actions cannot reopen a completed encounter silently."
- "Rule changes apply prospectively. They do not resend historical events automatically."
- "No background storage of clinical text in the browser is assumed."
- "Base spacing scale: 4, 8, 12, 16, 24, 32, 48 px."

Additional project constraints: preserve all historical Figma material; use fictional data; show integrations as simulations; use 1440 px reference layouts and verify 1024 px layouts; exclude doctor accounts, clearances, complaint-spike alerts, patient portals, prescription-image uploads, and clinical data in administration. Keep implementation assumptions in design annotations. Actual assistant authority and administrative ownership remain operational decisions.

## Review Focus

1. Registration succeeds but visit save fails: reuse the registered patient rather than creating a second patient (Task 4).
2. A different patient is scanned while required information is missing: Save and Switch fails safely and retains the current entry (Task 4).
3. A doctor reply arrives after transfer completion: update follow-up without reopening the encounter (Task 5).
4. A retry follows a notification failure and a rule change: preserve the original event/attempt history and do not send historical events as new events (Tasks 5–6).
5. Session expiry or a concurrent edit occurs with unsaved clinical text: conceal expired content, recover saved work only, and require explicit reconciliation for conflicts (Task 4).

## Artifact structure and naming

Target: https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System

Create these pages; if the file's plan limits page creation, use identically named sections inside a new revision page, or unused space on the existing page if necessary, without modifying historical content. Record the actual organization and node IDs.

| Destination | Responsibility |
|---|---|
| LVPRMS vNext / 00 Read Me and Scope | Approval provenance, scope, simulation notice, roles, release tags, links |
| LVPRMS vNext / 01 Foundations | Semantic variables, type styles, grids, contrast evidence |
| LVPRMS vNext / 02 Components | Reusable component sets and state documentation |
| LVPRMS vNext / 03 Clinic Workspace | S01–S12 and clinical S17, including error and recovery states |
| LVPRMS vNext / 04 Administration | S13–S16 and administrative S17, role restriction states |
| LVPRMS vNext / 05 Prototype Journeys and QA | Journey launchers, linked playable scenario frames, coverage and verification |

Name screen frames `Sxx / Title / State / 1440` or `/ 1024`. Name components `LVPRMS/Group/Component`. Record node IDs in a created `docs/superpowers/qa/2026-10-14-lvprms-figma-verification.md`; do not use remembered historical IDs as revised destinations.

Prototype links cannot be assumed to work across Figma pages. Keep each playable flow's connected frames on one page. Where necessary, place linked instances of canonical screens and overlays together on the Journeys page, preserving their component links. Include return/reset controls and separate clinical/admin launchers.

## Task 1: Establish preserved revision and verification ledger

**Artifacts:** Create the Read Me destination and the QA ledger; preserve `Page 1`. Sources remain unchanged.

**Interfaces:** Consumes approved specification S01–S17/P01–P13 and live file inventory. Produces destination IDs, screen registry, fixture registry, and journey checks consumed by all subsequent tasks.

- [ ] Load `superpowers:executing-plans` for Native execution or `superpowers:subagent-driven-development` for the selected alternative; follow the selected skill's review requirements. Load `figma:figma-use` before any `use_figma` call; read-only inspect current file structure, local styles, variables, existing components, fonts, and prototype capabilities.
- [ ] Record historical page/top-level node IDs and names in the QA ledger. Check permissions and supported prototype actions before choosing variable-driven interactions versus explicit state frames. Do not create a replacement file if access fails.
- [ ] Create the named revision destinations, recording their actual IDs. Add Read Me annotations for R1/R2/R3, fictional data, simulated integrations, and unconfirmed operating policies.
- [ ] Define fixture identities: student Mara Santos (`ST-DEMO-001`, Grade 11–Hope); staff Leo Cruz (`EMP-DEMO-001`, Finance); visitor Ana Reyes (`VIS-DEMO-001`). Use example.com addresses, masked phone values, fictional operator names, and no real contact destinations. Fix a displayed demo clock at October 14, 2026, 09:00, Asia/Manila.
- [ ] Register checks P01–P13 from the specification as Not Run, with expected results, frame IDs, and evidence fields. Add correction, concurrency, duplicate-registration, permission, and 1024-layout checks.
- [ ] Verify historical top-level IDs/names remain present and unchanged. This is the preservation baseline; no claim of historical functional testing.

## Task 2: Build and verify foundations

**Artifacts:** Foundations destination, `LVPRMS` semantic variable collection and text/grid styles, contrast matrix in QA ledger.

**Interfaces:** Consumes file capabilities/fonts from Task 1. Produces named color/spacing tokens and text/grid styles for all component instances.

- [ ] Load `figma:figma-generate-library` alongside `figma:figma-use`. Inspect existing library candidates; reuse only compatible foundations without changing legacy definitions. Use a revision namespace for new tokens.
- [ ] Establish tokens for canvas/surface/subtle surface, primary/secondary text, control border, primary action, focus, and info/success/warning/error foreground/background. Choose exact colors during setup and record their measured ratios before applying them. Reuse available readable sans-serif fonts; prefer Inter if available and record the selected family.
- [ ] Create styles: body 16/24, secondary 14/20, headings 20/28, 24/32, 32/40; use the approved spacing scale and 44 px primary control height. Create 12-column desktop grid with 32 px margins/24 px gutters at 1440; use 24 px margins/16 px gutters at 1024. Confirm these planning choices fit the clinical form.
- [ ] Check current authoritative W3C WCAG 2.2 guidance. Record normal text ≥4.5:1, large text ≥3:1, applicable non-text indicators ≥3:1; verify target sizing/spacing and visible unobscured focus guidance. Add notes distinguishing design checks from implemented accessibility tests.
- [ ] Render and inspect the token/type/grid sheet; verify sample labels at realistic size and focus visibility on both surface variants. Correct failing pairs before building components.

## Task 3: Build reusable components and their interactions

**Artifacts:** Components destination and instance demonstration board.

**Interfaces:** Consumes Task 2 tokens/styles. Produces component families below with named variant properties; screen authors use instances and exposed text/visibility properties.

- [ ] Create `Action/Button` (Primary/Secondary/Destructive; Default/Hover/Focus/Pressed/Disabled/Loading), `Action/Link`, `Form/Field` (Default/Focus/Error/Disabled/ReadOnly), `Form/Select`, `Form/Checkbox`, `Form/Radio`, `Form/Switch`, and `Form/Vital` with unit. Add persistent labels, required markers, help/error slots, and loading feedback.
- [ ] Create `Shell/App` (Clinical/Admin, Wide/Compact), `Navigation/Item`, `Header/Page`, `Identity/Strip` (Student/Staff/Visitor), `Lookup/Control` (Ready/Reading/Unavailable/NoMatch/Ambiguous), `Data/Table`, `Data/Row`, `Data/FilterBar`, `Status/Badge`, and `Status/Banner`.
- [ ] Create `Feedback/Empty`, `Feedback/Loading`, `Feedback/Toast`, `Dialog/Confirm`, `Dialog/UnsavedSwitch`, `Dialog/Session`, `Referral/Timeline`, `Notification/Attempt`, and `Audit/Entry`. Keep encounter and referral status properties separate.
- [ ] Use auto layout and resizing constraints. Confirm long patient names, multi-line errors, and disabled labels do not clip. Use text/icons with semantic colors. Provide selected and error variants only where meaningful.
- [ ] Connect reusable focus/hover/pressed and dialog dismissal demonstrations where supported. Annotate intended keyboard order, initial focus, Escape behavior, and focus return where Figma cannot demonstrate them faithfully.
- [ ] Visually inspect instances at 1440 and 1024. Confirm new screens can use instances without detaching them and token updates propagate. Resolve library issues before screen composition.

## Task 4: Compose clinical intake, care, history, and access

**Artifacts:** S01–S07 and clinical S17; supporting overlays and failure frames. Use `figma:figma-generate-design` alongside `figma:figma-use` for composition.

**Interfaces:** Consumes Task 3 component families and Task 1 fixtures. Produces screens and encounter states consumed by referral, notification, inventory, and prototype tasks. State identity: patientId, encounterId, encounterState, saved/unsaved, outcome; label them as simulated fixtures.

- [ ] Compose S01 Sign In, S02 Today, and S17 My Account. Today prioritizes intake and resumable encounters, then pending follow-up and notification failures. Clinical navigation is exactly Today, Patients, Referral Follow-up, Inventory, Reports; utilities include notifications, account, logout.
- [ ] Compose S03 search/results/no-results/lookup-failure; S04 Student/Staff/Visitor registration and duplicate checks; S05 history with date/complaint context and Start/Resume. Add known MIS identity with no clinic history and provisional school identity states. Registration recovery reuses the successfully registered identity when opening/saving a visit fails.
- [ ] Compose S06 as a full page with persistent identity and Complaint, Assessment, Care Provided, Next Action groups. Include Other complaint text, optional relevant vitals with units, supply-use entry, history panel, and separate Save Ongoing Visit, Save for Physician Follow-up, Complete Visit choices. Show appropriate identity fields for each patient type.
- [ ] Create saved ongoing/resting/resumed states, S07 completed summaries for all outcomes, correction-with-reason and revision history, and a wrong-patient-association correction path with explicit review of related referral/stock/notification effects. Preserve previously sent-message history.
- [ ] Create scan simulations for unique student match directly to S06, staff manual ID, unknown card, ambiguous mapping, reader unavailable, repeated same-patient scan, existing active encounter from another session, and different-patient scan while editing.
- [ ] Implement Save and Switch, Discard and Switch, Stay branches. Verify missing complaint prevents Save and Switch, retains the current patient/input, and identifies the field. No scan alone saves a visit, sends a message, or deducts stock.
- [ ] Add validation summary/field errors, failed-save retained values/retry, concurrent-edit reconciliation, session warning, expired-session concealed content/sign-in, saved-visit resume, and system-unavailable/downtime guidance. Unsaved text has no recovery promise after closure/expiry.
- [ ] Check P01–P05 and P13 against explicit state frames. Include a 1024 S02/S06 layout with history collapsed into an accessible supporting view and primary actions reachable without horizontal page overflow.

## Task 5: Compose nurse-managed referral and notification recovery

**Artifacts:** S08–S10, printable referral preview, related S06/S07 states.

**Interfaces:** Consumes encounter and patient fixture identity from Task 4. Produces independent referral status and notification event/attempt states; never merges these with encounter state.

- [ ] Compose S08 list filters Prepared, Awaiting Doctor Reply, Advice Received, Resolved. Include patient, linked encounter outcome, last contact, author, and informational waiting time.
- [ ] Compose S09 reason/prepared summary, Log Contact, Log Reply/Advice, actions, Resolve, and reasoned closure without reply. Capture source/contact/channel, actual time, advice, next action, and recording nurse. Preparation does not imply Messenger contact. Print preview identifies author/source and is clearly a simulation.
- [ ] Connect Prepared → logged external Messenger contact → Awaiting Doctor Reply → recorded advice → Advice Received → actions → Resolved. Active encounters return to nurse-selected In Progress/Resting after advice; completion remains a separate action.
- [ ] Add transferred/completed encounter with pending follow-up. Record a later reply and resolution while retaining Completed and its transfer outcome; exclude that encounter from the active-clinic list.
- [ ] Compose S10 Pending/Sent/Failed/Missing Contact/Disabled by Rule, event/recipient/channel details, retry result, and manual-follow-up entry. Sent means provider accepted, not read. Retry adds an attempt to the same fixture event; repeated save does not create a new event.
- [ ] Verify P06–P08, including retry fails again, missing contact without a fabricated visitor adviser, and manual follow-up preserving failure history. Visit remains saved during messaging failures. Keep sample routing policy outside ordinary clinical task copy.

## Task 6: Compose administrative accounts, settings, directory, and MIS states

**Artifacts:** S13–S16, administrative S17, role restriction and settings recovery states.

**Interfaces:** Consumes administrative shell, forms, dialogs, audit rows. Produces configuration fixtures; no patient chart, clinical payload, or clinical report enters the administrative workspace.

- [ ] Compose Accounts list/add/edit, permitted role choices, reset confirmation, deactivation/reactivation, audit feedback, and validation/failure states. Preserve historical authorship after deactivation. No physician role or public sign-up. Account password change does not expose stored passwords.
- [ ] Compose Alert Settings for supported event, patient type, recipient group, SMS/email channels, sample approved-template field, preview, save/cancel, validation, failed save, and change history. Clearly label routing as sample configuration; no live test-send.
- [ ] Compose Notification Directory add/edit/deactivate, student-section/staff-department associations, missing-channel markers, and contact format errors. Contacts remain separate from MIS identities; cancelling leaves the prior fixture unchanged.
- [ ] Compose MIS source/last-success/counts, loading/success/failure/conflict and authorized retry/import preview. Reconciliation uses stable identity keys, preserves visits and visitor records, and does not create operator accounts. Clinical users see summary availability only.
- [ ] Add admin permission-denied clinical destination and assistant-restricted clinical decision examples. Show an explicit workspace switch only for an annotated dual-permission fictional operator, never for admin-only access.
- [ ] Verify P09–P11. Rule edits apply to future events; retrying an existing failed event retains its originating event/history and does not recreate historical events. Account deactivation routes the affected demo session to restricted/sign-in state. Inspect one settings/table layout at 1024.

## Task 7: Compose inventory and complete report coverage

**Artifacts:** S11 Inventory, S12 Reports, print previews, related supply-use states.

**Interfaces:** Consumes Task 4 encounter/supply fixture and shared tables/filters. Produces stock-movement and report fixtures keyed to saved encounters, separate from administrative settings.

- [ ] Compose inventory search/category/stock filters, item/unit/available quantity, item detail/movement history, add stock, adjustment with reason, invalid quantity, insufficient stock, and failure recovery. Use neutral supplies such as gauze for the demo; avoid implying clinical medication advice.
- [ ] Demonstrate a saved encounter using 2 gauze units from 100 → 98; repeat-save remains 98; audited correction to 1 unit yields 99 with an attributable adjustment, not a second deduction. An unsaved entry leaves stock at 100.
- [ ] Compose daily printable log, monthly totals, complaint and patient-type breakdowns, student grade/section, staff department, frequent-attendance view, and date/complaint filters. Include visitors without school-only groupings, plus empty and loading/failure states.
- [ ] Connect P12: supply entry → saved encounter → linked inventory movement → date/patient-type/complaint report filter → print preview → back with filters retained. Keep reports available only to authorized clinic roles.
- [ ] Inspect 1024 inventory/report tables; preserve essential identity/action columns and provide intentional contained table scrolling where needed, without clipping page actions.

## Task 8: Assemble playable journeys, verify, and hand off

**Artifacts:** Journeys and QA destination, completed QA ledger, direct Figma node/prototype links.

**Interfaces:** Consumes all canonical screens, scenario state frames, and node registry. Produces verified journey entry points and evidence; failed checks stay open until corrected or explicitly reported as limitations.

- [ ] Assemble each P01–P13 journey using same-page frames/linked instances, overlays, meaningful buttons, back/cancel, confirmations, filters, and save/recovery outcomes. Offer clear scenario reset and a simulation launcher separate from clinic task UI.
- [ ] Inspect prototype reaction destinations for dangling links, accidental historical destinations, inaccessible overlays, and dead primary actions. Every primary action must reach its intended state, including error/retry/cancel branches. Confirm local Figma API support; use explicit state-frame transitions where interactive variables are unsupported.
- [ ] Run P01–P13 from their entry points and record actual results, frame IDs, and evidence. Verify duplicate prevention, wrong-patient safety, completed-transfer follow-up, directory validation, permission restrictions, and stock correction. Distinguish clicked journeys from structural link inspection; never label the latter as an executed journey.
- [ ] Capture and visually inspect every primary screen S01–S17, representative dialogs/error states, all patient identity variants, and the 1024 variants. Check clipping, labels, hierarchy, focus, contrast, status text, action visibility, component reuse, and fictional fixtures. Fix defects, then recheck only affected flows.
- [ ] Recompare historical top-level IDs/names with Task 1 baseline. Scan revised visible text and role options for forbidden scope while allowing nurse references to externally contacted doctors.
- [ ] Complete the requirement matrix: FR1–FR18 and NFR design targets → screen IDs → P journeys/checks → result/evidence. Mark real RFID, MIS import, messaging, persistence, concurrency enforcement, security, printing, and assistive-technology behavior as application verification outside this prototype.
- [ ] Deliver direct links to Read Me, foundations, component library, clinical/admin entry points, and journey launchers, plus a concise verified/remaining-limits summary. Do not claim completeness from a successful write alone.

## Plan self-review

- All specification screens S01–S17 have owners: Task 4 (S01–S07/S17), Task 5 (S08–S10), Task 6 (S13–S16/S17), Task 7 (S11–S12).
- P01–P13 are assigned to Tasks 4–7 and executed/recorded in Task 8. Additional checks cover corrections, same/different-patient input, session/concurrency recovery, and narrow desktop layouts.
- Foundations and components precede composed screens. Figma page boundaries and supported prototype capabilities are explicit execution checks, not assumed features.
- Each task supplies an observable artifact and verification result; no application code/tests, deployments, or real notifications are included.
- Open school operating decisions remain annotated fixtures and do not block representative prototype construction. Source documents and historical Figma work remain preserved.
