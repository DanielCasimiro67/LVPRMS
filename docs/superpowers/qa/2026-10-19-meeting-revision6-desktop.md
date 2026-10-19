# Revision 6 — account and consistency pass

Frontend-only checkpoint, 19 October 2026. Desktop1440×960 only. Browser plugin not available; bundled Playwright/headless Edge used. Existing LVCC styling/background/components retained; no new Figma frames, phone/tablet or production-authentication verification claimed.

Flow tested: sign-in Show/Hide → My account read-only identity → password validation/change → sign-out/sign-in → nurse routes and recovery states.

## Results

- `npm.cmd test`: **123 passed, 0 failed** (116 previous tests plus seven account/consistency tests).
- Desktop browser QA: **10 checks passed**, five screenshots, zero page/console errors. Captures1440×960; sidebar232px where present; no horizontal overflow or broken images.
- Sign-in starts masked. Eye button and keyboard Space toggle visibility without modifying the value or submitting the form. Dynamic labels/pressed state and explicit type-button controls are provided.
- Account has three password fields and read-only username outside the password form. Typing cannot alter username; nurse/assistant accounts show their correct identity.
- Current-password, short, spaces-only, unchanged and mismatched validation retain entries without clinic-data writes. Submit re-masks values; errors focus the relevant field.
- Success clears/re-masks fields, leaves username/clinic data unchanged and stores no password in local/session storage. The changed password works after sign-out/sign-in within the running page; reload resets it as explained in the UI. Returning to account starts masked.
- Expired session blocks password saving. Domain tests also reject sign-out during asynchronous validation and verify operator-specific simulation state.
- Today/Patients/Referrals/Messages routes work. Inventory/Reports remain clearly deferred. Simplified scan controls are unchanged. Search-empty recovery reaches registration.
- Higher-ed Today rows show program/year without undefined values. Old unknown-card route uses department-led wording and name search. Unlinked referrals show Visit not linked and a saved-visit recovery path.

## Changes and limits

`js/password-ui.js` supplies a reusable masked input/eye toggle for login and account. Buttons expose Show/Hide labels, aria-controls and pressed state. Password validation remains a frontend simulation: no server, password persistence, reset service, username editing, production RBAC or administrative workflow was added. Current session/operator is rechecked after asynchronous hashing; a password consisting only of spaces is rejected. The existing simulation keeps its verifier in memory until reload, explicitly explained in the UI/README.

Consistency fixes are limited to shared patient descriptions, outdated unknown-card recovery text and truthful unlinked-referral status. Inventory/reports functionality, backend integration and responsive layouts remain pending. BRD baseline is unchanged; these are authorized frontend meeting revisions.

## Evidence

Folder: `C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-revision6/`

- `login-masked.png`: default masking and keyboard-focused eye control.
- `account-default.png`: read-only username, support hint and masked controls.
- `account-validation.png`: password error with retained/masked values.
- `account-success.png`: successful demo change, cleared controls and reload limit.
- `today-consistent-labels.png`: higher-ed program/year on Today.
- `qa-result.json`: check list and browser result.

Ignored runner: `tmp/qa-revision6.cjs`; local server4316. No commits or backend work performed. Stop here; previous inventory/reports Task6 needs separate approval.
