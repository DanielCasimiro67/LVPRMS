# Login background, Students filter, and nurse-summary email

Date: 15 October 2026. Target: existing **Clinic app · Responsive** page in Figma file j9OCbJk4L7CjZxtqbHbRAq.

## User-authorized changes

1. Use the attached school illustration as the login background, fitted appropriately.
2. Add the missing Students patient category filter.
3. After Complete visit, show an indicator that a template email generated from the visit information was sent to the nurse, and make it viewable in Messages.

The third instruction explicitly extends the older BRD notification examples: a completed visit now has a nurse-summary email in this prototype. It is distinct from existing adviser/department notifications. The BRD itself was not rewritten. Administration, doctor accounts, and clearance functionality remain excluded.

## Delivered design

- Supplied original image uploaded to Figma without generating or altering it. Desktop and tablet use a full-height, left-anchored proportional image behind the sign-in form. Phone uses the whole illustration at the bottom with a readable, centered sign-in card. All three login sizes were visually inspected.
- All patients, Students, Staff, and Visitors filters are available on every patient-search category screen. Students opens a student-only result state at each width. Filter selection and return navigation are wired.
- Completion forms explain that completing the visit sends an automatic summary to Nurse Elena Lim.
- All 36 completed patient/outcome/width states show **Visit completed · Email sent**, confirmation text, and **View in Messages**.
- Each completion state links to its own matching nurse email detail. The subject and body use the fictional saved visit's patient, type, complaint, assessment, vitals, care, completion time, and selected outcome. Recipient is the nurse; no real email address was invented.
- Messages opens a new inbox with the nurse summaries. Existing adviser-message failure and follow-up views remain accessible under other visit messages.
- Email details display recipient, sender label, sent time, status, and full scrollable email content, plus links back to Messages and the completed visit.

## Verification

- 171 targeted filter, identity/outcome, email-link, recipient, and multiline-content assertions passed.
- Full destination scan across 348 screen/state frames found no broken navigation destinations.
- Final horizontal and vertical content bounds scan found no overflow outside intentional image clipping and scrolling containers.
- Representative visual checks: desktop/tablet/phone login; patient filters and the student-only tablet state; completed visit on desktop and phone; generated email detail; phone Messages inbox.
- Visual defects found during construction—an overlapping inserted filter and clipped multiline email text—were corrected before final checks.

## Prototype boundary

This is an editable Figma prototype. Email summaries are generated design examples derived from the fixture visit information; there is no production mail service, live generation trigger, or actual email delivery. The displayed sent status represents the successful-send prototype state.

Registry and mutation evidence: 2026-10-15-login-students-nurse-email-state.json.
