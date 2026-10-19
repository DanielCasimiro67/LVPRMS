# Task 5 — Referral follow-up review checkpoint

19 October 2026 (Asia/Manila). BRD v2.2.1. Frontend only; desktop 1440 × 960. Task 4 approved; Task 6 has not started. All changes remain in the existing frontend project.

## Delivered

Saved visits offer Prepare referral or View referral. Preparation records reason, optional doctor/destination and notes without asserting contact. Referrals lists all follow-ups and filters the four approved states. Contact records the actual external Messenger result, source doctor, Philippine time and optional notes. An unsuccessful contact attempt stays Prepared. Reply records doctor, time, relayed advice and planned next action, attributed to the operator. Actions/transfers can be documented while waiting. Resolution requires actions and outcome and retains the entire activity history.

Referral updates never complete or reopen an encounter, change inventory or send another summary email. Completed transferred visits retain their pending follow-up and can receive a late reply. Print summary uses saved facts and a dedicated print layout. No doctor account, approval workflow or in-app Messenger integration was added.

## Verification

- Full Node suite: **61 passed, 0 failed** (`npm test`), including **12 referral tests** and the 49 earlier tests.
- New domain tests were observed failing before implementation; stale-revision rejection was the first test. A same-minute timestamp regression was separately observed failing and fixed: native datetime inputs have minute precision, so a contact in the visit’s starting minute must not be rejected merely because the visit has seconds.
- Browser: **12 workflow checks passed**, **12 screenshots**, **zero page errors and zero console errors**. Every captured screen is **1440 × 960**, with a **232px sidebar** where navigation is present, no horizontal overflow, no broken images and 20 × 20 local icons. Print preview intentionally omits the sidebar.
- Used bundled Playwright/headless Edge because the **Browser plugin is not available**. Disposable context and fictional records only. Ignored script: `tmp/qa-task5.cjs`; detailed JSON, captures, PDF and comparison board are in `C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-task5/`.
- Print handler invoked; print media hides controls. The exported A4 summary is **one page**, contains the expected patient/contact/advice/action/resolution text, and was rendered with Poppler and visually checked for readable, unclipped content.
- `git diff --check`: no whitespace errors (Git emits existing LF/CRLF conversion notices).

Browser coverage: list filters and staff identity; failed contact storage retaining input; persisted contact and refresh; urgent transfer before reply; transferred visit completion with pending referral; required reply next action and duplicate submission; late reply preserving the completed visit and original email; resolution/history; print controls/output; visitor preparation from a saved visit and unsaved-navigation recovery; unsuccessful contact remaining Prepared; stale update preserving input; unlinked legacy recovery; session expiry. Related assertions are grouped into twelve checks in `qa-result.json`.

## Figma references and intentional differences

Inspected live high-fidelity desktop nodes before implementation:

- List `177:10961`; Prepared `177:11113`; contact `177:11256`; waiting `177:11411`; reply `177:11563`; advice `177:11709`; resolution `177:11864`; resolved `177:11998`; print `178:11165`.
- Staff/visitor identity variations: `181:6878`, `181:6932`; printable staff/visitor `181:8946`, `181:8989`. Shared templates render the actual saved patient type without imposing school fields on visitors.

Reused existing local Figma icons, Open Sans, blue/white tokens, card shadows/borders, 232px sidebar, 32px main gutters, controls and status styles. No screenshot is an application asset. Comparison board places Figma beside the native 1440 × 960 app captures; the Figma service’s 1024 × 683 desktop renders are scaled to match for the board. New groups use fluid flex sizing and maximum widths. No phone or tablet frame was inspected or verified in this task.

| Older Figma example | Implementation / reason |
|---|---|
| Three filter shortcuts | Added All follow-ups and Prepared so all four approved states remain accessible. |
| Contact form assumes contact succeeded | Explicit Contact result distinguishes Message sent from Unable to contact. Failed attempts do not claim a waiting reply. |
| Reply form lacks a separate planned-action field | Required Planned next action follows BRD 7.3. Advice remains attributed to the entering nurse/assistant. |
| Record transfer shortcut | Record action or transfer is available while pending; it does not silently complete the visit or resolve the follow-up. |
| No separate preparation/action-entry frames in the mapped desktop flow | Composed the inspected Referral details and action/resolution form styles, with required reason/actions and optional destination. |
| Short example history/printout | Show all recorded authors, clinical event times, entry times, attempts, advice, actions and outcome; longer detail pages scroll. Print output includes available saved visit facts only. |
| Fixed “today” examples | Use saved dates/times. Minute input uses Philippine time explicitly. |

## Data and limits

Fresh seeds use the Figma student/staff referral examples. Existing browser records are not replaced. Earlier unlinked placeholders retain their data and show recovery guidance; no encounter/contact history is fabricated. Earlier linked examples missing historical metadata show Not recorded until actual follow-up is entered. Reply entry requires an actual recorded sent contact.

Referral forms remain unsaved until submission. Keep editing/Discard changes protects navigation; failed/stale submissions retain the form. Browser refresh prompts about unsaved entries, but there is no persisted referral-draft recovery. Repository revisions reject sequential stale saves; this does not establish production multi-device concurrency or authentication.

Responsive NFR1/AC20 is deferred and unimplemented for these new workflows. Backend integration, inventory and reporting remain outside this task. Stop here for user approval before Task 6.
