# React parity correction — 21 October 2026

Compared the reported React screens with the retained pre-migration views from the completed frontend. Scope remains frontend only, desktop 1440×960.

Found and corrected:

- Patient-list completeness had become muted plain text. Restored yellow Record incomplete and green Record complete badges in list/detail views, plus the missing-details warning.
- Shared status mapping omitted the previous yellow Awaiting doctor reply badge. Restored waiting/success colors for referral waiting, resting, no-active-visit, staff in-clinic and inventory warnings using the existing CSS tokens.
- Referral rows incorrectly required a redundant referral.patientId. Restored lookup through the linked visit first, then the legacy patientId fallback. Restored complaint/reason fallback and recorded date. No records or identifiers were rewritten; genuinely missing links remain missing.
- Patient record omitted RFID, relationship and the department summary. Restored the previous profile-summary layout and its saved identity/contact values.

The React render test reproduced the missing warning class before the fix, then passed with coverage for status styling and a referral without patientId. Full suite: **148 passed, 0 failed**. Production build passed. Native Playwright/Edge (Browser plugin unavailable): **4 focused parity checks** plus **8 desktop smoke checks across 12 routes**, no recorded page/console errors. Computed warning background/text colors were compared directly with the previous patient-list renderer and matched exactly. Screenshots inspected at 1440×960; no phone/tablet verification.

Local evidence, outside shipped source:
`C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/react-parity-2026-10-21/`

Includes `result.json`, `patients.png`, `patient-record.png`, and `referrals.png`. The broader route sweep remains under `react-migration/desktop-smoke.json`. This correction addresses the identified migration differences; it does not claim a new pixel comparison of every historical Figma frame.
