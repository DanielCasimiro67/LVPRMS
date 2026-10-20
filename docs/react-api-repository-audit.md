# React/API migration: repository findings

Source inspected: `DanielCasimiro67/La-Verdad-Patient-Record-Management-System-LVPMS-`, branch `main`, commit `489160eb157a0395af4719573c3d7460011d8212`, 20 October 2026. Reference checkout is ignored under `tmp/backend-analysis-2026-10-20`; no reference application code or backend/database was changed.

## Decision supported by the audit

Use the completed LVPRMS frontend as the UI/workflow source, convert it to React, and isolate all data access behind demo/API adapters. Use the repository for actual Laravel contracts and selectively reusable client code, not as a replacement UI. Its existing React pages include old doctor/admin screens and workflows that are excluded from our current scope. Finish desktop1440×960 first; phone/tablet remain deferred.

The supplied Downloads `api.php` and repository `backend/routes/api.php` have the same SHA256: `42514B1964BFA0D612B6D025302ADC708C908CC8D4909DF1FF15B0921A32CD8B`. They declare **27** routes. The documents referring to23/45 routes are stale relative to this commit. This is static source verification, not a fresh Laravel route-list execution or a live API test.

## What is reusable

The repository already uses React, Vite and React Router. Its API client demonstrates Laravel envelopes, bearer authentication, paginated patient lists, identifier lookup and relationship normalization. Its Vite configuration proxies `/api` to `http://localhost:8000`. This is a development default, not proof that a server is running there. The actual client uses `VITE_API_URL` as an unversioned root and appends `/v1`; the pasted audit's environment-variable name differs. The new app should document one unambiguous base convention and test against duplicate/missing version prefixes.

The client also retains methods for absent endpoints, including inventory writes, alert rules and notification dispatch. Copying it wholesale would retain broken calls. Reuse only verified pieces and keep a method/verb/path contract test for every exposed operation. Do not copy its older UI or add unsupported medical inputs simply because they appear there.

## Screen and field compatibility

| Frontend area | Actual backend contract | Required treatment |
| --- | --- | --- |
| Sign-in | `email`, `password`; response includes `access_token`, `token_type`, `data.user_id/username/email/role` | API login must explicitly use email; do not send the demo username as an email or append a guessed domain. Keep demo login separate. |
| Account | Password update accepts `current_password`, `new_password`, `new_password_confirmation` | Straightforward adapter mapping. Username remains read-only. |
| Name/identity | Patient requires `first_name`, `last_name`, `patient_type`; optional `mis_id`, `rfid` | Map IDs deliberately. Current single Full name cannot be losslessly split automatically; resolve with backend support for full name or an explicitly reviewed structured-name form. |
| Patient category | Enum still includes `faculty`; controllers accept student/faculty/staff/visitor | Present Faculty as Staff; create Staff, with a separate backend data-migration task. Do not restore a Faculty picker. |
| Education | `grade_level`, `section`, `department` | Grade/section can map. Higher-ed program/year and department-group inference need an explicit persisted contract; do not overload fields silently. |
| Incomplete records/contact details | Patient validator/model do not persist personal/emergency contact fields, notes, allergy or blood type | Keep current demo functionality; API-mode unsupported writes must be unavailable. Document backend additions. Do not submit fields and then claim they were saved. |
| RFID lookup | `GET /patients/lookup?identifier=...`; returns patient or404; related latest visits | Read only; preserve unsaved new-visit handoff. Endpoint must establish unique matching and active-visit retrieval before claiming all scan guarantees. |
| Visit | Required `patient_id`, `symptom_id`, `severity`; optional bp/temperature/pulse/status/image | Severity requirement conflicts with the approved form. Do not invent a default severity or reintroduce image uploads. Block incompatible API creation pending backend correction. |
| Encounter states | `active`, `discharged`, `referred`; update accepts only discharged/referred | Cannot faithfully persist In progress/Resting/Awaiting reply and four outcomes/corrections. Do not flatten those meanings while presenting full support. |
| Clinical narrative | No complaint-details, assessment, treatment, final-notes or correction-history fields in visit validator | Other free text and current note/history features require backend additions; do not silently drop them. |
| Supplies | `visit_id`, `item_id`, integer `quantity_used>=1`; separate request decrements inventory and creates usage | No fractional quantities, correction/idempotency contract or whole-visit atomicity. Do not port the demo ledger as a substitute for server stock. Concurrent availability check occurs before the transaction; backend needs transactional stock protection. |
| Inventory | `GET /inventory-items` returns only items with stock above zero | Read integration available, but out-of-stock rows are omitted. Add/count-adjust/history have no routes. Complete inventory view/writes need backend changes. |
| Referral | Create accepts visit/routing/diagnosis fields; immediately changes visit to referred and assigns current user as doctor | Conflicts with preparation/contact without checkout and nurse-recorded doctor provenance. Do not connect Prepare referral to this write. Preserve actual-transfer confirmation and record a backend fix. No referral-update routes exist. |
| Messages | Notification POST creates a log only; recipient types adviser/program_head/assistant_principal; status defaults to sent | Does not deliver email or support the designated nurse summary. Never translate log creation into Email sent. Inbox/retry/attempt/manual-follow-up APIs need definition. |
| History | Patient history returns visits plus symptom/supplies/referral/notification relations | Reusable read shape; no follow-up-note editing/versioning contract. |
| Reports | Summary returns today's counts, low-stock items (threshold10), all-time top5 symptoms | Not the requested filtered/monthly report. Full visit data may support client-side aggregates with clearly defined filters, but do not display this summary as date-filtered data. |
| Role scope | Routes include doctor and administrator capabilities | Wire nurse/assistant only; no admin/doctor UI or patient-delete action. |

## Validation actually performed

- Read current routes, controllers, patient/visit schema/model, middleware/bootstrap, React routes, client/config and integration documents.
- Verified the supplied route-file hash against the repository copy and counted27 declarations.
- Ran `node --test tests/api.test.mjs` in the reference frontend: **failed before tests could execute**. `src/services/api.js:1` accesses `import.meta.env.VITE_API_URL` directly; native Node does not provide `import.meta.env`. The claimed15 passes in older documentation do not reproduce at this commit.
- No npm install/build/lint, PHP dependency install/migrations, database writes, live login or external messaging tests were performed. No credentials/environment secrets were read.

## Migration handoff

1. Convert the current completed UI into React components with existing CSS/assets and explicit demo-mode parity; retain current tests and add React interaction/build checks.
2. Define shared service interfaces, exact DTO mapping, capability flags and one configurable API root. Keep all current workflows usable in demo mode while the backend catches up.
3. Prepare adapters and mock contract tests for verified endpoints. Connect live operations only when supported and a test backend is available. Unsupported actions explain availability; failed API calls never fall back to fake success.
4. Give the backend teammate this compatibility table. Backend work is a separate task; do not change their schema or business rules as a side effect of the React migration.

Implementation update: Native execution was approved and the React migration is complete. See `FRONTEND_BACKEND_HANDOFF.md` for current support and the React QA checkpoint for validation. The findings above describe the unchanged reference backend.
