# Revision 5 — referral and actual transfer

Frontend-only checkpoint, 19 October 2026. Desktop1440×960 only. Browser plugin not available; bundled Playwright/headless Edge used. Existing LVCC design components reused. No backend, physical reader, phone/tablet or new Figma-frame verification claimed.

Flow tested: referral doctor contact/action → patient stays active → explicit actual transfer → checkout and pending nurse summary → late reply/resolution without changing the completed visit or original email.

## Results

- `npm.cmd test`: **116 passed, 0 failed** (105 previous tests plus eleven transfer tests). Stale transfer rejection is tested first in the new suite.
- Desktop browser QA: **10 checks passed**, five screenshots, zero page/console errors. Each screenshot is1440×960 with232px sidebar, no horizontal overflow and no broken images.
- Recording a sent doctor contact updates follow-up to Awaiting doctor reply while visits/messages remain unchanged. Ordinary actions also leave clinic status unchanged. The ambiguous Record action or transfer label is removed.
- Opening or cancelling the actual-transfer form makes no write. Destination facility and explicit actual-departure confirmation are required. Transfer notes use the shared limit/counter.
- Failed storage preserves destination, checkbox and notes without partial checkout. Retry/double click records one transfer activity, completes the same visit and queues one pending nurse summary containing destination/handover facts. Inventory remains unchanged; pending referral state survives.
- Checked-out patient is removed from Today’s active list while referral list shows Checked out and pending follow-up. View in Messages shows the generated snapshot.
- Late reply and resolution remain available after transfer without reopening the encounter or rewriting the original email. Print summary retains transfer and subsequent activities.
- Stale transfer rejects without overwrite and retains input. Keep editing/Discard changes work. Dirty care blocks transfer and offers Review visit. Completed/resolved transfer bookmarks show Action unavailable. Session expiry prevents writes.

Domain tests additionally cover urgent transfer before contact/reply, visitor encounters without school identifiers, invalid confirmation/destination/over-limit notes, dirty/completed/resolved/mislinked records, idempotency with repeated request IDs, failed persistence, original clinical author/history and escaped destinations.

## Decisions and limits

Actual transfer is explicitly confirmed by the nurse after the patient leaves for the receiving facility. Time and operator are recorded at confirmation; retrospective transfer-time editing was not added. A doctor message is not proof of transfer. Clinic checkout and referral follow-up are separate states. The transfer uses existing completion logic in the same repository commit as activity, preserving transaction/revision checks. Existing completed visits and sent/queued summaries are not silently rewritten.

Email results remain simulated. The new summary begins Pending and links to the existing Messages status workflow. No doctor account, Messenger integration, production authorization, stock deduction or backend integration was added. BRD baseline remains unchanged; these are authorized frontend meeting revisions.

## Evidence

Folder: `C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-revision5/`

- `contact-still-in-clinic.png`: saved contact with independent clinic/follow-up states.
- `actual-transfer-confirmation.png`: facility, notes, explicit departure and email explanation.
- `transfer-save-failure.png`: entered details retained after storage failure.
- `transferred-follow-up-pending.png`: checked out while awaiting reply, with pending summary link.
- `late-reply-resolved.png`: retained transfer/advice/actions history.
- `qa-result.json`: browser result/check list.

Ignored runner: `tmp/qa-revision5.cjs`; local server4316. One initial QA locator matched both the print page h1/h2; scoping it to heading level1 fixed the test without product changes. Stop before Revision6. No commits or backend work performed.
