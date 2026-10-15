# La Verdad Clinic

An incremental frontend prototype of **Clinic app · Responsive**, using plain HTML, CSS and native JavaScript modules. No framework, dependencies, install command or build step.

## Run

Open this folder in VS Code and run in its terminal:

```powershell
npm run dev
```

Ctrl+click the **Local** link printed in the terminal. The server starts at port 4174 and tries the next port automatically if it is busy. Press Ctrl+C to stop. No `npm install` is needed; Node.js and npm are the only prerequisites. `npm start` runs the same server. Choose a starting port with `npm run dev -- 4300` if needed.

The small Node server serves only public application files on loopback. Use HTTP rather than opening `index.html` directly, because browser modules require an HTTP origin. Refresh the browser after editing files. Browser data is specific to each port, so a different port starts with its own fictional records and session.

## Sharing with teammates

Commit the application (`index.html`, `css/`, `js/`, `assets/`), `scripts/`, `package.json`, `tests/`, `.gitignore`, this README and the project documentation. Keep the font license in `assets/fonts/OFL.txt`. Tests and documentation do not run with the app, but help teammates verify changes and follow the requirements. The current readable BRD is [docs/LVPRMS_BRD.pdf](docs/LVPRMS_BRD.pdf); its editable source is [docs/BRD.md](docs/BRD.md).

`.gitignore` excludes local agent progress, `tmp/`, generated `output/` exports, historical Figma helper scripts/inspection data, dependencies, logs and `.env` secrets. These files remain on your computer. The Figma screen inventory and route map stay in Git because the tests and implementation reference them.

After cloning or downloading the repository, teammates open the project folder in VS Code and run `npm run dev`. They can run `npm test` for the automated checks. No dependency installation is needed. Each browser starts with fictional sample records; your browser's saved records and session are not included in Git.

## Current preview: Tasks 1–2

Implemented: sign-in, session guard, sign-out, 15-minute inactivity expiry, My account/password-change simulation, responsive navigation, Today overview, versioned fictional-data storage and recovery feedback.

Patient intake now supports manual school ID, simulated RFID through the dedicated intake field, partial-name search, category filters, duplicate-aware registration, patient history/date/complaint filters and authored follow-up notes. Visitors require no school fields. Scans open or resume patient-specific work without creating a completed visit, message or stock movement.

The small intake entry form supports reason/status and safe Save and switch, Keep editing, and Discard and switch. Separate drafts persist in fictional browser storage; invalid saves preserve input. Full assessment, treatment, completion, messages, referrals, inventory and reports remain in later tasks. This minimal ongoing-save step exists to exercise Task 2 switching, not to claim Task 3 completion.

Card examples: `RFID-1001` / school ID `2026-001` for Mara; `RFID-1002` / `2026-102` for Leo. Repeated identification resumes the same active visit. Name-search results always require explicit selection.

The separate [intake simulator](assets/intake-simulator.html) exercises one-way school identity updates and ambiguous cards. Open it in the same signed-in tab. Its default update rotates Mara’s card to `RFID-NEW`; its ambiguous example uses `RFID-SHARED`. It updates identity fields only and reports conflicts; it sends no clinical data and creates no operator accounts. Simulation controls never appear in ordinary clinic screens.

A school ID matching a provisional clinic record is reported for identity reconciliation, rather than automatically relabeling the patient and their history. Conflicting records remain unchanged; this preview does not provide a patient-merge tool.

Fictional demonstration accounts:

| Username | Password | Operator |
|---|---|---|
| `elena.lim` | `clinic-demo` | School nurse |
| `nina.reyes` | `clinic-demo` | Nursing assistant |

Use only these disposable values. No password is persisted. A simulated password change works for subsequent sign-ins in the same open page; reloading resets the demonstration password to `clinic-demo`. Only an in-memory demonstration digest is retained until reload. This is not secure authentication or a production password service.

## Tests

```powershell
npm test
```

`package.json` declares `type:module`, so tests import the same `.js` modules used by the browser. Tests need a current Node runtime with Web Crypto and structuredClone (verified with Node 24). No dependencies need installation. The server test checks automatic recovery from a busy port and keeps private project files inaccessible over HTTP.

## Storage and concurrency

Fictional records are stored in localStorage key `lvcc.clinic.v1`; the simulated tab session is in sessionStorage key `lvcc.session.v1`. Do not enter real patient data or credentials. Any script on this origin can read browser storage; the session guard is only a UI demonstration.

`createRepository({storage,seed,key})` exposes `readState()` and synchronous `commit(change,expectedRevision)`. Reads are detached. A save checks the latest persisted revision, clones the state, applies and validates the change, then writes one complete JSON value. A failed write never announces success or writes partial records. Invalid/corrupt data is not silently replaced. The recovery page lets you retry and download the original data for diagnosis.

The first test verifies that a stale writer is rejected and the newer save survives. There is no Web Locks implementation, server, polling coordinator or distributed lock. A storage event warns an open page when another tab changes data, preserving its form entries. Revision checks reject sequential stale saves; localStorage cannot guarantee atomic compare-and-swap between simultaneously executing tabs or across devices. Production concurrency requires a server transaction.

The initial fictional records match the October 15 Figma examples. The last-school-update label is the seeded record's date, not evidence of a live MIS sync. Manual lookup availability does not claim a connected card reader.

## Design reference

Use the [current Figma page](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=174-4208) and [BRD v2.2.1](docs/BRD.md). Administration is deferred; doctor accounts and clearances are excluded. Patient history uses a dropdown of recorded complaints. Follow-up notes support Edit note, Save changes and Cancel, retaining original authorship and accessible edit history.

[Complete screen/route map](docs/figma-route-map.md): 348 screen/state frames and four guide frames. Every frame was inspected live before recording the map. Each screen must additionally receive high-fidelity design-context inspection before its implementation. Different breakpoints and fictional outcome examples generally map to one route with record-driven state.

Figma supplies all downloaded icons and the original login illustration. Open Sans regular, semibold and bold are local, with the SIL Open Font License in `assets/fonts/OFL.txt`. CSS uses shared Figma tokens; no external asset requests are required at runtime.

## Boundaries

This frontend does not connect to RFID equipment, MIS, email/SMS providers, Messenger or production authentication. It cannot establish secure storage, clinical authorization, protected backups or multi-device uniqueness. Remaining operational decisions in the BRD stay open. Do not interpret a prototype demonstration as a production acceptance result.
