# Task 4 — Desktop review checkpoint

18 October 2026. BRD v2.2.1. Native execution in the existing frontend checkout. Task 3 was approved; no backend integration or work on Tasks 5–6.

Implemented: one immutable nurse-summary snapshot per completion; inbox and status filters; complete saved email; visit links; persisted Pending, Sent, Failed and Missing recipient results; retry on the existing message; pending checks reusing the same attempt; authored/timestamped manual follow-up; separate minimal concerned-party examples. The demo simulator is `/demo.html`, on the same server origin as the clinic.

## Verification

- `npm test`: **49 passed, 0 failed**. Includes the 37 existing tests and 12 Messages tests. Stale-revision rejection was tested first. Initial new-module tests failed before implementation. Review found a pending concerned-party retry could not resolve; its regression was observed failing, fixed and included in the passing suite.
- Desktop browser: **10 workflow checks passed** at **1440 × 960**; no page errors. Every captured clinic state was checked for a **232px sidebar**, no horizontal overflow and no broken images. No phone/tablet checks or frames were used.
- Bundled Playwright with headless Edge was used because the Browser plugin is unavailable. Disposable browser context; fictional data only. Local ignored script: `tmp/qa-task4.cjs`. Detailed result JSON and screenshots: `C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-task4/`.

Browser coverage: completion explanation and saved failed summary; exact summary link and refresh; blank manual-note rejection; failed storage preserving note input; authored manual history without changing email status; double retry and refresh without duplicate attempts; completed visit link and correction without email rewrite/resend; inbox status filters and concerned-party privacy; Pending across refresh and Check status using the same attempt; missing-recipient completion and retry recovery; separate simulator settings/storage/identity update; expired session hiding Messages. Related assertions are grouped into ten workflow checks in the JSON.

## Figma comparison

Inspected live before implementation: Messages `177:12147`, retry details `177:12284`, accepted details `177:12421`. Desktop only. Reused local Figma icons, Open Sans, tokens, 232px sidebar, 32px main gutters, cards, borders, semantic badges and amber failure notice. New layout groups use fluid flex sizing; no new fixed layout widths.

`desktop-comparison.png` places Figma beside the implementation. Figma screenshots are 1024 × 683 renders of desktop frames and are scaled to 1440 × 960 for the board; application captures are natively 1440 × 960. Also captured `inbox.png`, `summary-failed.png`, `summary-sent.png`, `summary-pending.png`, `summary-missing-recipient.png`, `completion-failed.png`, `completion-sent.png`, `concerned-party-failed.png`, and `simulator.png`.

Intentional differences from the older Figma examples:

| Reference | Implementation / reason |
|---|---|
| Messages example shows one failed adviser update | Inbox lists nurse summaries separately from the minimal concerned-party example, with status filters required by Task 4. |
| Detail example contains a short generic update | Nurse summary shows all available saved facts, recipient, generated time, attempts and manual history. These increase page height; content scrolls in the main pane. |
| Accepted example says sending service accepted | Explicitly says simulated acceptance; no real email delivery or recipient reading is claimed. |
| No separate pending/missing-recipient frames in inspected desktop flow | Reuses the same card, badge and warning styling with status-specific text and recovery. |
| Original seed lacks adviser body/timestamp metadata | Compatibility view uses the original fictional minimal example, never the nurse clinical summary. It is never automatically processed. |

## Limits and review stop

The adapter is synchronous and local: result/attempt changes are committed in one storage write. New persisted nurse events are processed when the completed visit or Messages is displayed. Pending checks reuse an attempt; unresolved failed/missing-recipient retries append an attempt only when a fictional address is available. Changing simulator settings requires refreshing the clinic before an explicit action; stale revisions reject writes and preserve entered notes.

No real email, provider queue, backend or production authentication exists. LocalStorage does not provide atomic simultaneous multi-tab/server transactions. No inventory changes occur here. Responsive layouts (BRD NFR1/AC20) remain deferred and unverified. Separate simulator reset requires confirmation and affects fictional data on the current origin only.

Stop after Task 4 for user review. Task 5 has not started.
