# LVPRMS — System Flow, Structure, and UX Specification

Version: 0.1 — design review draft  
Date: October 14, 2026  
Project: La Verdad Patient Record Management System

## 1. Purpose and approval status

Define the system's navigation, patient journeys, screen responsibilities, permissions, data relationships, and UX foundations before building the interactive Figma prototype.

**Approved in this conversation:** workflow-first navigation; clinic and administrator workspaces; RFID/manual intake; visitor handling; encounter and referral flows; notification recovery; one active encounter per patient; preservation of unsaved work.

**Proposed for this written review:** detailed screen composition, permissions below the role level, data structure, UX measurements, session recovery behavior, and prototype acceptance coverage. These are design decisions, not new claims that school stakeholders have signed off.

**Source basis:** supplied BRD v2.0.0, the user's scope corrections, the v2.1.0 revision recorded in this conversation, and the subsequent approved structure/flows. The previously linked v2.1.0 output file was unavailable in the workspace when this specification was prepared; its contents remain available in the conversation. This specification does not supersede unresolved operational decisions in the BRD.

The deliverable at this stage is a design specification. A Figma production plan follows written-spec approval. No application implementation or Figma editing has occurred at this stage.

## 2. Scope and governing rules

- Primary patients: students and faculty/staff with school IDs. Visitors are supported through local registration.
- Clinical operators: school nurse and authorized nursing assistant. Patients have no system accounts.
- Recommended administrative operator: designated MIS/ITS personnel; the actual owner remains unconfirmed.
- RFID identifies the patient and opens Log New Visit; it does not authenticate staff or save the encounter.
- MIS supplies school identity data only. Clinic assessments, encounters, and visitor records are maintained locally; no clinical writeback to MIS.
- The nurse contacts the doctor through Messenger, then records replies and actions. No physician login, doctor portal, or automated Messenger integration.
- Clearances are excluded.
- No automated clinical diagnosis, referral decision, or class-suspension recommendation.
- Release groups: R1 records/intake/access, R2 referrals/notifications/settings, R3 inventory/reports. The overall prototype may illustrate all releases, clearly annotated by release.

## 3. Navigation and application shell — approved structure

### Clinical workspace

1. **Today:** identify patients, resume active encounters, see outstanding work.
2. **Patients:** search and register patients; review identity and encounter history.
3. **Referral Follow-up:** nurse-managed external-contact and advice records.
4. **Inventory:** medicine/supply availability and stock movements.
5. **Reports:** daily logs, monthly summaries, and patient/complaint breakdowns.

Notifications are a utility accessible from Today and related encounter records, not another competing primary destination. My Account and Logout live in the account menu.

### Administrator workspace

1. **Accounts**
2. **Alert Settings**
3. **Notification Directory**
4. **MIS Import/Sync Status**

Administrative navigation does not reveal clinical pages. A person holding both permitted duties must use an explicit workspace switch; administrative access alone never grants clinical access. Whether any individual receives both duties requires school authorization.

### Shell proposal

Use a consistent left navigation on desktop, page title and breadcrumbs for subordinate pages, a compact account/notification area, and a clear active destination. Today is the clinical landing page. Accounts is the administrative landing page. Saved filter context is preserved when returning from a detail view.

## 4. Screen inventory and responsibilities — proposed detail

| ID | Screen | Main content and actions | Release |
|---|---|---|---|
| S01 | Sign In | Username/account identifier, password, show/hide password, sign in, help contact. No public sign-up. | R1 |
| S02 | Today | Start a Visit, RFID readiness, manual ID entry/name search, active encounters, pending follow-up counts, actionable notification failures, last MIS update. | R1; R2 additions |
| S03 | Patient Search | Search query, patient type filters, distinguishing identity fields, result selection, no-results guidance, Register Patient. Reused by intake. | R1 |
| S04 | Register Patient | Patient type first; minimal identity; conditional school fields; optional relevant contact; duplicate check; register and continue to visit. | R1 |
| S05 | Patient Record | Identity summary, history, relevant recorded alerts, encounter details, follow-up notes, Start Visit or Resume Active Visit. | R1 |
| S06 | Log New Visit / Active Visit | Persistent identity summary; complaint, assessment, care, next action; save ongoing, prepare follow-up, complete, cancel. Existing history accessible without losing entry. | R1; R2/R3 additions |
| S07 | Completed Visit | Readable encounter summary, outcome, author/time, follow-up/referral links, notifications, authorized correction with reason. | R1; R2 additions |
| S08 | Referral Follow-up List | Awaiting reply, advice received, prepared, and resolved filters; patient, elapsed waiting time, last contact, assigned follow-up author. | R2 |
| S09 | Referral Detail | Linked visit, reason, contact attempts, Messenger contact time, reply/advice entry, actions and outcome, print summary, resolve. | R2 |
| S10 | Notification Activity | Event/recipient/channel status, permitted message detail for clinical users, retry and manual follow-up. Filters for failed/pending. | R2 |
| S11 | Inventory | Search/category/stock state, available quantity and unit, item details, add stock, record adjustment, movement history. | R3 |
| S12 | Reports | Date range and patient-type filters, daily log, monthly totals, complaint breakdown, frequent attendance, printable view. | R3 |
| S13 | Accounts | Active/inactive users, permitted roles, add/edit, reset password, deactivate/reactivate, confirmation and audit metadata. | R1 |
| S14 | Alert Settings | Supported event, enabled state, channels, recipient groups, approved template, validation, save/cancel and change history. | R2 |
| S15 | Notification Directory | Contact role, association with section/department, phone/email, active state, add/edit/deactivate, missing-channel indicators. | R2 |
| S16 | MIS Import/Sync Status | Source availability, last success, record counts, failures/conflicts, authorized retry/import, reconciliation guidance. No clinical records. | R1 |
| S17 | My Account | Account details, password change, session/logout controls appropriate to the operator. | R1 |

Use full pages for clinical documentation and record review. Use dialogs for short confirmations or bounded actions such as a stock adjustment or account reset. Do not force a complete encounter into a modal.

### Today layout

Prioritize Start a Visit and the active-patient list. Keep summary counts compact; every count links to the relevant filtered list. Use an attention area for failed notifications and pending follow-up. Show no decorative charts above the primary clinic task.

Active encounter rows show patient name, type, identifier, arrival time, complaint, state, and Resume. An empty list explains that there are no active visits and offers Start a Visit. Clinical information remains visible only inside an authenticated clinical workspace.

### Log New Visit layout

Keep identity visible near the top. Show school ID and grade/section or department as applicable; visitor displays local patient ID. Provide recent history as a secondary panel or linked view that preserves the form.

Use four groups: Complaint, Assessment, Care Provided, Next Action. Show units beside vital signs and supply quantities. Complaint, patient, and encounter state are required for saving; outcome is additionally required for completion. Do not require every vital sign for a minor encounter.

The primary action follows the chosen next action: Save Ongoing Visit, Save for Physician Follow-up, or Complete Visit. Supporting wording states what will happen. Preparing follow-up does not claim contact has been made. Completing a visit displays the selected outcome; any resulting messages follow approved routing rather than a generic notify-everyone switch.

### Patient registration layout

Select Student, Staff, or Visitor first. Show only relevant fields. Visitors require a name and local patient identifier generated by the system; school ID, grade, and department are not mandatory. Collect additional identity/contact details only where operationally needed and approved. Do not create a visitor merely because MIS lookup failed.

A suspected duplicate presents candidate records with distinguishing information and the actions Use Existing Record or Continue Registration with a reason. Exact source-key collisions require reconciliation; they cannot be overridden by changing the person's name.

## 5. Approved intake and encounter flows

### F01 — RFID or manual school ID

Signed-in operator on Today -> scan/enter ID -> resolve verified school identity -> unique patient match -> open S06 with identity populated.

If the identity exists in the imported school dataset but has no clinical record, initialize its local patient link and open the first unsaved visit. Unknown identifiers open no-match guidance with manual search and registration. Ambiguous mappings require resolution before opening a patient-specific form.

RFID reading must not insert card values into complaint text or other focused fields. Use a dedicated scanning context/input behavior, retain manual lookup, and show whether reading is available. Hardware behavior is a dependency to verify, not something the prototype proves.

### F02 — Name lookup and visitors

Today or Patients -> search -> choose exact person -> Start Visit or Resume Active Visit. No result -> Register Patient -> choose type -> duplicate check -> save identity -> open S06.

If registration succeeds but opening/saving a visit fails, the patient remains registered and is findable; retry must not register them again.

### F03 — Ongoing care

S06 -> enter complaint/assessment/care -> Save Ongoing Visit -> persisted encounter in Today. Resume -> continue the same encounter. Resting in Clinic is a saved ongoing state.

One active encounter is permitted per patient, across users/devices. An existing active encounter offers resume rather than another new encounter. Concurrency protection must apply in the application, beyond disabling a button.

### F04 — Complete encounter

Active visit -> choose outcome -> validate required information -> save -> Completed Visit. The encounter leaves the active list and remains in history. A later actual attendance creates a new encounter.

Outcomes: Returned to Class/Work; Left Clinic after Treatment; Sent Home; Referred/Transferred to External Facility. Clinical judgment remains with authorized clinic personnel.

### F05 — Corrections

Saved encounter -> authorized correction -> reason -> validate -> save new revision and preserve previous value, author, and time. A wrong patient association requires a dedicated audited correction, not editing the patient's identity to fit the visit. Existing referral, inventory, and notification effects must be reconciled explicitly; previously sent messages cannot be treated as unsent.

### F06 — Repeated scan or patient switching

Same patient -> resume draft/active visit. Different patient while unsaved work exists -> display Save and Switch, Discard and Switch, and Stay. If required information prevents saving, explain it and remain on the current form. Never replace the draft silently.

## 6. Encounter and referral state model

Encounter states: **In Progress**, **Resting in Clinic**, **Awaiting Doctor Reply**, **Completed**.

Referral states: **Prepared**, **Awaiting Doctor Reply**, **Advice Received**, **Resolved**. A reasoned closure without a reply is a resolution subtype, not a fabricated Advice Received event.

- Saving a prepared referral keeps the encounter In Progress or Resting until contact actually occurs.
- Recording Messenger contact moves the referral and active encounter to Awaiting Doctor Reply.
- Recording advice moves the referral to Advice Received and the active encounter to In Progress or Resting, selected by the nurse.
- Recording completed actions resolves the referral; the encounter is completed separately with its outcome.
- An external transfer can complete an encounter while a referral follow-up remains pending. Show the completed encounter outcome alongside the still-pending follow-up in S09; do not put the patient back in the active-clinic list.
- Referral actions cannot reopen a completed encounter silently.
- A resolved referral keeps the full contact/advice history. A new follow-up request is a distinct referral record linked to the encounter.

Waiting-time displays are informational; they do not determine clinical severity or automatically instruct treatment.

## 7. Referral flow — approved behavior with screen detail

S06 -> Save for Physician Follow-up -> S09 Prepared -> nurse sends Messenger message externally -> Log Contact -> Awaiting Doctor Reply -> Log Reply/Advice -> Advice Received -> record actions -> Resolve.

Contact entries include doctor/contact name, actual channel, timestamp, author, and concise relevant notes. Messenger is the primary channel. Log advice as relayed by the nurse; do not display a digital physician signature or in-system physician approval.

A prepared summary is printable where needed. The printed output identifies its source and the staff member who prepared it. No prescription-image upload or Messenger inbox is introduced.

## 8. Notification flow

Saved eligible event -> approved rule and directory lookup -> notification attempt -> Pending / Sent / Failed / Missing Contact / Disabled by Rule.

Sent means the sending service accepted the attempt unless it supplies a stronger delivery status. Read receipt is not assumed. Retrying an unresolved attempt does not generate a second unrelated event. An operator records manual follow-up separately, preserving failed-attempt history.

Notification settings support event, patient type, recipient group, channel, and approved template. Student adviser and staff department routing are conditional. Visitor routing requires an explicitly recorded applicable contact; there is no invented adviser/department.

Rule changes apply prospectively. They do not resend historical events automatically. Preview a changed rule using fictional sample data; any live test-send workflow requires a deliberately chosen test recipient and is outside the initial prototype scope.

Exact notification triggers, contact disclosure rules, ordinary discharge notifications, and SMS/email budget remain school decisions. Prototype examples are labeled sample configurations rather than approved operating policy.

## 9. Roles and permissions

| Capability | Nurse | Nursing assistant | Administrator |
|---|---|---|---|
| Identify/register patient and review clinical history | Yes | Authorized scope | No |
| Save visit documentation | Yes | Authorized scope | No |
| Determine need for physician advice and record clinical decisions | Yes | Only where separately authorized by clinic policy | No |
| Document contact/advice | Yes | Only where authorized; author is always identified | No |
| Complete/correct encounter | Yes | Authorized scope; correction audit required | No |
| View clinical notification activity/retry | Yes | Authorized scope | No clinical message contents |
| Inventory operations/reports | Authorized clinic duties | Authorized clinic duties | No clinical reports |
| Manage operator accounts and resets | No by default | No by default | Yes |
| Configure alerts and recipient directory | No by default | No by default | Yes |
| Inspect MIS update health and approved import/retry | Summary only | Summary only | Yes; school identity metadata only |
| Change own password/logout | Yes | Yes | Yes |

Technical ownership does not automatically grant clinical authority. Clinical users may flag incorrect routing/contact information; the assigned administrator makes the directory change. Detailed assistant permissions and administrator assignment require school confirmation.

## 10. Data structure and boundaries

| Record | Main information | Relationships and boundary |
|---|---|---|
| Patient | Stable local ID, name, type, active status | One patient has many encounters. Visitors exist without MIS links. |
| School Identity | Source identifier, school ID, type, grade/section or department, source update time | Verified link to one local patient. MIS owns imported identity fields. Preserve changes without rewriting past clinical entries. |
| RFID Mapping | Card value, school identity link, active/replaced status | Active mapping resolves uniquely. Multiple cards, if permitted, still resolve to the same identity; duplicates across identities are rejected. |
| Encounter | Patient link, start time, complaint, assessment, vitals, state, outcome, author | At most one active encounter per patient; many historical encounters. Store applicable identity context for accurate historical reports. |
| Referral | Encounter link, reason, destination/contact, status | One encounter may have multiple distinct referral requests over its history. |
| Referral Activity | Contact/reply/action type, time, recorded-by, notes | Append to referral history; corrections remain attributable. |
| Stock Item / Movement | Item/unit, quantity change, reason, time | Supply use links to an encounter and a movement. Retrying a save cannot deduct twice. |
| Notification Event / Attempt | Event identity, applicable rule, recipient/channel, attempt status/time | Multiple attempts can belong to one event; retry and duplicate prevention operate here. Clinical payload restricted. |
| Directory Contact / Routing Rule | Role, school association, phone/email, active state; event/channel/template | Managed independently of patient identity import. Changes audited. |
| Operator Account / Role | Identity, permitted capabilities, credential state | Separate from patients and school IDs. Never created solely because someone appears in MIS. |
| Audit Entry / Sync Run | Actor, action, time, record reference; run state/counts/conflicts | Support correction history and integration accountability without exposing charts to Admin. |

Data flow: MIS -> school identity cache -> verified patient link -> encounter -> referral / recorded supply use / configured notification events -> clinical history and authorized reports. Visitor records enter locally. Account and directory configuration are separate administrative inputs.

## 11. Failure handling and recovery

| Condition | Required interface behavior |
|---|---|
| Search/loading | Indicate progress; prevent duplicate submission; retain the query. Distinguish no results from lookup failure. |
| RFID disconnected/unavailable | Explain manual alternatives; do not block name/ID lookup. |
| Unknown/ambiguous ID | Explain the issue and provide lookup/reconciliation path without selecting an arbitrary patient. |
| Form validation error | Show summary plus field-level explanations; move focus to the first error; retain values. |
| Save failure | Retain visible inputs, show that saving failed, and offer retry. Never show success before confirmation. |
| Concurrent edits | Warn that a newer version exists; preserve the operator's entry and require reconciliation before overwriting. |
| MIS unavailable | Display last success and stale-data notice; use available local data; do not erase existing identities. |
| Missing recipient/gateway failure | Preserve the visit; show manual follow-up/retry. |
| Session nearing expiry | Warn with time to extend where policy permits; protect work before expiry. |
| Session expired | Conceal patient content and require authentication. Recover only protected saved drafts associated with that operator and permitted encounter; do not promise recovery of unpersisted text. |
| System unavailable | Explain the clinic downtime procedure; later reconciliation is explicit and attributable. |

Proposed draft policy: edited forms show Unsaved Changes until server-confirmed Save Ongoing Visit. No background storage of clinical text in the browser is assumed. A saved ongoing visit can be resumed after sign-in; unsaved text may be lost on browser closure, and the interface states that plainly. Session-recovery behavior must be tested in the application; Figma demonstrates only its screens.

## 12. UX foundations and accessibility targets — proposed

Target a desktop clinic workflow; use a 1440-pixel reference frame and check a 1024-pixel layout. These are design choices, not known clinic-device specifications. Keep the main form in a readable column, collapse secondary history into a separate panel on narrower widths, and avoid placing essential actions outside the viewport. Provide responsive notes rather than assuming a 1440-only product.

### Visual foundation

- Use a readable sans-serif family already available in the target Figma environment; choose the final family during design setup.
- Proposed body size 16 px; secondary text 14 px; headings approximately 20/24/32 px. Use a consistent hierarchy and sufficient line height.
- Base spacing scale: 4, 8, 12, 16, 24, 32, 48 px. Use spacing and alignment before adding borders or cards.
- Use a neutral surface palette, one primary action color, and semantic information/success/warning/error colors. Exact colors are chosen after contrast verification.
- Prefer 44 px comfortable control heights. This is a project usability choice, not a claim that all WCAG AA targets require 44 px.
- Give a page/action region one clear primary action. Separate destructive actions and state their consequences.
- Status always combines text with color/icon; a color badge alone is insufficient.

### Accessibility requirements

Use WCAG 2.2 AA as the implementation target. Include normal-text contrast of at least 4.5:1 and large-text contrast of at least 3:1; applicable control boundaries and state indicators need sufficient non-text contrast. Support keyboard use, visible unobscured focus, meaningful labels, error identification, accessible status feedback, and minimum target-size/spacing requirements with their applicable exceptions.

Keep labels visible above fields rather than relying on placeholders. Explain units and required fields in text. Avoid hover-only actions. Dialogs have titles, deliberate focus order, and return focus to the initiating action. A warning must explain a recovery action, not simply display an error code.

Reference: [W3C — How to Meet WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/), reviewed October 14, 2026. Design measurements support these goals but do not by themselves demonstrate full conformance; implemented keyboard, assistive-technology, zoom, and reflow behavior must be tested.

### Reusable components

App shell; navigation item; page header; patient identity strip; lookup control; labeled field; select/combobox; vital-sign input with unit; complaint selector; encounter row; status badge; button/link; alert banner; empty/loading state; table/filter bar; confirmation dialog; referral activity timeline; notification attempt row; audit entry.

Define relevant default, hover, focus, pressed, disabled, loading, selected, and error variants. Avoid creating unused permutations. Components use semantic typography/color/spacing tokens and reusable state patterns in Figma.

## 13. Figma organization and prototype scope — proposal

Prefer a clearly named new design page within the existing LVCC Clinic System file so the approved blueprint can be compared with the earlier screens. This location is a proposal for the implementation plan, not an edit performed now.

Suggested file sections/pages: 00 Read Me and Scope; 01 Foundations; 02 Components; 03 Clinic Workspace; 04 Administration; 05 Prototype Journeys and QA. If editing the existing file, preserve existing material and place new sections distinctly.

Build meaningful interactions for patient lookup, conditional patient-type fields, encounter actions, referral transitions, settings save/cancel, validation, confirmations, and back navigation. Prototype fixture controls simulate RFID matches and failures clearly; do not imply a Figma prototype connects to real RFID hardware, MIS, SMS, or Messenger.

Use fictional patient/contact data. Trace every primary screen and journey to BRD requirements. Record release tags and unresolved assumptions in design notes, not in the clinic user's ordinary interface.

### Required prototype journeys

| ID | Journey and expected outcome | Coverage |
|---|---|---|
| P01 | Student scan -> populated form -> review history -> select complaint/Other -> record vitals -> ongoing save -> resume -> complete | FR1, FR4, FR5, FR6, FR7, FR8, FR9 |
| P02 | Staff manual ID -> staff context -> completed visit | FR1–FR2, FR5 |
| P03 | Visitor lookup -> registration -> visit -> later reuse | FR3–FR5 |
| P04 | Unknown/ambiguous identifier -> manual recovery | FR1–FR3 |
| P05 | Same-patient rescan and different-patient scan with unsaved work | FR1, FR6 |
| P06 | Prepare follow-up -> record Messenger contact -> awaiting reply -> record advice -> resolve | FR10 |
| P07 | Transfer completed while follow-up remains pending | FR5, FR10 |
| P08 | Failed/missing-recipient notification -> retry or manual follow-up | FR11–FR12 |
| P09 | Account add/edit/reset/deactivation -> restricted clinical access | FR15–FR16 |
| P10 | Edit alert rule/contact -> validate -> save or cancel | FR17–FR18 |
| P11 | MIS update failure/conflict -> available-data guidance | FR2, NFR6 |
| P12 | Supply use -> inventory movement -> report filter | FR13–FR14 |
| P13 | Validation/save failure and expired session -> documented recovery | FR7, FR16, NFR1/NFR5 |

## 14. Review and acceptance

Review the written design for navigation consistency, patient identity visibility, saving versus completion, status synchronization, permission boundaries, and recovery. Verify all primary prototype actions have intentional destinations; no doctor-role or clearance screens are introduced.

Prototype review checks layout, labels, visible states, interactions, and representative journeys. Application acceptance must additionally verify real hardware, data imports, persistence, concurrency, account enforcement, message delivery, stock integrity, and accessibility behavior. These tests have not been executed by writing this specification.

Before implementation planning, obtain written-spec approval. Then create a separate execution plan identifying Figma tasks, ordering, verification, and the user's selected execution method. This document is not that execution plan.

## 15. Open operational decisions carried forward

- Name the administrator and backup; confirm detailed nursing-assistant permissions.
- Confirm MIS interface/fields, source keys, sync interval, and identity/RFID mapping owner.
- Confirm RFID equipment and actual clinic display/device dimensions.
- Confirm notification events, recipient directory ownership, message content, gateways, and funding.
- Confirm referral escalation procedure and printed summary content.
- Confirm final vitals, complaint list, report audience, historical migration, hosting, retention, and recovery targets.

These do not prevent designing representative screens. They remain explicit assumptions in prototype fixtures and require school agreement before production use.

## 16. Self-review record

- Structure and user journeys align with the decisions approved in this conversation.
- Encounter and referral progress are separate; completed transfers may retain pending follow-up without reopening a clinic encounter.
- Save, completion, notification, and stock effects are distinguished; repeated input must not duplicate them.
- Visitor records do not depend on MIS or school-only fields.
- Administrative settings do not grant access to clinical records.
- Session recovery does not promise unsaved-data recovery without a persistence design.
- Screen details, data structure, and UX foundations remain proposed until written-spec review.
- No product code, Figma changes, production integrations, or completed acceptance tests are claimed.


## Frontend meeting revision status — 19 October 2026

The project owner authorized a staged frontend revision sequence: see [active task sequence](superpowers/plans/2026-10-19-frontend-meeting-revisions.md) and [change register](change-requests/2026-10-18.md). This note describes the working frontend and does not establish client approval of a revised BRD baseline.

Implemented Revision1: Today shows an ID-shaped scan hero, ID scanned/ID not found feedback and automatic visit/registration navigation. Unknown identifiers are carried to registration without creating a patient; ambiguous IDs require selection. Manual school-ID and name lookup remain available. A scan alone does not save an encounter, discharge, deduct stock or send email.

Confirmed but not implemented in Revision1: second tap opens a quick discharge confirmation; actual transfer checks out the patient, while messaging a doctor for advice does not. Department-led registration/incomplete records, editing/limits, discharge, transfer and account polish follow as separate reviewable tasks. Desktop1440x960 only.

### Revision 2 frontend checkpoint

Department replaces manual patient-type selection. Higher ed/Basic ed infer Student; Staff or school-ID-only infer Staff; explicit No school department with no entered school identifiers yields Visitor. An unknown card alone is unclassified. Student identity/education fields must be provided to save; missing emergency name/number permits an incomplete save. Personal contact and relationship are optional.

Patient lists/records show completion status and missing details. Edit details completes the same patient and preserves authored before/after history, school mappings and clinical history. School-managed identity stays read-only; local school lookup is a fictional identity-only demonstration. No backend, MIS connection, phone/tablet work or production authorization is claimed. See superpowers/qa/2026-10-19-meeting-revision2-desktop.md.

### Revision 3 frontend checkpoint

Patient details edits, existing follow-up-note edits and visit correction entry first confirm the selected patient using a unique matching RFID, school ID or local Patient ID. Confirmation is temporary, makes no clinical write and does not replace the active operator session required on save. Visitor records support local Patient ID confirmation. New notes and ongoing care keep their existing quick entry flow.

All note textareas now share a configurable 2,000-character prototype limit, counters and blank/over-limit validation. Over-limit pasted or legacy text is retained rather than truncated; explicit corrections preserve the full previous text and original author/time. Unsaved-note navigation warns; only one note editor is active at a time. Backend parity and production permissions remain deferred. Desktop1440x960 only. See superpowers/qa/2026-10-19-meeting-revision3-desktop.md; Revision4 is not started.

### Revision 4 frontend checkpoint

Quick visit entry now groups complaint/state and optional medicine/supply quantities. Empty vitals/assessment/treatment sections are collapsed, while saved details stay visible. Arrival time uses the draft’s creation time and the saving operator is retained as clinical author. Saving care and completing care remain separate, explicit actions.

Today scan → unique patient with saved active visit → Discharge patient confirmation. No active visit → unsaved form/draft. Unknown → registration; ambiguous → explicit recovery. No scan alone changes encounter state. Outcome is required; optional final notes retain the shared limit/counter. Keep in clinic/Escape make no write. Confirm discharge creates one completed encounter and pending nurse summary, with status/view link. Duplicate scans and implicit submits cannot confirm. Manual Discharge on Today supports patients without cards. Unsaved care blocks quick completion and offers review; stale/failed saves preserve entered values. Referral follow-up remains open and inventory unchanged. See superpowers/qa/2026-10-19-meeting-revision4-desktop.md. Frontend only, desktop1440x960; stop before Revision5.

### Revision 5 frontend checkpoint

Record contact, reply, ordinary action and resolution update referral history only. The patient remains active until explicit visit completion or actual-transfer checkout. The referral shows clinic/checkout status separately from follow-up status, with secondary log actions grouped under Other follow-up actions.

Record actual transfer → destination facility + optional notes + actual-departure confirmation → Confirm transfer and checkout. Transfer time/operator are captured at confirmation. A doctor reply is not required for urgent transfer. In one local storage commit, the saved visit completes as Referred to an external facility, the referral gains an authored transfer activity and one pending simulated nurse summary includes the destination. The referral state stays unchanged. Unsaved care requires review first; stale/failed saves preserve entered values. Duplicate requests cannot create a second checkout/email. Previously completed encounters are not rewritten as new transfers.

The transferred patient leaves Today’s active list; pending follow-up remains available for late reply, care action and resolution. These operations never reopen the completed encounter or rewrite the original summary/attempts. Print summary includes the transfer and subsequent authored activities. See superpowers/qa/2026-10-19-meeting-revision5-desktop.md. Frontend only, desktop1440x960; stop before Revision6.

### Revision 6 frontend checkpoint

My account → read-only username + Change password. No username-edit action or administrator workspace is introduced. Current, new and confirmation fields start masked with individual keyboard-operable Show/Hide eye controls; login uses the same control. Submit re-masks values. Failed validation retains entries and focuses the relevant field; success clears/re-masks fields. Current password, eight-character minimum, nonblank/different new password and matching confirmation are required. Recheck operator/session before applying an asynchronous change. Demo password changes remain in memory and reset on reload; the UI explains this limit.

Today shares patient-description formatting with records/visits, including higher-ed program/year. The old unknown-card recovery route uses current registration wording and name search. Unlinked referrals state Visit not linked instead of asserting active care. Desktop checks cover Today, Patients, Referrals, Messages, account, session expiry, search-empty recovery and honest deferred Inventory/Reports pages. See superpowers/qa/2026-10-19-meeting-revision6-desktop.md. Frontend only, desktop1440x960; stop before inventory/reports. No backend, production RBAC or phone/tablet acceptance claimed.

### Task 6 frontend checkpoint

Inventory → search/all/low stock → Open stock history → Add stock or Adjust stock. Addition records incoming quantity; adjustment records the counted final balance. Both require a reason, use item-specific quantity steps and preserve actor/time/running balance. Failed/stale writes retain entered work; navigation offers Keep editing/Discard changes. Existing visits establish a usage baseline at activation without retroactive deductions. New saved care deducts once; corrections reconcile only changes, including returns. Insufficient stock rejects the entire save. Discharge/transfer cannot deduct the same care twice.

Reports → date range, patient type and complaint → Apply filters or Print daily log. Monthly, complaint and frequent-patient reports provide the same filters and standalone printing. Counts come from saved ongoing/completed encounters, never drafts; inclusive dates use Philippine arrival date. Patient groups use current patient records; visitor rows have no school fields. Frequent patients ranks all matching patients by visit count. Print / Save PDF uses the browser and hides controls/navigation; multipage tables repeat their headers. Initial daily range is today; other reports start at the current month.

Task6 supersedes earlier deferred Inventory/Reports pages. Frontend only, desktop1440x960. See superpowers/qa/2026-10-19-task6-desktop.md. No backend or phone/tablet work; stop after this checkpoint.
