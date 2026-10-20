# La Verdad Clinic

An incremental frontend prototype of **Clinic app · Responsive**, using plain HTML, CSS and native JavaScript modules. No framework, dependencies, install command or build step.

## Run

Open this folder in VS Code and run in its terminal:

```powershell
npm run dev
```

Ctrl+click the **Local** link printed in the terminal. The server starts at port 4174 and tries the next port automatically if it is busy. Press Ctrl+C to stop. No `npm install` is needed; Node.js and npm are the only prerequisites. `npm start` runs the same server. Choose a starting port with `npm run dev -- 4300` if needed.

The small Node server serves only public application files on loopback. Use HTTP rather than opening `index.html` directly, because browser modules require an HTTP origin. Refresh the browser after editing files. Browser data is specific to each port, so a different port starts with its own fictional records and session.

## Sharing with teammates

Commit the application (`index.html`, `css/`, `js/`, `assets/`), `scripts/`, `package.json`, `tests/`, `.gitignore`, this README and the project documentation. Keep the font license in `assets/fonts/OFL.txt`. Tests and documentation do not run with the app, but help teammates verify changes and follow the requirements. The current readable BRD is [docs/LVPRMS_BRD.pdf](docs/LVPRMS_BRD.pdf); its editable source is [docs/BRD.md](docs/BRD.md).

`.gitignore` excludes local agent progress, `tmp/`, generated `output/` exports, historical Figma helper scripts/inspection data, dependencies, logs and `.env` secrets. These files remain on your computer. The Figma screen inventory and route map stay in Git because the tests and implementation reference them.

After cloning or downloading the repository, teammates open the project folder in VS Code and run `npm run dev`. They can run `npm test` for the automated checks. No dependency installation is needed. Each browser starts with fictional sample records; your browser's saved records and session are not included in Git.

## Current preview: Tasks 1–7 and meeting revisions 1–6 (desktop)

Implemented: sign-in, session guard, sign-out, 15-minute inactivity expiry, My account/password-change simulation, desktop navigation, Today overview, versioned fictional-data storage and recovery feedback. Phone/tablet layouts remain deferred and unverified.

Patient intake supports automatic keyboard-wedge ID scanning on Today, partial-name search, category filters, duplicate-aware registration, patient history/date/complaint filters and authored follow-up notes. Visitors require no school fields. Scans open or resume patient-specific work without creating a completed visit, message or stock movement.

The October 18 meeting revisions have a separate [frontend task sequence](docs/superpowers/plans/2026-10-19-frontend-meeting-revisions.md) and [change register](docs/change-requests/2026-10-18.md). Today shows an ID-shaped scan hero with waiting/found/not-found feedback and automatic routing. The October 19 simplification removes manual ID fields and Continue/Find patient controls; only Search by name and Register patient remain in the scan panel. A keyboard-wedge reader sends the identifier as a fast key burst followed by Enter while Today is open. No input focus or button press is required. Typing in a form or modal is ignored by the scan listener. The browser must be focused; serial/WebUSB readers need a future adapter. Physical reader compatibility has not been verified; QA uses simulated reader keystrokes.

An unknown card opens registration with its scanned RFID retained. Saving a school patient links that card in the local demo mapping; the next scan finds the record. Duplicate input is guarded; ambiguous matches require selection. A known patient without a saved active visit opens an unsaved visit or resumes its draft. Scanning a patient with a saved active visit now opens the Revision 4 quick discharge confirmation. Scans alone never save encounters, discharge patients, deduct stock or send email. The [automatic-scan checkpoint](docs/superpowers/qa/2026-10-19-automatic-scan-desktop.md) describes the historical flow before Revision 4.

Registration now uses Department rather than a patient-type picker: Higher ed/Basic ed infer Student; Staff or a school ID without a department infer Staff. Explicit No school department identifies a Visitor. Blank data or an unknown RFID alone stays unclassified; a visitor cannot be saved with a school identifier still entered. Faculty belongs to Staff. Student saves require full name, school ID, RFID, and either program/year or grade/section. Searchable education suggestions are local demonstration choices: BSIS, years 1–4, grades 1–12 (including 11–12), and sample/recorded sections. They are not an authoritative school catalog.

Emergency contact name and number are needed for Record complete, but missing emergency details do not block a save. Personal contact and relationship are optional. Non-empty phone numbers accept common separators and 7–15 digits; malformed numbers are rejected without truncation. Patients and patient records show Record incomplete/complete and the details to finish. Edit details updates the same patient, retains authored before/after history, and preserves clinical notes, visits, drafts and email snapshots. School-managed identity fields remain read-only while contact details can be completed. Manually registered identity changes remain provisional and are checked for duplicate IDs/RFIDs.

Find school record searches fictional local identity records only; it does not connect to MIS or supply clinical contact data. Try `DEMO-3001` to populate the fictional higher-ed record. Existing clinic matches offer the existing record rather than creating duplicates. Registration and its initial visit draft are saved together. Unsaved profile changes are kept only in the open tab; Keep editing/Discard changes guards navigation, and failed/stale saves retain inputs. Refresh does not restore an unsaved profile form.

Visit care now includes the BRD complaint choices and Other, optional assessment, temperature/pulse/blood pressure, treatment, and supplies with quantities. Only the patient, complaint and encounter state are required for an ongoing save. Save visit and Complete visit are separate actions; completion requires one of four outcomes and explains the nurse email first. Continue care returns from completion without closing the encounter.

Revision 4 streamlines quick entry to complaint, encounter state (In progress by default) and optional medicine/supply quantities. Vitals/assessment and treatment notes are collapsed when empty and expanded when saved values exist. Arrival time comes from the local arrival draft, falling back to save time; the saving operator remains the clinical author. The visit supply selector uses the fictional inventory catalog described below. It records quantities without dosage advice; Task 6 now reconciles stock when care is saved.

A second tap for a saved active encounter opens **Discharge patient?**, showing patient/complaint, a required outcome, optional final notes and the nurse-email explanation. Today’s in-clinic rows provide **Discharge** as the card-free fallback, including visitors. **Keep in clinic** receives focus; Cancel/Escape and duplicate scans do not complete care. Only **Confirm discharge** performs completion. Unsaved care must be reviewed and saved/discarded first; stale/failed writes preserve entered values. Completion creates one pending simulated summary and offers View in Messages; it does not resolve referral follow-up. Actual-transfer workflow simplification remains Revision 5. See the [Revision 4 QA checkpoint](docs/superpowers/qa/2026-10-19-meeting-revision4-desktop.md).

A successful completion stores exactly one pending nurse-summary snapshot. Messages provides status filters, the complete saved email, visit links, sending attempts and authored manual follow-up. The local simulator returns Pending, Sent, Failed or Missing recipient; Sent means simulated acceptance only. No real email is sent. Retry updates the original event, and checking a pending result reuses its attempt. Corrections never rewrite or resend the original summary. Failed email leaves the completed visit saved. Task 6 now deducts saved supply use once and applies only the difference on later corrections. Completed visits leave Today and remain in patient history. A later attendance starts a separate visit.

Open `/demo.html` on the same local server for the separate [demo simulator](demo.html). Choose accepted, failed or pending email results, or clear the fictional nurse address to exercise Missing recipient. Settings affect subsequent processing; refresh an existing message and use Check status or Retry message. Only `example.com` recipients are accepted by the simulation. The original minimal adviser example remains separate from clinical nurse summaries and is never sent automatically.

The simulator also offers storage-save failure/recovery, current-tab session expiry, a fictional section update and confirmed fictional-data reset. These controls do not appear in clinical screens. For the existing school-import/card-conflict simulator, use the intake simulator below. Demo data and settings belong to the browser origin: use the same hostname and port for the clinic and simulator. Restart `npm run dev` after a server-script update so `/demo.html` is served.

Correct visit requires a reason, retains earlier clinical versions and their authors/timestamps, keeps patient identity fixed, and preserves the original email snapshot. Failed or stale saves keep form entries and do not partially save records or create email events. Separate per-patient drafts support Save and switch, Keep editing, and Discard and switch.

Referral follow-up is now available from a saved visit using Prepare referral (or View referral when one is open). Preparing records a reason and optional doctor/destination and notes; it does not contact anyone. In Referrals, filter the list by Prepared, Awaiting doctor reply, Advice received or Resolved. Record actual Messenger contact outside LVPRMS, then enter the contact result and Philippine date/time. An unsuccessful contact attempt stays Prepared; a sent message changes the referral to Awaiting doctor reply.

Record doctor’s reply requires the source doctor, reply time, relayed advice and planned next action. **Record action** logs ordinary care; **Record actual transfer** is a separate action. The referral prominently shows whether the patient is still in clinic or has been transferred. Contact/reply/action and resolution retain authored history and never complete or reopen the encounter. Additional contact attempts, ordinary actions and resolution are grouped under Other follow-up actions to keep the common next step clear.

Revision 5: after the patient actually leaves for another facility, choose Record actual transfer, enter the destination facility and confirm actual departure. Optional transfer notes use the shared 2,000-character limit. The explicit **Confirm transfer and checkout** action records the time/operator, completes the same visit as Referred to an external facility, appends the transfer to the referral log and queues one pending simulated nurse summary containing the destination. No message is sent to the doctor by LVPRMS. A doctor reply is not required for an urgent transfer; the referral retains its existing follow-up state. Dirty care must be reviewed first; failed/stale saves retain entries. Duplicate requests cannot check out or queue email twice.

After checkout, the patient leaves Today’s active list while the referral remains available for late replies, actions and resolution. These updates preserve the original visit/email snapshot. Existing completed visits are not silently rewritten or transferred again. Print summary includes the recorded transfer and subsequent activity. See the [Revision 5 QA checkpoint](docs/superpowers/qa/2026-10-19-meeting-revision5-desktop.md).

Revision 6: My account supports password changes only. Username is read-only and directs username requests to school support. Sign-in and all three account password fields have eye controls with Show/Hide labels, keyboard operation and default masking. Submitting a password form re-masks values; failed validation retains entries and focuses the relevant field. Successful changes clear and re-mask the fields without altering clinic records or username. Password changes require the correct current password, at least eight characters (not spaces only), a different new password and matching confirmation. The active operator is checked again after asynchronous validation.

The consistency pass uses shared patient descriptions on Today, so higher-ed students show program/year rather than undefined grade/section. The historical unknown-card route uses current department-led registration wording. Unlinked referrals show Visit not linked and recovery rather than claiming the patient is in clinic. Main nurse routes, search-empty recovery and deferred Inventory/Reports pages were verified at1440×960. See the [Revision 6 QA checkpoint](docs/superpowers/qa/2026-10-19-meeting-revision6-desktop.md). Task 6 below supersedes the previously deferred Inventory/Reports pages.

Fresh fictional data includes the Figma student/staff referral examples. Existing browser data is kept. An older unlinked referral shows recovery guidance; it is never silently linked to a later encounter or given invented clinical history. New referral drafts remain unsaved in the open form; leaving asks whether to keep editing or discard. Stale or failed saves preserve entries. A full refresh does not restore an unsaved referral form.

**Current layout scope: desktop only, verified at 1440 × 960.** Full responsive layouts under **BRD NFR1/AC20 are deferred and not yet implemented for the new visit, Messages and referral workflows**. Earlier prototype breakpoint CSS remains, but phone/tablet layouts were not built or verified for Tasks 3–7. New form groups use flexible grid/flex sizing so responsive work can follow.

Card examples: `RFID-1001` / school ID `2026-001` for Mara; `RFID-1002` / `2026-102` for Leo. Identification resumes an unsaved draft; a saved active visit opens the quick discharge confirmation. It never discharges automatically. Name-search results always require explicit selection.

The separate [intake simulator](assets/intake-simulator.html) exercises one-way school identity updates and ambiguous cards. Open it in the same signed-in tab. Its default update rotates Mara’s card to `RFID-NEW`; its ambiguous example uses `RFID-SHARED`. It updates identity fields only and reports conflicts; it sends no clinical data and creates no operator accounts. Simulation controls never appear in ordinary clinic screens.

A school ID matching a provisional clinic record is reported for identity reconciliation, rather than automatically relabeling the patient and their history. Conflicting records remain unchanged; this preview does not provide a patient-merge tool.

Fictional demonstration accounts:

| Username | Password | Operator |
|---|---|---|
| `elena.lim` | `clinic-demo` | School nurse |
| `nina.reyes` | `clinic-demo` | Nursing assistant |

Use only these disposable values. No password is persisted. A simulated password change works for subsequent sign-ins in the same open page; reloading resets the demonstration password to `clinic-demo`. Only an in-memory demonstration digest is retained until reload. This is not secure authentication or a production password service.

## Tests

```powershell
npm test
```

`package.json` declares `type:module`, so tests import the same `.js` modules used by the browser. Tests need a current Node runtime with Web Crypto and structuredClone (verified with Node 24). No dependencies need installation. The server test checks automatic recovery from a busy port and keeps private project files inaccessible over HTTP.

## Inventory and reports — Task 6

Inventory supports live search, All items/Low stock, stock additions, counted-stock adjustments and authored movement history with reasons and running balances. A visit save deducts its supply use in the same local commit. Re-saving or completing that visit does not deduct again; correcting quantities applies only the difference. Insufficient stock, stale revisions and failed storage leave all saved records unchanged. Unsaved scans and visit drafts do not affect stock. Actual transfer and quick discharge use the same reconciliation rules.

On the first authenticated opening after this update, existing visits and supplies become the usage baseline without retroactive deduction or clinical changes. Opening counts represent stock remaining at activation. Existing inventory is retained; an empty catalog receives six fictional items: gauze, alcohol, cotton balls, paracetamol, adhesive bandage and saline. Their balances, low-stock thresholds and quantity steps are demo settings, not verified clinic counts. Alcohol permits steps of 0.1 bottle; the other sample items use whole units. Nurses can add or correct counts with a required reason (2,000-character limit). Catalog/unit/threshold administration is outside this task.

Reports provide date-range, patient-category and complaint filters; the daily patient log; monthly/type totals; student grade/section or program/year and staff-department breakdowns; complaint counts; and patients ranked by visit count. Saved ongoing and completed encounters count once each; drafts do not count. Inclusive date filters use arrival date in Philippine time. Categories and education/department groups use the current patient record. Visitors do not acquire school fields. Frequent patients lists all matching patients, including one-visit patients, ordered by count. Daily reports initially show today; other reports initially show the current month. Set a range to review older sample visits.

Print daily log/Print report uses the currently entered filters. The standalone preview offers Print / Save PDF through the browser, removing navigation, forms and record-opening controls in print. No PDF service, database or backend was added. See the [Task 6 desktop QA checkpoint](docs/superpowers/qa/2026-10-19-task6-desktop.md): 137 Node tests, 11 browser checks at 1440×960 and single/multiple-page A4 print verification. Responsive layouts (BRD NFR1/AC20) remain deferred and not yet implemented; no phone/tablet verification was performed. Task 7 verification follows below; backend and responsive work still require separate approval.

## Final desktop checkpoint — 20 October 2026

Task 7 is complete within the approved **frontend-only, 1440×960** scope. `npm test`: **139 passed, 0 failed**. Final native Playwright/Edge checks: **86 passed across nine suites**, including a sweep of 12 nurse routes; zero recorded page/console errors. Browser plugin was unavailable. Static verification checked 37 JavaScript/server modules and 17 nonempty local asset files, with no temporary Figma or remote asset references in shipped code. Print checks retained a three-row A4 log on one page and a 63-row stress log on nine pages with repeated headers and the final record present. No backend, phone/tablet or production acceptance claim is made.

Final fixes: simulated school updates now replace obsolete department/education fields, so a later contact-only edit cannot restore the prior category. Messages manual follow-up warns before navigation/browser exit; status retry/check cannot clear entered text. Save retains the authored note; Cancel/Discard explicitly drops the draft, which is not persisted across reload. Password eye controls use the shared 44px target. All fixes were reproduced before being changed; the school-data regressions are retained in `tests/final-workflow.test.mjs`.

| BRD checks | Frontend verification and remaining boundary |
| --- | --- |
| AC1–AC6, AC15 | Automatic known/unknown scan, category filters, registration, visitors and separate patient drafts tested. Meeting changes supersede manual Today ID fields and require confirmation for second-tap checkout. Actual hardware is unverified. |
| AC7 | Local school-update simulation, identity conflicts and clinical-data preservation tested; no MIS connection. |
| AC8, AC13 | Nurse referral contact/reply/actions/resolution, actual-transfer checkout and excluded role/module menus checked. No Messenger integration. |
| AC9–AC10, AC16–AC19, AC22 | Completion snapshots, duplicate prevention, pending/failed/missing recipient, retry and manual follow-up tested using the local simulator. Other-recipient notification policy and real delivery remain unverified. |
| AC11 | Administration remains deferred. |
| AC12, AC21 | Sign-out, session expiry and password-only account controls tested. This does not establish secure authentication, account deactivation or production RBAC. |
| AC14 | Saved supply deduction/correction, insufficient-stock rejection and filtered/printed reports tested. Opening quantities remain fictional demo counts. |
| AC20 | Desktop styling, labels, keyboard/focus, visible assets and navigation checked against representative desktop Figma frames. Phone/tablet (NFR1/AC20) remain deferred and not yet implemented; this is not full WCAG certification. |
| AC23–AC24 | Distinct complaint/date filters, note edit/cancel, blank/limit/stale/failed-save protection, original attribution and edit history tested. |

Evidence is local and not required to run the app: `C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-task7/verification-summary.json`. That folder contains browser runners/results and desktop screenshots; they are deliberately outside committed application source. Tests used isolated browser contexts on port 4316, not the usual port 4174 records. Launch, demo accounts, storage recovery and simulation limits are documented above. No dependencies were added, and no commit or push was made. Stopped after Task 7 for review.

## Storage and concurrency

Fictional records are stored in localStorage key `lvcc.clinic.v1`; the simulated tab session is in sessionStorage key `lvcc.session.v1`. Do not enter real patient data or credentials. Any script on this origin can read browser storage; the session guard is only a UI demonstration.

`createRepository({storage,seed,key})` exposes `readState()` and synchronous `commit(change,expectedRevision)`. Reads are detached. A save checks the latest persisted revision, clones the state, applies and validates the change, then writes one complete JSON value. A failed write never announces success or writes partial records. Invalid/corrupt data is not silently replaced. The recovery page lets you retry and download the original data for diagnosis.

The first test verifies that a stale writer is rejected and the newer save survives. There is no Web Locks implementation, server, polling coordinator or distributed lock. A storage event warns an open page when another tab changes data, preserving its form entries. Revision checks reject sequential stale saves; localStorage cannot guarantee atomic compare-and-swap between simultaneously executing tabs or across devices. Production concurrency requires a server transaction.

The initial fictional records match the October 15 Figma examples. The last-school-update label is the seeded record's date, not evidence of a live MIS sync. Manual lookup availability does not claim a connected card reader.

## Design reference

Use the [current Figma page](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=174-4208) and [BRD v2.2.1](docs/BRD.md). Administration is deferred; doctor accounts and clearances are excluded. Patient history uses a dropdown of recorded complaints. Follow-up notes support Edit note, Save changes and Cancel, retaining original authorship and accessible edit history.

[Complete screen/route map](docs/figma-route-map.md): 348 screen/state frames and four guide frames. Every frame was inspected live before recording the map. Each screen must additionally receive high-fidelity design-context inspection before its implementation. Different breakpoints and fictional outcome examples generally map to one route with record-driven state.

Figma supplies all downloaded icons and the original login illustration. Open Sans regular, semibold and bold are local, with the SIL Open Font License in `assets/fonts/OFL.txt`. CSS uses shared Figma tokens; no external asset requests are required at runtime.

## Boundaries

This frontend does not connect to RFID equipment, MIS, email/SMS providers, Messenger or production authentication. It cannot establish secure storage, clinical authorization, protected backups or multi-device uniqueness. Remaining operational decisions in the BRD stay open. Do not interpret a prototype demonstration as a production acceptance result.

Revision 3 adds patient identity confirmation before editing patient details, existing follow-up notes or correcting a completed visit. Enter a uniquely matching RFID, school ID or the local Patient ID shown in the confirmation. Visitors use their local Patient ID. This check confirms the selected patient; it is not authentication, a secret, or production edit authorization. An active simulated nurse/assistant session is still required for every save. Confirmation is temporary and clears on navigation. Adding notes and ongoing care do not require an extra scan.

All note textareas use the configurable `NOTE_LIMIT` in `js/note-rules.js`: **2,000 characters per field**, including correction reasons, assessment/treatment/final notes, referral documentation and manual message follow-up. This is a frontend prototype policy, not a verified backend limit. Counts use JavaScript string length (UTF-16 code units); validation runs before trimming. Blank required notes are rejected. Counters display excess text and saves are blocked without truncation. Previously saved longer text remains readable and is retained in history when explicitly shortened. Note corrections preserve the original author/time, latest editor and previous versions. Unsaved notes warn on navigation or browser exit; these editor drafts are not persisted across reloads. Finish or cancel one note edit before starting another.

Revision 3 desktop verification: [QA checkpoint](docs/superpowers/qa/2026-10-19-meeting-revision3-desktop.md). Responsive layouts (BRD NFR1/AC20) remain deferred; no phone/tablet work is included.
