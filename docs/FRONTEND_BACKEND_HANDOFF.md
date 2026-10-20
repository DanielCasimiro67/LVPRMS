# React frontend / backend handoff

Updated 20 October 2026. Destination: DanielCasimiro67/LVPRMS, branch `clinic-web-app`. The other LVPRMS repository is a read-only contract reference, not this app's backend. Reference commit: `489160eb157a0395af4719573c3d7460011d8212`. Its `backend/routes/api.php` matches the supplied Downloads file and declares 27 routes. Historical 23/45-route audits do not describe that source.

## Run and configure

```powershell
npm install
npm run dev
npm test
npm run build
npm run preview
```

Default mode is `demo`. The printed Local URL is clickable. Vite starts on port 4174 and tries another port if occupied. Use `npm run dev -- --port 4300` to choose a port. No PHP, database or backend is needed for demo mode. Built files are in `dist/`; serve them over HTTP. Hash routes support refresh without server-side route rewrites. Keep the separate `/demo.html` and `/assets/intake-simulator.html` pages with the build.

To review API mode, copy `.env.example` to `.env`, choose `VITE_DATA_MODE=api` and restart Vite. `VITE_API_BASE_URL` is the **complete versioned root**, normally `/api/v1` or `http://localhost:8000/api/v1`. Do not append a second `/v1`. `VITE_API_PROXY_TARGET=http://localhost:8000` configures the development `/api` proxy only. Production hosting must provide an equivalent proxy or a reachable API URL with appropriate CORS. Vite variables are public configuration: never put credentials in them.

API login uses email/password. The server token stays in sessionStorage and is cleared on 401. Supported clinic roles are nurse/nursing_assistant. This UI role gate does not replace backend authorization. Demo authentication remains a simulation and stores no production credential/token. API failures never use demo records or fake success.

## Code boundaries

- `src/app/`: protected shell, hash router, provider, explicit demo/API runtime.
- `src/features/`: React screens for access, Today, patients, visits, Messages, referrals, inventory and reports.
- `src/components/`: reusable controlled fields, dialogs, buttons, identity/status and dirty-work guards.
- `src/services/api-client.js`: injected fetch/base/token transport, envelopes and errors. Native Node can import it.
- `src/services/api-contracts.js`: exact endpoints, IDs/DTOs and supported capabilities.
- `src/services/api-adapter.js`: paginated reads, auth/password and saved supply details. `call(name,id,body)` is a contract method, not permission to expose unsupported writes.
- `src/services/demo-adapter.js` and pure `js/` domain modules: existing local transactions and rules. Do not replace them with ad-hoc localStorage writes in React pages.
- `css/` and `assets/`: retained approved theme, fonts, icons and illustration. Legacy `js/app.js`/DOM views are not mounted by the React entry.

The existing Figma/route inventory remains in `docs/figma-route-map.md`. Meeting decisions and BRD v2.2.1 govern semantics. Desktop 1440×960 only; responsive BRD NFR1/AC20 remains deferred.

## Every declared route

Paths are relative to `/api/v1`. **UI** means called by current API-mode screens; **prepared** means exact client method exists and is contract-tested, but the UI does not call it. All demo workflows remain functional independently.

| Method | Path | Client method | Current API treatment |
| --- | --- | --- | --- |
| POST | `/login` | login | UI: email/password |
| GET | `/me` | me | UI: session/role bootstrap |
| POST | `/logout` | logout | UI: token revocation |
| PUT | `/me/password` | password | UI: password-only account update |
| GET | `/patients/lookup` | lookup | Prepared; live scan requires unique-identity contract |
| GET | `/patients` | patients | UI: all patient pages, search/filter locally |
| POST | `/patients` | createPatient | Blocked; name/contact/education contract incomplete |
| GET | `/patients/{id}` | patient | Prepared; current records use loaded list |
| PUT | `/patients/{id}` | updatePatient | Blocked; notes/contact/history unsupported |
| DELETE | `/patients/{id}` | deletePatient | Prepared only; no nurse delete UI |
| GET | `/patients/{patientId}/history` | history | Prepared; current UI uses loaded visit list |
| GET | `/symptoms` | symptoms | Prepared; enable intake after clinical contract fix |
| GET | `/symptoms/{id}` | symptom | Prepared lookup |
| GET | `/visits` | visits | UI: active/discharged/referred reads |
| POST | `/visits` | createVisit | Blocked; severity/clinical fields conflict |
| PUT | `/visits/{id}` | updateVisit | Blocked; approved states/outcomes absent |
| GET | `/inventory-items` | inventory | UI: read only, API omits zero-stock items |
| POST | `/visit-supplies` | issueSupply | Blocked; atomicity/corrections/idempotency missing |
| GET | `/visits/{visitId}/supplies` | supplies | UI: actual saved visit quantities/units |
| POST | `/diagnostic-referrals` | createReferral | Blocked; preparation must not change encounter status |
| GET | `/visits/{visitId}/referral` | referral | Prepared; no global follow-up contract |
| POST | `/notification-logs` | createLog | Blocked; log creation does not prove email delivery |
| GET | `/visits/{visitId}/notifications` | notifications | Prepared; no nurse-summary inbox contract |
| GET | `/reports/summary` | summary | Prepared; all-time summary cannot stand in for filters |
| GET | `/users` | excluded | Admin, outside nurse scope |
| POST | `/users` | excluded | Admin, outside nurse scope |
| DELETE | `/users/{id}` | excluded | Admin, outside nurse scope |

API mode renders existing patients, visits, issued supplies and available inventory. Reports aggregate the loaded visit set locally; they are not a verified server reporting service. Missing historical/clinical fields cannot be inferred. Backend `referred` displays **checkout unconfirmed**, never automatically Completed. Messages and referral follow-up explicitly show Not available yet, rather than inventing an empty live inbox or queue. Registration, clinical edits/save/complete, notes, stock writes and unsupported follow-up actions are disabled in API mode.

## Backend fixes before enabling writes

1. Support lossless full name, inferred category/department/program/year and incomplete-record contact fields. Migrate Faculty to Staff. Define nullable/missing versus unknown clinical values. Do not invent allergy/blood type.
2. Guarantee unique RFID/school-ID lookup, ambiguity errors and current active visit. Identification opens an unsaved visit; a second tap needs confirmation. One active encounter per patient must be enforced server-side.
3. Require patient, complaint and encounter state for ongoing care, without severity. Persist Other free text, four encounter states, four completion dispositions, optional vitals/assessment/treatment and notes. Provide authored corrections, record/note history, the agreed text limit and revision checks.
4. Save visits, supply differences and completion summary events transactionally and idempotently. Define quantity units/fractions, stock locking, add/count-adjust/history and inclusion of zero-stock rows. The frontend demo ledger is not production inventory authority.
5. Keep referral preparation/contact/reply/actions separate from actual-transfer checkout. Preserve doctor provenance recorded by the nurse. Actual transfer may complete the encounter while follow-up stays pending; late replies cannot reopen care.
6. Provide nurse-summary recipient resolution, immutable payload, actual pending/sent/failed/missing-recipient delivery states, attempts, retry and manual follow-up. A created notification log is not Email sent. No automatic real delivery is connected here.
7. Define filtered/paginated report/history contracts and timezone semantics, plus production auth/roles, session expiry, auditing and concurrency. UI identity confirmation is not clinical authorization.

Resolve these against BRD/meeting decisions, then enable one capability at a time and test against a seeded backend. Do not silently flatten states, split names, invent severity or drop unsupported inputs.

## Verification boundary

The React app was tested with fictional demo data and intercepted API fixtures. All 24 client route methods have verb/path/ID-encoding coverage. No Laravel database, real credential, RFID device, MIS import, external message provider or production deployment was exercised. See the React QA checkpoint for results.
