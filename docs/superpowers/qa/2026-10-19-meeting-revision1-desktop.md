# Meeting revision 1 — Today scan flow

19 October 2026. Frontend-only changes authorized by the project owner from the October 18 meeting. Existing blue/white design and desktop 1440 × 960 retained. This revises the intake presentation, not the client-approved status of BRD v2.2.1.

## Delivered

Today has an ID-shaped hero, Please scan your ID heading, ready/found/not-found feedback, dedicated keyboard input and manual school-ID/name fallback. A matched identity opens the patient’s unsaved form or offers existing work. Unknown IDs open registration after feedback, with RFID and manually entered school ID carried in their correct fields. A school patient’s newly registered RFID is saved to the local identity mapping. Ambiguous IDs require explicit selection.

No scan creates a clinical encounter, stock movement, discharge or email. Navigation away cancels delayed routing. Duplicate input has a 1.5-second guard; repeated submits while a route is pending are ignored. Registration drafts from one unknown identifier are not reused for a different scanned identifier. Existing in-clinic and attention lists are retained, and Today’s heading uses the current Philippine date.

The normal input can be driven by a keyboard-wedge reader that provides identifier text and Enter, or by manual input. No actual RFID device was connected or certified by this test. Continue is a manual submit alternative, not a button claiming to activate hardware.

## Evidence

- `npm test`: **69 passed, 0 failed**. The previous 61 tests remain, with eight new tests in `tests/scan.test.mjs`. The tracked intake test file was restored after a naming collision during development; its original coverage is retained. New routing tests first failed before implementation, and missing registration-field/collision regressions were observed failing before their fixes.
- Browser: **nine checks passed**, zero page errors; captured screens **1440 × 960**, **232px sidebar**, no horizontal overflow or broken images. Used bundled Playwright/headless Edge because the Browser plugin is not available.
- Checks: existing desktop shell/hero; known RFID/existing work; unknown RFID handoff/category navigation; save mapping and rescan into the same unsaved draft; manual staff lookup; unknown manual-ID field mapping; isolated drafts for different unknown cards; cancelled delayed navigation; ambiguous recovery without clinical writes.
- `git diff --check`: no whitespace errors; normal Git LF/CRLF conversion notices remain.

Screenshots and JSON: `C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-revision1/` — `today-ready.png`, `id-found.png`, `id-not-found.png`, `registration-carries-card.png`, `qa-result.json`. Ignored browser script: `tmp/qa-revision1.cjs`.

## Design and boundaries

The hero intentionally replaces the earlier Figma Start a visit card following the meeting request. Existing app shell, local icons, Open Sans, color/border/shadow tokens and flexible layout are reused. The ID illustration is decorative CSS, not a fake patient record or photo. No new image asset or framework was introduced. No Figma file was edited, and the new hero is not claimed as an exact match to the old frame.

Registration’s full department, dependent education fields, incomplete-record/emergency-contact behavior and removal of manual patient-type selection belong to Revision 2. Current category controls remain until then. Second tap still follows the existing resume flow until Revision 4 implements the confirmed quick-discharge confirmation. Actual-transfer checkout belongs to Revision 5; a doctor message alone will not trigger it. No backend, production RBAC, phone or tablet work was done.

Stop here for review before Revision 2. Previous inventory/report Task 6 remains queued behind the meeting revisions.
