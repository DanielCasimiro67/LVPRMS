# Automatic scan simplification — desktop checkpoint

User requested fewer controls: automatic scanning/feedback/routing, with name search and registration as the fallbacks. Frontend only; desktop 1440 × 960. Existing styling retained. Browser plugin not available; used bundled Playwright/headless Edge with simulated keyboard-wedge keystrokes.

- Node suite: **95 passed, 0 failed** (five new scan-reader/UI tests; prior Today assertion updated for the approved removal of manual entry).
- Browser: **eight checks passed**, no page/console errors. Sidebar232px; screenshots1440×960; no horizontal overflow.
- No scan-panel input, form, Continue, Find patient or disclosure. Only two fallback links.
- Found active patient opens existing care without a resume dialog or duplicate encounter. Found patient without care opens an unsaved New visit; duplicate bursts create no visit/email.
- Unknown card shows Patient not found, then opens registration carrying RFID without saving a patient. Ambiguous cards show a warning and open the matching records.
- Search by name and blank registration work. Search-field typing/Enter cannot trigger reader routing. Leaving Today cancels pending automatic navigation.
- Reader unit tests cover Enter termination, reset/interrupted input, duplicate gating, length overflow and Shift key handling.

The browser listens on Today for a keyboard-wedge reader’s fast character burst followed by Enter. No input focus is needed; the browser must be focused. Form/modal typing is ignored. Physical hardware, serial/WebUSB adapters and real MIS lookups have not been verified. Existing encounter safeguards and frontend-only storage remain; no tap-to-discharge behavior was introduced.

Evidence folder:

`C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-auto-scan/`

Files: `ready.png`, `patient-found.png`, `patient-not-found.png`, `qa-result.json`. QA runner: ignored `tmp/qa-auto-scan.cjs`; server4316. Earlier QA scripts describe historical UI and are not the current scan test entry point.

Stop here; Revision4 still awaits approval.
