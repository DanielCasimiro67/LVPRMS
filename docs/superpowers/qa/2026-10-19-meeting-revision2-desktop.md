# Meeting revision 2 — Registration and incomplete records

19 October 2026. User-approved frontend implementation of the meeting revisions. Desktop 1440 × 960 only. Revision 1 approved; stop before Revision 3. Backend integration remains excluded.

## Delivered behavior

Department replaces the patient-type picker. Higher ed/Basic ed infer Student; Staff or school-ID-only infer Staff. Explicit No school department with no school IDs/RFID yields Visitor. Blank data and an unknown RFID alone remain unclassified. Faculty has no separate option and belongs to Staff.

Student saves require full name, school ID, RFID and either searchable program/year or grade/section. Grades 11–12 are included. Missing emergency contact name/number permits saving, but the record remains incomplete. Both are needed for Record complete; personal contact and relationship are optional. Non-empty phone input accepts common formatting and 7–15 digits and is rejected rather than silently truncated when malformed.

Patient lists/records display completion status; records show missing details and Edit details. Later completion updates the same stable patient, retains original registration authorship and before/after profile history, and does not change clinical notes, visits, drafts, referrals, stock or stored email snapshots. Manual school identities remain provisional and are checked for ID/RFID collisions. School-managed identities are read-only; contact and emergency fields remain editable.

Find school record searches local fictional identity suggestions. Existing matches offer their existing clinic record; it never links solely by name or sends clinic information to a school system. `DEMO-3001` demonstrates a new higher-ed identity. Autocomplete locks the provided identity fields and retains entered emergency details. School suggestions contain identity fields only.

## Verification

- **81 Node tests passed, 0 failed**: the earlier 69 tests plus 12 profile tests. Stale revision is tested first. Initial new-module tests failed before implementation. Separate regressions for identity-only school suggestions and clearing obsolete student fields during a Staff correction were observed failing, then fixed.
- **11 desktop browser checks**, **10 screenshots**, zero page errors and console errors. Every capture is 1440 × 960, sidebar 232px, no horizontal overflow or broken images.
- Browser plugin is not available; used bundled Playwright/headless Edge with disposable fictional data. Browser script is ignored `tmp/qa-revision2.cjs`; detailed JSON is in the external screenshot folder.
- `git diff --check` passes; normal LF/CRLF notices remain.

Browser checks cover unknown-scan RFID retention/no patient-type picker; mandatory student identity; incomplete emergency save; optional personal phone; later completion; malformed phone and failed-storage retention; unchanged clinical history; collision rejection/cancel; Higher ed program/year identity; Staff inference; Visitor handling; fictional school autofill preserving entered contacts; protected school identity; stale-save recovery/Keep editing/Discard; and list completion badges. Related assertions are grouped into eleven workflow checks.

Screenshots: `C:/Users/daniel/.codex/visualizations/2026/10/14/01a13b68-dfae-75e1-829c-f8f6a7841f08/clinic-revision2/`:

- `basic-ed-registration.png`, `basic-ed-emergency.png`
- `higher-ed-registration.png`, `staff-registration.png`, `visitor-registration.png`
- `incomplete-record.png`, `edit-details.png`, `complete-record.png`
- `school-record-autofill.png`, `patient-list-status.png`
- `desktop-review.png` compares registration and the incomplete record side by side; `qa-result.json` contains results.

## Design, decisions and limits

Existing LVCC colors, Open Sans, local icons, card borders/shadows, controls, 232px sidebar and 32px gutters are reused. New form groups use flexible two-column grid and wrap naturally within the desktop content. Longer forms and records scroll in the main pane. This intentionally revises the old Figma registration structure per the meeting; no Figma file was modified or exact old-frame match claimed.

The overlapping meeting classification rules are resolved by explicit No school department for Visitor, school-ID-only for Staff, and a defined educational department for Student. Student identity fields block an incomplete save; emergency contact fields do not. Staff/Visitor identity minimum is name plus defined classification. The current prototype uses BSIS, four demo year levels, grades 1–12 and sample/current sections; it is not an approved school catalog or live MIS data source. Section suggestions follow the grade and recorded options; entered sections can be preserved for existing records.

Registration and the initial unsaved visit draft commit together. Edits use the existing expected-revision transaction. Failures/stale saves retain open form entries. Unsaved-navigation prompts offer Keep editing/Discard changes; refresh does not restore an unsaved profile form. Record edits are subject to the existing simulated nurse/assistant session, not patient-RFID authorization. Production RBAC, full notes/edit-security refinements, note limits, second-tap discharge and actual-transfer checkout remain outside Revision 2.

README, active plan, change register, flow specification and agent guidance were updated to distinguish implemented and queued behavior. BRD v2.2.1 is not presented as newly signed or baselined. No backend, phone or tablet work was done.

Stop here for user review before Revision 3.
