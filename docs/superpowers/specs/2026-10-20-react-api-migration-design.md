# React migration and nurse API integration — review draft

Date: 20 October 2026. Status: proposed design, awaiting review; matching repository source has now been inspected. No application conversion, dependency installation or backend change has been made.

## Purpose and scope

Convert the existing completed desktop frontend into an actual React application, preserving the approved LVCC design, routes, nurse workflows, meeting revisions and failure protections. Prepare and test API adapters for supported nurse workflows, with live connection following backend readiness. Use the Laravel API supplied in `C:/Users/daniel/Downloads/api.php`. The current plain-JavaScript-only restriction is superseded by the explicit React request. Desktop verification remains 1440×960; phone/tablet, administration, doctor accounts and clearance remain outside scope.

BRD v2.2.1 plus later approved meeting decisions remain the workflow authority. Route comments mentioning doctors/admins are backend context, not authorization to add their screens. “Connect all routes” means account for every supplied endpoint and wire applicable nurse capabilities; it does not mean expose destructive patient deletion, admin account management or invent missing server operations.

## Evidence and limits

- Current frontend baseline: commit `74f79dd`, Task 7 completed; 139 Node tests and the documented desktop verification checkpoint. Preserve it through Git history; do not reset or replace clinical demo data during migration.
- Supplied `api.php`: **27 route declarations**. Public `POST v1/login`; remaining routes use `auth:sanctum` and the `v1` prefix. The matching repository bootstrap registers this API route file under Laravel API routing; no fresh framework route-list execution has been performed.
- The subsequently pasted integration audit explicitly labels its 45-route inventory stale and points to a current `frontend/INTEGRATION_STATUS.md`. Its 23-route correction also differs from the supplied file. Neither count establishes a live API contract.
- The available `tmp/backend-reference-dylan/backend` is an older reference, not the confirmed current backend. For example, its AuthController has no password-update method although the supplied file registers one. Do not use its validations as current facts.
- Subsequently inspected repository: `DanielCasimiro67/La-Verdad-Patient-Record-Management-System-LVPMS-`, main commit `489160eb157a0395af4719573c3d7460011d8212`. Its route file exactly matches the supplied file by SHA256. Its integration-status document still contains stale23/45-route claims; current controllers and schemas take precedence. See `docs/react-api-repository-audit.md` for verified fields, side effects and test results. The API URL is configurable; no running service or live connectivity is assumed.

## Approach

Recommended: convert to React with demo parity first, then connect the API through explicit adapters. This gives a working UI checkpoint and preserves a way to distinguish migration regressions from backend gaps. Alternative: convert and integrate screen by screen in one pass; this reduces intermediate checkpoints but makes partial server support harder to isolate. Both require the same contract audit; the first is recommended for this project given the previous paused integration.

Use React with Vite, JavaScript/JSX, existing CSS tokens/styles and local assets. Preserve hash URLs using React Router so bookmarked patient/message/referral links remain recognizable. A single application API client uses native fetch, an environment-configurable base URL, explicit response normalization and consistent error handling. Use an explicit versioned `VITE_API_BASE_URL` (default `/api/v1`); service methods append paths such as `/patients`, never another `/v1`. Inject base URL, fetch and token storage into the client. Vite environment reads belong in browser bootstrap, keeping client/domain modules importable in Node. Do not add a new visual library or redesign the approved pages. React's documentation lists Vite as a supported SPA build tool: https://react.dev/learn/build-a-react-app-from-scratch ; https://vite.dev/guide/ . Exact compatible package versions will be verified and locked during the approved implementation.

Suggested boundaries:

- `src/app`: route declarations, session/provider wiring, error boundary and desktop shell.
- `src/components`: shared buttons, fields, cards, badges, dialogs, note counters and tables.
- `src/features`: Today/scanner, patients, visits/discharge, Messages, referrals, inventory, reports and account.
- `src/services`: API client, server DTO mapping, authenticated session operations and API capability definitions.
- `src/data`: explicit demo adapter around the tested current domain rules; API adapter for confirmed server contracts.

Replace string-template rendering and document queries in clinical screens with React components, controlled form state and scoped refs. Do not wrap the existing app in React while retaining competing manual DOM ownership. Reuse pure validation/domain functions where applicable. Scanner listeners and timers get effect cleanup; patient drafts remain keyed by patient, and repeated identification never overwrites another patient's work. Avoid broad global stores for unrelated page state. Route loaders/shared request caching should prevent duplicated bootstrap/list requests; mutation refreshes must preserve dirty forms.

## Endpoint-to-workflow coverage

Paths below are relative to the confirmed versioned API root, provisionally `/api/v1`. These are route capabilities only; payloads, query parameters, pagination, roles and side effects require matching controllers or OpenAPI/examples.

| Supplied endpoint | Frontend responsibility / decision |
| --- | --- |
| `POST /login` | API sign-in. Confirmed: API uses email/password and returns a bearer token; keep demo username login separate. |
| `GET /me` | Authenticated session bootstrap and nurse/assistant identity. |
| `POST /logout` | Revoke session; clear client session and protected caches. |
| `PUT /me/password` | Password-only account editing; username read-only. Confirmed: current_password, new_password, new_password_confirmation. |
| `GET /patients/lookup` | Automatic scanned identifier resolution; read only until explicit Save. Confirm lookup query and unique/ambiguous/no-match responses. |
| `GET /patients` | Name search, category filters and patient selection; respect real pagination rather than assuming the first page is complete. |
| `POST /patients` | Department-led registration. Confirm fields for names, identifiers, education and incomplete emergency contacts; never guess how to split a full name. |
| `GET /patients/{id}` | Patient record and edit form data. |
| `PUT /patients/{id}` | Persist supported patient detail changes; display unsupported fields as unavailable rather than dropping input. |
| `DELETE /patients/{id}` | Accounted for, not exposed: current nurse workflow has no patient-delete action. |
| `GET /patients/{patientId}/history` | Visit history and complaint/date filters; inspect whether note content/edit history is included. |
| `GET /symptoms` | Complaint lookup mapping, including Other; never assume symptom IDs. |
| `GET /symptoms/{id}` | Resolve a referenced complaint when needed; avoid redundant reads if the list already contains it. |
| `GET /visits` | Today queue and saved visit lookup, subject to actual filters/relations. No single-visit GET route is declared; confirm how deep links retrieve a visit. |
| `POST /visits` | Save a new encounter with only approved required clinical fields. Validate the actual contract; never fabricate severity or silently discard state. |
| `PUT /visits/{id}` | Supported ongoing updates, completion and correction, only to the extent the controller persists them. Endpoint existence alone does not establish all three capabilities. |
| `GET /inventory-items` | Inventory and visit-supply selection from server stock. |
| `POST /visit-supplies` | Record supply use only after inspecting deduction, validation and idempotency behavior. Confirm whether saving care and supplies can be atomic. |
| `GET /visits/{visitId}/supplies` | Display saved supplies and verify uncertain issue results. |
| `POST /diagnostic-referrals` | Prepare referral if supported; creation must not imply doctor contact or checkout. |
| `GET /visits/{visitId}/referral` | Linked referral details. Global queue and history updates need confirmed read/update contracts. |
| `POST /notification-logs` | Only the documented server operation. Logging alone must not be represented as sending email. Confirm dispatch/recipient/status semantics. |
| `GET /visits/{visitId}/notifications` | Truthful completion-summary/message status and attempts where returned. A complete inbox needs a supported retrieval strategy. |
| `GET /reports/summary` | Reports/dashboard aggregates using actual supported filters. Detailed print logs require complete saved visit data, not a guessed summary shape. |
| `GET /users` | Admin-only, excluded from nurse UI. |
| `POST /users` | Admin-only, excluded from nurse UI. |
| `DELETE /users/{id}` | Admin-only, excluded from nurse UI. |

## Capabilities not established by the supplied route file

Current repository controllers have now been inspected. The detailed compatibility table in `docs/react-api-repository-audit.md` records confirmed gaps. Do not connect the stale audit's extra endpoints merely because they are listed there. In particular, severity is required, referral creation changes visit status immediately, and notification creation only logs a result; those operations must not be wired as though they implement the approved workflows.

- Inventory stock additions/count adjustments/movement history: no corresponding write/history routes are declared.
- Follow-up note add/edit/version history: no dedicated routes are declared; check whether patient/history endpoints implement them.
- Referral contact, reply, action, resolution and actual-transfer history: only creation and per-visit read routes are declared.
- Full Messages inbox, retry/check and manual follow-up persistence: no dedicated endpoints are declared.
- Four encounter states, four completion dispositions, corrections/revisions and completion-triggered nurse email: inspect visit/controller support before mapping; do not collapse meanings into an incompatible status enum.
- Saved supply corrections and atomic, idempotent stock reconciliation: separate requests must not claim the local demo's transaction guarantees.
- Registration education/emergency contact fields and account password mutation: confirm actual validators and persisted fields.

API-mode unsupported actions show a clear disabled “Not available yet” state with retained readable data. Demo mode keeps the existing complete workflows. API errors never switch to demo data or pretend a server save succeeded. If the current server cannot preserve an approved requirement, record a backend fix separately; this request does not authorize modifying a different backend checkout blindly.

## Authentication, data and failure handling

The inspected AuthController returns a Sanctum bearer token and accepts email/password. Implement that confirmed contract, with per-tab session storage through an injected token store (no localStorage persistence by default), GET /me on bootstrap and role checks for nurse/nursing_assistant. Demo credentials remain separate. Use one authentication mechanism consistently; do not place tokens in URLs, log credentials or present demo passwords as API credentials. API mode must not seed fictional inventory into the server or use localStorage records as the authoritative clinic database. Keep transient API drafts scoped to the current session and preserve existing unsaved-work protections. Demo storage remains explicitly separate and unchanged.

Handle loading/empty/error states, field-level Laravel validation, unauthorized/forbidden access, missing records, network failures and stale/conflict responses. Clear protected caches on sign-out/session loss. Preserve form values on rejected saves. Disable repeated submissions. Never retry clinical writes automatically after a lost response: reconcile with saved server state or explain the uncertain result. A saved visit followed by a failed supply/referral request must be shown as a partial result, not retried as a fresh visit. Prefer disabling unsupported multi-step mutations until the backend can meet required integrity guarantees.

Preserve the completion-email explanation, then show the actual server status and linked Messages content. Never generate a fake API-mode “Email sent” state. Contacting the doctor does not discharge; explicit confirmed actual transfer does. Any backend behavior contrary to these rules is a documented integration blocker.

## Verification and delivery

1. Establish a React desktop checkpoint with feature parity in explicit demo mode. Existing domain tests must still pass; verify every migrated workflow and local asset at 1440×960. Keep the current design, keyboard/focus behavior, note limits, identity confirmation and dirty-form guards.
2. Freeze a current controller/request/response field matrix before API writes. Keep UI routes distinct from HTTP endpoints. Confirm the base URL, version prefix, authentication, CORS and test account setup without storing credentials in Git.
3. Integrate auth, patient identification/records, visits/completion, supplies/inventory, referrals/Messages, then reports. Use mock contract tests for adapters; verify actual service behavior separately with a disposable non-production database and approved test records.
4. Run Node domain/contract tests, React component/interaction tests as needed, production build and desktop browser checks. A mocked response is not proof of live backend operation. Label each workflow connected, read-only, unavailable or demo-only.
5. Update launch/configuration instructions (`npm install`, `npm run dev`, `npm run build`, environment examples), route map, test evidence and backend-fix list. Stop at agreed review checkpoints; no deployment or push is implied.

## Review inputs still needed

Repository and current integration-status source are now identified and inspected; no further source-location question is needed. A running API URL is not required for the React-first checkpoint: keep it configurable and test contracts with fixtures. The backend must later resolve the compatibility gaps before the corresponding live writes can be enabled. Preserve all current workflows in explicit demo mode in the meantime. Package setup and product-code migration wait for design approval and the implementation-plan review required by the project workflow.

## Scope clarification from repository review

The user clarified that the immediate goal is to finish the new frontend so the backend can connect easily. Therefore the first delivery is React UI/workflow parity with a clean service boundary, exact documented adapters and a backend-fix handoff. No backend code changes or live clinical writes are included by implication. Do not reuse the repository's old React screens in place of the approved design. React conversion remains in the current LVPRMS workspace; the cloned repository stays a read-only ignored reference.
