# Revision 3 — record editing and note polish

Frontend-only checkpoint, 19 October 2026. Desktop 1440 × 960 only. Existing LVCC blue/white components, local Open Sans, 232px sidebar and flexible content layout retained. No backend or phone/tablet work. Browser plugin not available; used bundled Playwright with headless Microsoft Edge. No new Figma frames were created or claimed as pixel-matched; visual inspection used the established frontend design.

Flow tested: patient record → identity confirmation → note/detail edit or visit correction → save/cancel → original authorship, history and related records remain intact.

## Results

- `npm.cmd test`: **90 passed, 0 failed** (81 previous tests plus nine Revision 3 tests).
- Desktop browser QA: **11 checks passed**, no page or console errors. Screenshots checked at 1440 × 960, sidebar 232px and no horizontal page overflow.
- Wrong ID rejected; uniquely matching RFID/school ID accepted. Visitors use local Patient ID. Confirmation makes no clinical write and expires on route navigation. School-managed identity remains read-only.
- Note blank/over-limit validation, visible counters, no truncation, Cancel, original author/time and previous versions verified. Failed/stale saves retain entered text. Unsaved navigation offers Keep editing/Discard changes. Operator session remains required after identity confirmation.
- Incomplete visitor record can be completed without changing visits or messages. Completed-visit correction keeps previous clinical facts and the original email snapshot. Existing 2,050-character note remains intact on rendering/edit/cancel.
- Domain tests also cover ambiguous RFID rejection, boundary-length notes, visit/referral/message note limits and rejection without state changes.

## Policy and limits

`js/note-rules.js` declares the prototype limit: 2,000 characters per field (JavaScript UTF-16 string length). Shared UI/counters and save validators use the same value. Validation precedes trimming; saved values are trimmed as before. HTML maxlength is deliberately absent so pasted or legacy text is not silently shortened. Required fields reject whitespace. Older over-limit notes require explicit shortening to save a correction; the full previous version remains in history.

Identity confirmation is identification, not operator authorization or a security boundary. All data/authentication remain local simulations. Production permissions and backend note-limit parity are deferred. No email is sent by identity confirmation or correction.

## Local evidence

Screenshots and machine-readable browser result are stored under:

`C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-revision3/`

- `identity-check.png`: wrong-card feedback and selected patient.
- `note-limit.png`: over-limit counter and retained text.
- `note-history.png`: latest note, original authorship and expanded Edit history.
- `visit-correction.png`: correction form and declared note limits.
- `qa-result.json`: browser checks, viewport and error result.

QA script: ignored `tmp/qa-revision3.cjs`; local test server port 4316. Earlier sandbox attempts failed due browser/loopback restrictions; successful verification used approved native execution. No source changes were needed for those environment failures.

Stop after Revision 3. Revision 4 quick discharge remains pending user approval.
