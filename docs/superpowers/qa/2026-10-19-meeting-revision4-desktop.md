# Revision 4 — quick visit and tap-to-discharge confirmation

Frontend-only checkpoint, 19 October 2026. User-approved desktop1440×960 only. Browser plugin not available; bundled Playwright/headless Microsoft Edge used with simulated reader keystrokes. Existing LVCC components/typography/colors retained; no new Figma frames or phone/tablet verification claimed.

Flow tested: Today scan → new quick visit or active-patient confirmation → required outcome and explicit confirmation → completed visit and nurse summary in Messages.

## Verification

- `npm.cmd test`: **105 passed, 0 failed** (95 retained plus ten Revision4 domain/render tests). Stale confirmation rejection is the first discharge test.
- Browser QA: **10 checks passed**, **five screenshots**, zero page/console errors. Every capture is1440×960; sidebar232px; no horizontal overflow or broken images.
- An active-patient scan opens confirmation with patient identity/complaint/email explanation without any storage write. Keep in clinic receives focus.
- Repeated scans and implicit form submission cannot discharge. Cancel and Escape leave all saved data unchanged. A required outcome and explicit Confirm discharge are needed.
- Failed storage retains outcome/final notes and leaves visit/messages intact. Retry completes once even when the button is clicked twice; one pending summary is shown and View in Messages displays saved facts. Referral state and inventory are preserved.
- Stale revision rejects without overwrite and retains selected outcome. Expired operator session blocks confirmation and closes the dialog.
- A first scan opens an unsaved quick form. Complaint/state and optional medicine quantity save with automatic arrival time/operator; vitals remain optional. Unsaved care blocks quick discharge and offers Review visit; review/save then confirmation completes the same encounter.
- Visitor/manual Complete visit retains explicit outcome confirmation and creates one encounter.

Domain coverage also checks draft-only arrivals, ambiguous encounters, required/saved visit validation, legacy complaint text, idempotency and automatic timing. The old referral UI assertion now checks that unsaved visits have no referral-preparation link; the explanatory hint was removed from the streamlined quick form.

## Scope and behavior

Saved active encounter state determines a second-tap action, rather than counting raw scanner events. Repeated scans of an unsaved draft cannot discharge it. Patient identity remains separate from operator authentication. Quick completion uses saved care only and refuses dirty drafts to avoid losing edits. The first-arrival draft timestamp is used when available; the saving operator remains the clinical author. Fictional medicine/supply quantities do not deduct stock.

Email is simulated; completion queues a pending summary and uses the existing status/attempt workflow in Messages. No real email, reader hardware, MIS or backend connection is claimed. Referral state is not resolved by discharge. Actual-transfer simplification remains Revision5.

The first browser attempts exposed test-fixture issues: same-fragment navigation retained an older repository revision after direct fixture writes, correctly triggering stale rejection; session-expiry expectation used the wrong existing heading. The final runner uses fresh page loads for fixture scenarios and checks Please sign in again. Final checks pass; no stale guard was weakened.

## Evidence

Folder: `C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-revision4/`

- `quick-visit.png`: complaint, state, medicine/quantity and optional disclosures.
- `tap-confirmation.png`: patient identity, outcome, nurse email explanation and safe default focus.
- `discharge-save-failure.png`: retained final notes after failed storage.
- `completed-pending-email.png`: truthful completion/email status.
- `unsaved-care-protection.png`: blocked quick discharge and Review visit.
- `qa-result.json`: browser result/check list.

Ignored runner: `tmp/qa-revision4.cjs`; local server4316. No commits or backend integration performed. Stop before Revision5.
