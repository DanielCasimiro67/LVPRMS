# Business Requirements Document (BRD)
## La Verdad Patient Record Management System (LVPRMS)

| Field | Detail |
|---|---|
| Project | LVPRMS — School Clinic Digital Records and Communication System |
| Client | School Clinic, La Verdad Christian College – Apalit |
| Owner | Maynard Villar (Business Analyst) |
| Document No. | BRD1 |
| Version | **2.2.1 — REVISED DRAFT FOR VALIDATION** |
| Date | October 15, 2026 |
| Supersedes | BRD v2.2.0 |
| Status | Incorporates the project team's latest scope instructions. Operational choices marked proposed or open remain subject to validation; this document is not yet a signed baseline. |

### Version history

| Version | Date | Summary |
|---|---|---|
| 1.0.0–1.4.0 | Aug 28–Sep 25, 2026 | Earlier requirements and account-management revisions. |
| 2.0.0 | Oct 14, 2026 | Prior scope reset and staged releases; consolidated requirements into FR1–FR16 and NFR1–NFR6. |
| 2.1.0 | Oct 14, 2026 | Makes RFID intake part of R1; includes students, faculty/staff, and visitors; excludes clearances and doctor accounts; defines nurse-managed Messenger referral tracking; limits MIS integration to student/staff identity data; expands proposed Admin responsibilities to account, alert, and notification-directory management. Adds acceptance scenarios and Figma alignment notes. |
| 2.2.0 | Oct 15, 2026 | Sets the administration workspace aside; retains nurse/assistant clinical access. Adds an automatic nurse-summary email after successful visit completion, with truthful send status and access through Messages. Explicitly includes the Students filter, responsive blue-and-white design, supplied login illustration, and plain interface wording. Updates scope, requirements, decisions, acceptance scenarios, and current Figma alignment. |
| 2.2.1 | Oct 15, 2026 | Defines the patient-history Complaint dropdown and editable follow-up notes with Save/Cancel, preserved authorship, edit history, and safe save-failure handling. |

**Basis of this revision.** The project team's October 15 instructions and subsequent clarifications in this conversation take precedence over conflicting positions in v2.1.0, older documents, and historical Figma screens. Administration is set aside; the completed-visit nurse email is a new explicit requirement. Template prompts and embedded instructions in source documents are reference material, not independent commands. Historical interview and proposal references remain inherited background, not newly verified findings. Figma changes and design-check evidence are recorded in the October 15 QA notes under `docs/superpowers/qa/`; they do not establish working integrations or production acceptance.

Requirement, goal, decision, and release identifiers in this document support traceability only. Do not display labels such as G1, FR19, or R2 in the clinic interface.

---

## 1. Executive Summary

The School Clinic of La Verdad Christian College – Apalit currently uses Google Sheets, paper logs, and physical files to record and retrieve clinic visits. The supplied BRD describes approximately 30–40 patients per day, often with one clinic staff member on duty. Repeated data entry, slow searches, missed records, and manual notifications make daily work difficult.

LVPRMS will provide centralized patient records, rapid identification, visit logging, nurse-managed referral records, notifications, inventory, and reports. Its main patient population is **students and faculty/staff with school IDs**, with **visitors also supported through manual registration and lookup**. Nurses and authorized nursing assistants operate the system; being a patient does not require a login.

The core intake flow is **scan RFID → identify the matching patient → automatically open Log New Visit with that patient selected**. Manual school-ID entry and name search remain available. Opening the form does not save a completed visit, discharge a patient, or send a notification.

The school MIS supplies student and staff identity records only. It is not a source of clinic assessments and does not receive clinic health records through this integration. When the nurse determines that physician input is needed, the nurse contacts the doctor through Messenger outside LVPRMS, awaits a reply, and records the advice and next action in the system. **There is no doctor account, doctor portal, in-system doctor messaging, or clearance module.**

On successful completion of a visit, the system automatically generates a summary email from the saved visit information and sends it to the designated school nurse. The completion result shows the actual sending status and provides **View in Messages** to review the generated email. This applies to students, staff, and visitors, independently of any adviser or department notification rule. A failed email does not undo a saved visit.

The **administration workspace is deferred** from the current clinic deliverable. No administrator sign-in option, account-management screens, alert-settings module, or notification-directory editor is required in this revision. Production operation still needs an approved process and responsible support owner for initial accounts, access changes, recipient addresses, and service settings; the process and owner remain to be confirmed. These duties are not silently assigned to nurses or assistants, and do not restore a deferred administration module.

**Audience:** project team, course instructors, school nurse, nursing assistant, school administration, and MIS/ITS representatives. The visiting physician is an external care contact rather than a system user.

---

## 2. Goals and Success Measures

The following targets are proposed acceptance measures to validate with the clinic.

| ID | Goal | Proposed measure | Basis |
|---|---|---|---|
| G1 | Identify patients quickly | A valid, uniquely mapped RFID scan opens the correct patient's Log New Visit form within 10 seconds on the agreed clinic setup; manual search results appear within 10 seconds. | Latest RFID instructions; earlier search requirement |
| G2 | Capture clinic encounters reliably | Every encounter involving assessment, treatment, or referral is logged the same day; weekly pilot spot-checks find no missing encounters. | Earlier BRD |
| G3 | Avoid repeated identity entry | Known students/staff require no re-entry of identity details already available from MIS; existing visitors reuse their clinic record. | Latest MIS and patient-scope instructions |
| G4 | Maintain useful patient history | Authorized clinic users can review visits and follow-up notes, including physician advice recorded by the nurse, and filter by date and complaint. | Earlier BRD; latest referral instructions |
| G5 | Keep the nurse informed and show message outcomes | Each successfully completed visit creates one nurse-summary email event, visible in Messages with its actual status; repeated completion/save requests do not create duplicate sends. Other approved event notifications use their own routing. | October 15 nurse-email instruction; earlier notification requirements |
| G6 | Support routine clinic operations | After the pilot, LVPRMS becomes the primary visit record, with a documented downtime procedure and reconciliation of temporary records. | Earlier adoption goal, refined for continuity |

---

## 3. Stakeholders and System Users

| Role / group | Involvement and access | Login? |
|---|---|---|
| School Nurse | Primary clinical user: identifies patients, logs visits, reviews history, decides whether physician input is needed, contacts the doctor externally, records relayed advice, and closes encounters. | Yes |
| Nursing Assistant | Authorized clinical support user: identification, registration, visit documentation, and other clinic duties permitted by school policy. Clinical authority and referral decisions are not granted merely by system access. | Yes |
| Administrative/support owner — assignment pending | Responsible operational contact for approved account, service, and recipient setup. Administration screens and the administrator role are deferred from the current deliverable. Support responsibility does not grant clinical access. | No administrator login in current scope |
| Students | Primary patient group; identified by school ID/RFID or manual search. | No |
| Faculty and other school staff | Primary patient group; identified by school ID/RFID or manual search. Employment does not automatically grant system access. | No, unless separately authorized as a system operator |
| Visitors / guests | Additional patient group; manually registered with a clinic-generated identifier and treated through the same visit-record workflow. | No |
| Visiting School Physician | Receives nurse communication through Messenger and replies there. The nurse records the communication and subsequent action. | **No doctor role or account** |
| Homeroom Advisers | Student notification recipients according to configured rules. | No |
| Department Heads | Faculty/staff notification recipients according to configured rules. | No |
| Assistant School Principals / designated administrators | Receive configured incident or escalation notifications. | No |
| MIS / ITS representatives | Supply authorized school identity-data access and technical support through an agreed process. Holding a technical job does not automatically grant clinic access. | No clinical or administrator account assumed |

### Deferred administration and operational support

The earlier administrative-workspace proposal is set aside by the latest instruction. Account CRUD, reset/deactivation screens, alert configuration, and directory maintenance are deferred requirements. Current clinic users retain their own account/password utilities and secure sign-in/sign-out. Before production, the school must approve how authorized personnel provision or revoke access and maintain service/recipient settings without relying on the deferred UI. MIS/ITS may be considered as an operational owner, but no department or individual is confirmed. Broad administrative rights are not added to clinical accounts as a workaround.

---

## 4. Project Scope

### 4.1 In scope, by release

| Release | Contents | Requirements |
|---|---|---|
| **R1 — Core Records and RFID Intake** | RFID/manual identification; automatic opening of Log New Visit for a match; MIS-sourced student/staff identity data; visitor registration; patient-type filters; visit logging and history; vital signs; secure clinic access and own-account utilities. Responsive clinic UI and the approved visual theme apply throughout. | FR1–FR9, FR16; NFR1/NFR4 |
| **R2 — Referral Tracking and Notifications** | Nurse-managed referral tracking and documentation of Messenger replies; printable referral summary; automatic nurse-summary email after visit completion; Messages inbox/detail and sending-status recovery; other approved SMS/email event notifications. No administration screens. | FR10–FR12, FR19 |
| **R3 — Inventory and Reports** | Medicine/supply stock and reports covering all supported patient types. | FR13–FR14 |

R1 must be usable for daily clinic work. The existing staged approach is retained: R2 follows acceptance of R1; R3 follows acceptance of R2. Before R2, doctor contact and concerned-party notifications continue manually. Before R3, inventory remains managed through the clinic's existing process.

Automatic nurse-summary delivery is a required part of R2. Before that capability is implemented, an earlier core pilot must use the agreed manual process and must not show a fictitious sent confirmation. The prototype can illustrate all releases; production release availability must be explicit.

### 4.2 Out of scope or deferred

| Item | Status | Scope boundary |
|---|---|---|
| Administration workspace, administrator login, account-management screens, alert-settings editor, and notification-directory editor | **Deferred** | Set aside by the latest instruction. FR15, FR17, and FR18 remain documented for traceability but are not current release commitments. Necessary operational setup/access controls remain dependencies under D10. |
| Clearance forms, issuance, approval, and tracking | **Out** | Explicitly excluded by the latest instructions; no clearance module or milestone. |
| Doctor role, doctor login, doctor dashboard, doctor work queue | **Out** | Physician communication is handled externally by the nurse. |
| Messenger API integration, in-system chat, automated reading of doctor replies | **Out** | The nurse sends messages and manually documents replies. |
| Online consultation, student pre-visit symptom submission, appointments, patient portal | **Out** | Face-to-face clinic workflow; patient coverage does not imply patient accounts. |
| MIS medical-record exchange or writing clinic data back to MIS | **Out** | MIS supplies school identity data only. |
| Public account sign-up / patient self-registration | **Out** | Authorized personnel manage accounts and patient registration. |
| Automated medication dispensing or automatic medical certificates | **Out** | Not required for the stated workflow. |
| Outside-hospital EHR integration | **Out** | Referral destinations may be recorded without connecting to hospital systems. |
| Patient photographs, scanned forms, prescription-image uploads | **Out for current releases** | Retains the prior draft's limited-data approach; typed clinical notes remain available. |
| Complaint-spike detection and class-suspension recommendations | **Deferred** | Alert configuration in this revision means supported visit-event notifications. Figma contains spike-related concepts, but their thresholds, recipients, and business ownership are not approved here. |
| Medication reminders; additional unspecified charts | **Deferred** | Require separate justification and scope approval. |
| Theme switching and decorative animation as standalone features | **Not baseline requirements** | The agreed blue-and-white visual identity and responsive layouts are required under NFR1. A dark-mode toggle or decorative animations are not additional business requirements. |

RFID, visitor handling, automatic nurse-summary email, and other approved SMS/email notifications are in scope. Hardware, integration method, sending services, and routing details remain dependencies. Deferring administration screens does not remove the nurse-email requirement or authorize unapproved recipient routing.

---

## 5. Business Drivers

1. **Slow identification and retrieval.** RFID and manual lookup reduce the time needed to locate students and staff, while visitors remain serviceable without school IDs.
2. **Missed or delayed documentation.** Immediate access to the correct new-visit form reduces intake steps when several people arrive together.
3. **Repeated identity entry.** MIS-sourced school records avoid retyping available student/staff details; a returning visitor reuses the clinic record.
4. **Fragmented referral follow-up.** Messenger remains the communication channel, but the clinic needs a local record of contact attempts, pending replies, instructions, and actions. The system cannot guarantee a faster doctor reply.
5. **Manual notification and maintenance work.** Automatic nurse summaries reduce repeated visit-summary preparation; Messages makes generated content and failures visible. Other approved routing and a defined operational support process remain necessary while administration screens are deferred.

---

## 6. Present Process

The supplied documents describe patients arriving at the clinic, being assessed by the nurse or assistant, and having complaints and vital signs written on paper or entered into Google Sheets. Records are harder to complete during busy periods. Historical records are stored in physical files and spreadsheets.

When physician input is necessary, the nurse contacts the doctor through Messenger and waits for instructions. Referral paperwork may accompany the patient when appropriate. Advisers, department heads, and administrators are contacted manually. These background statements are inherited from the supplied documents and latest clarification; they are not new interview findings.

---

## 7. Proposed Process

### 7.1 Patient identification and new-visit flow

1. An authorized nurse or nursing assistant signs in and opens the clinic dashboard.
2. For a student or staff member, the operator scans the school RFID card or enters the school ID. Name search is available when a card is absent or unreadable.
3. If the identifier resolves to exactly one patient, LVPRMS **automatically opens Log New Visit for that patient**, with identity fields populated and patient identity clearly visible. The operator does not need to select the patient again or manually navigate through the patient record first. History remains accessible from the form.
4. The operator checks the displayed identity while documenting the complaint and assessment. A scan opens an unsaved form; the operator saves the encounter explicitly.
5. A known MIS person without clinic history is treated as a known identity: initialize the local clinic link and open the first visit without retyping available MIS details.
6. For an unknown RFID or school ID, show a clear no-match message and offer manual search and authorized registration. Do not classify the person as a visitor solely because a scan fails. An ambiguous match must be resolved before opening a patient-specific visit.
7. For a visitor, search existing clinic records first. If no match exists, register the visitor with a clinic-generated identifier and minimum identity details, then open Log New Visit. A school ID, grade, section, or MIS record is not required.
8. Repeated scans must not create duplicate visits. If a draft or active encounter already exists for the same patient, offer to resume it. Scanning another card must not overwrite an unsaved patient's form.

Patient search provides **All patients, Students, Staff, and Visitors** filters. Selecting Students displays student records only; Staff and Visitors likewise show their own patient category. Returning to All patients restores the combined list. Filters do not change a patient's category or create a new record.

### 7.2 Assessment, saving, and disposition

The clinic user records the complaint, relevant vital signs, assessment, treatment, supplies used, and current encounter state. Several encounters may remain in progress. The nurse decides whether the case can be handled in the clinic or needs physician input; a scan or a severity label alone does not send a case to a doctor.

Recommended encounter states are **In progress**, **Resting in clinic**, **Awaiting doctor reply**, and **Completed**. A completed encounter has a disposition such as **Returned to class/work**, **Left clinic after treatment** (including visitors), **Sent home**, or **Referred to an external facility**. The final disposition is not required to save an ongoing encounter, but is required to complete it.

The visit links to patient history. Once R3 is released, recorded medicine/supply use updates inventory. A patient scan or an unsaved form does not create a reportable completed encounter, deduct stock, or send alerts.

Before **Complete visit**, explain that completion generates an email summary for the designated nurse. Validate and save the completed encounter first, then create its nurse-email event. Show **Visit completed** alongside the actual email state: pending, sent, failed, or missing recipient. Show **Email sent** only after the sending service accepts the send. Provide **View in Messages** to inspect the summary and status even when sending is pending or fails. Do not require the operator to write the summary manually or choose a doctor account.

#### 7.2.1 Patient history and follow-up notes

Patient history provides a Visit date filter and a **Complaint dropdown**, not a free-text complaint search. The dropdown defaults to **All complaints** and lists distinct complaints recorded for the selected patient, including custom complaints recorded through Other. Selecting a complaint matches that complaint and can be combined with the date filter. All complaints clears only the complaint filter. A patient with no visits still has All complaints and a clear empty-history message. This history filter is separate from choosing a complaint while logging a visit under FR8.

Authorized nurses and nursing assistants can add and **edit follow-up notes** on the patient record. Edit note opens the existing text with **Save changes** and **Cancel**. Cancel leaves the saved note unchanged; blank edits are rejected. Saving retains the original author and creation time, identifies the latest editor and edit time, and preserves previous text, authors, and timestamps in accessible **Edit history**. Editing a note does not alter the patient's identity, visit status, inventory, or sent email snapshots. Failed or stale saves retain the entered text and do not overwrite newer records.

### 7.3 Nurse-managed physician referral

1. The nurse determines that physician input is needed and records the reason in the visit.
2. The nurse contacts the doctor through Messenger outside LVPRMS.
3. The nurse records the contact time and updates the referral to **Awaiting doctor reply**. Preparing a referral record is not evidence that contact has occurred.
4. While waiting, the encounter stays visible in the nurse's referral list. The nurse can add follow-up contact attempts and notes.
5. When a reply arrives, the nurse records the doctor's name, reply time, relevant advice/orders, and planned next action, attributed to the nurse who entered the information. The status becomes **Advice received**.
6. The nurse records actions taken and the final outcome, then marks the referral **Resolved**. An external destination or printable referral summary can be recorded when needed.

The system does not claim a doctor reviewed or approved an entry inside LVPRMS. Waiting for a Messenger reply must not technically prevent documenting an urgent transfer or other action under the clinic's existing procedures. Exact clinical escalation rules remain owned by the clinic.

### 7.4 Messages and notification rules

#### 7.4.1 Required completed-visit email to the nurse

1. A successful transition to **Completed**, for any supported patient type or outcome, creates one nurse-summary email event linked to that visit.
2. Generate the subject and body from the saved visit rather than unsaved fields. The template identifies the patient and patient type, visit/completion date and time, complaint, available relevant assessment/vitals/care information, recorded outcome, and recording clinic user. Do not invent missing clinical values. Final field selection and permitted clinical detail require clinic approval under D11.
3. Address the message to the designated school nurse using a verified operational address. The nurse account/email address is not hardcoded to the fictional person shown in Figma. Adviser/department routing is separate and must not receive this clinical summary by default.
4. Store the generated subject/body snapshot, recipient, event time, status, and send-attempt history in **Messages**, linked to the completed visit. An authorized clinic user can open it from the completion confirmation or Messages, then return to the corresponding visit.
5. Show generated/pending status before a send succeeds; show sent after provider acceptance; show failed or missing-recipient guidance when applicable. Provider acceptance does not mean delivery or reading has been confirmed.
6. Repeated saves, refreshes, duplicate completion requests, and controlled retries must not create duplicate completion-email events or unrelated messages. Retry the existing event. A later clinical correction retains its audit trail and the original email snapshot; it does not silently resend or rewrite a previously sent email.
7. A sending outage or unavailable recipient must not prevent a valid visit from being completed and saved. Keep the summary and failure visible for retry or documented manual follow-up.

The completion trigger, nurse recipient role, automatic generation, and Messages visibility are resolved requirements. D11 covers the actual address, approved template/clinical detail, and operational sending arrangements—not whether this feature is included.

#### 7.4.2 Other concerned-party notifications — proposed routing

The following starting rules concern advisers, department heads, and other external recipients. Exact triggers, recipients, channels, and templates remain **open under D4**. They do not disable or replace the required nurse email above.

| Saved event | Student routing | Faculty/staff routing | Visitor routing | Additional escalation |
|---|---|---|---|---|
| Ordinary treated visit completed | No adviser message by default | No department message by default | No external-contact message by default | Nurse-summary email is required separately under 7.4.1 |
| Patient remains/rests in clinic | Homeroom adviser | Department head | Authorized contact only if recorded and applicable | As configured |
| Patient sent home | Homeroom adviser | Department head | Authorized contact only if recorded and applicable | Designated school recipient; ASP routing for students subject to D4 |
| Nurse records physician contact / awaiting reply | Homeroom adviser | Department head | Authorized contact only if recorded and applicable | Designated recipient under the approved referral rule |
| External referral/transfer recorded | Homeroom adviser | Department head | Authorized contact only if recorded and applicable | Designated recipient under the approved escalation rule |

SMS, email, or both may be used for an approved concerned-party rule; the current scope does not require an in-app rule editor. An adviser or department head is not required for visitors. Missing recipients must be visible without blocking visit documentation. These non-clinical recipients receive only minimum approved information, not full clinical notes or physician orders. The authorized nurse-summary template is governed separately by 7.4.1 and D11. Doctor communication remains manual through Messenger.

Repeated saves of the same event must not create repeated messages. A meaningful status transition may generate a new event. Display pending, sent, failed, or unavailable/missing-recipient states accurately; a provider accepting a message is not proof that a person read it.

### 7.5 Clinic navigation and design requirements

Use **Today, Patients, Referrals, Inventory, and Reports** as the clinical navigation. **Messages** is available as a utility and from completion confirmations; **My account** and **Sign out** are account utilities. Preserve the existing beginner-friendly workflows and patient identity visibility while refining presentation.

Use the original LVCC Clinic System's **blue-and-white theme**, readable typography, coherent line icons, subtle card shadows, clear borders, and consistent fields/buttons/status labels. Apply the supplied school illustration to the login page proportionally, with a readable sign-in form; adapt crop, placement, and form alignment for desktop, tablet, and phone without stretching the artwork. Patient-document upload functionality is not implied by a login background image.

Maintain responsive desktop, tablet, and phone layouts; the current design reference widths are 1440, 1024, and 390 pixels. On smaller screens, stack form groups and filters, provide compact navigation, and allow long email content to scroll without clipping. Use plain clinic wording and hide document traceability codes, fixture IDs, testing controls, and implementation notes from ordinary product screens. Genuine school identifiers remain available where needed for patient identification.

---

## 8. Functional Requirements

**Priority:** 1 Immediate/core requirement; 2 High; 3 Moderate; 4 Low. Release allocation defines delivery order. Existing FR1–FR18 identifiers are retained; FR19 is added. There are **19 documented functional requirements: 16 in current scope and 3 deferred (FR15, FR17, FR18)**, plus 6 non-functional requirements. Deferred items have no current release commitment.

### 8.1 Identification and patient records

| ID | Requirement | Priority | Release | Basis |
|---|---|---|---|---|
| FR1 | Identify students/staff using RFID or manual school ID and support partial-name search for all patient types. Provide All patients, Students, Staff, and Visitors filters, with category-correct results and a return to the combined list. A unique RFID match automatically opens the matched patient's Log New Visit form with identity populated. Manual ID matching uses the same intake path. Handle unknown/ambiguous identifiers, repeated scans, and existing drafts as defined in 7.1. A scan is patient identification, not operator authentication. | 1 | R1 | Latest intake/filter instructions; prior FR1 |
| FR2 | Obtain student and faculty/staff identity data from the school MIS through an approved one-way import/sync method. Include stable school identifier, name, patient type, grade/section for students, department for staff, and RFID mapping when available. Keep school identity data distinct from clinical records. Updates must preserve visit histories and visitor records, avoid duplicates, and never transmit clinic health data to MIS. Show last successful update and failures. Integration method and frequency remain D3. | 1 | R1 | Latest MIS clarification |
| FR3 | Let authorized clinic users register visitors and provisionally register school patients missing from the current local dataset after checking for duplicates. Require name and patient type; assign a unique local patient identifier. Record school ID when available for school patients; grade/section applies only to students and department only to staff. Visitors do not require school or RFID IDs. Mark unverified school identities and reconcile them with later MIS data without duplicating or losing history. | 1 | R1 | Latest visitor scope; prior registration requirement |
| FR4 | Show patient identity and chronological visit history, newest first. Filter by visit date and a dropdown of distinct recorded complaints, defaulting to All complaints. Authorized clinic users can add and edit follow-up notes using Save changes/Cancel; reject blank text, preserve original authorship/time and prior versions, and display latest editor/time and Edit history. Failed/stale saves retain input without overwriting newer data. Historical visits remain accessible when school identity details change or the person becomes inactive. See 7.2.1. | 1 | R1 | Prior FR4; October 15 patient-record correction |

### 8.2 Visit logging

| ID | Requirement | Priority | Release | Basis |
|---|---|---|---|---|
| FR5 | Save an encounter against the selected patient with automatic date/time and logged-by, complaint, relevant vitals, assessment notes, treatment, supplies used, encounter state, and final disposition when completed. Clearly distinguish opening an unsaved form, saving an ongoing encounter, and completing it. | 1 | R1 | Prior FR5; latest RFID flow |
| FR6 | Support several ongoing encounters for different patients and show an in-clinic list. Permit at most one active encounter per patient across users/devices; repeated identification resumes existing work. Preserve patient-specific drafts and prevent one patient's scan from replacing another patient's unsaved data. Show pending physician-contact cases once R2 is available. | 1 | R1 | Agreed one-active-visit workflow; prior FR6 |
| FR7 | Require patient, complaint, and encounter state when saving an ongoing visit; require final disposition when completing it. Keep other fields optional unless required for the chosen action. Explain missing required information and preserve entered data. | 2 | R1 | Prior minimal-entry principle, reconciled with pending encounters |
| FR8 | Offer a predefined complaint list and Other with free text. Initial proposed entries: dysmenorrhea, fever, colds, headache, abdominal pain, eye pain, wound/scratch, and anxiety/stress. Clinic validates the list. | 2 | R1 | Prior FR8 |
| FR9 | Record relevant vital signs per encounter and show historical values. Proposed fields include temperature, pulse, and blood pressure; clinic validates the final set. | 2 | R1 | Prior FR9 |

### 8.3 Referrals and notifications

| ID | Requirement | Priority | Release | Basis |
|---|---|---|---|---|
| FR10 | Maintain a nurse-managed referral linked to the encounter: reason, doctor/destination, contact attempts, Messenger contact time, waiting status, reply time, relayed advice/orders, action taken, and resolution. Support Prepared, Awaiting doctor reply, Advice received, and Resolved statuses. Only an authorized clinic user updates it; no doctor account or electronic physician approval is implied. Produce a printable referral summary populated from available patient and visit data when needed. | 2 | R2 | Latest referral instructions; prior FR10 |
| FR11 | Send SMS and/or email for approved concerned-party events using patient-type routing, maintained recipients, and approved minimal-disclosure templates. No notification on RFID scan alone. Prevent duplicate sends for the same saved event/recipient/channel. Do not send full clinical records to advisers or other non-clinical recipients, or replace nurse-to-doctor Messenger contact. Nurse completion summaries are required separately under FR19. No administration editor is required in current scope. | 2 | R2 | Prior FR11; current scope clarification |
| FR12 | Provide authorized clinic users with a Messages inbox and message details: generated subject/body, intended recipient/channel, linked visit, timestamps, and actual sending status/attempt history. Include automatic nurse summaries and other approved visit messages. Show pending, sent, failed, and missing-contact states accurately. Support controlled retry without duplicate messages and recorded manual follow-up. Failure must not roll back a saved visit. | 2 | R2 | October 15 Messages instruction; prior FR12 |
| FR19 | After a visit is successfully saved as Completed, automatically generate a summary email from that saved visit and send it to the designated nurse, for students, staff, and visitors and all completion outcomes. Include only available, approved visit information, retain its subject/body snapshot in Messages, and provide the completion status and View in Messages action defined in 7.4.1. Show Email sent only after provider acceptance. Do not send on an unsaved form, scan, or ordinary ongoing save; prevent duplicate completion events and preserve correction/send history. | 2 | R2 | October 15 explicit nurse-email requirement |

### 8.4 Inventory and reports

| ID | Requirement | Priority | Release | Basis |
|---|---|---|---|---|
| FR13 | Track medicine and supply stock, record stock additions/adjustments, and deduct quantities used in saved encounters. Editing or retrying a save must not deduct the same use twice; corrections retain an audit trail. | 3 | R3 | Prior FR13 |
| FR14 | Provide a printable daily patient log, monthly totals, visits by complaint and patient type, student visits by grade/section, staff visits by department, frequent-patient listing, and date/complaint filters. Include visitors without assigning them a school grade or department. Access is restricted to authorized clinic users; additional report types remain D8 and do not reinstate deferred administration. | 3 | R3 | Prior FR14 extended to confirmed population |

### 8.5 Clinic access and deferred administration

| ID | Requirement | Priority | Release | Basis |
|---|---|---|---|---|
| FR15 | **Deferred:** administrator account-management UI and permission set for creating/updating operator accounts, resets, and deactivation/reactivation. Any future implementation must preserve historical authorship and restrict clinical access. This revision requires no administrator login or account-management screens; operational provisioning/revocation is addressed under D10, and own-password changes under FR16. | — | Deferred | Latest instruction sets administration aside; retains prior FR15 for traceability |
| FR16 | Require clinic-operator authentication, enforce nurse/authorized-assistant permissions, end sessions on logout/inactivity, and deny access after session termination or operational account deactivation. Provide My account and a secure own-password change without exposing stored passwords. No public signup, patient accounts, doctor accounts, or current administrator login. RFID scans do not authenticate or authorize an operator. | 1 | R1 | Prior FR16; current access scope |
| FR17 | **Deferred:** in-app administrative editor for supported event rules, channels, recipient groups, and approved templates, with change history. Required production sending arrangements must still be agreed operationally under D4/D10/D11. Deferral of the editor does not defer FR19 or authorize complaint-spike rules. | — | Deferred | Latest instruction sets administration aside; retains prior FR17 |
| FR18 | **Deferred:** in-app administrative notification-directory maintenance. Operationally verified recipient details remain necessary for FR11/FR19 and must stay separate from MIS patient identity updates. No directory-management screens or administrative clinical access are introduced in this revision. | — | Deferred | Latest instruction sets administration aside; retains prior FR18 |

---

## 9. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR1 | **Usability and visual consistency.** Non-technical clinic staff can use the workflows in 7.5 with plain wording, visible labels, clear statuses and recovery actions, consistent blue-and-white styling, and the supplied proportionally fitted login illustration. Support desktop/tablet/phone reflow, readable controls, and scrollable email content without clipping. No requirement/release/fixture codes or testing controls appear in ordinary screens. A known patient's minimal visit should be recordable in under one minute during pilot testing, excluding assessment time; patient identity remains visible during documentation. These are acceptance targets, not established usability results. |
| NFR2 | **Performance and compatibility.** A supported RFID scan opens the correct new-visit form within 10 seconds; manual search results appear within 10 seconds under the agreed clinic workload. Validate reader/card compatibility, several concurrent users, and the actual dataset. These are proposed targets, not measured results. |
| NFR3 | **Privacy and security.** Limit collected data and access to operational needs; protect stored passwords with secure hashing and protect data in transit. Audit clinical edits, message events, and operational access/configuration changes. Only authorized clinical users can view clinical Messages content. Restrict nurse-summary clinical content to the approved nurse recipient; concerned-party alerts use their separately approved minimal content. Support ownership does not grant clinical access. Confirm template disclosure, retention, backup access, and other privacy controls with the school. |
| NFR4 | **Deployment.** Provide browser access on approved clinic devices and a supported RFID reader connection. Confirm hosting, network, and reader setup under D5/D9. No public registration is provided. |
| NFR5 | **Reliability and recovery.** Back up records and document a tested restore procedure. MIS or SMS/email outages must not prevent use of available local patient data and visit recording while LVPRMS remains available. Show stale-sync/failure status. If LVPRMS itself is unavailable, use the clinic's approved downtime process and reconcile afterward. |
| NFR6 | **Data integrity.** Give every patient a stable local identifier and maintain verified school-ID/RFID mappings separately. Never match people by name alone during sync. Resolve duplicate/ambiguous source data explicitly, preserve visitor records and visit history, audit reconciliation and corrections, and prevent duplicate encounters, stock deductions, or notifications on repeated input. |

---

## 10. Assumptions, Dependencies, and Risks

### Assumptions

- Nurses and authorized nursing assistants operate the clinic functions; patients do not use a portal.
- Faculty are included in the school-staff patient category.
- Visitor registration is handled by clinic personnel and remains local to LVPRMS.
- Administration UI and administrator access are deferred. Operational support ownership and procedures remain to be assigned; nurses/assistants do not gain broad support privileges by default.
- The completion-email recipient is a designated nurse with a verified address, separate from adviser/department recipients; Figma names and addresses are not production configuration.
- Existing clinic procedures govern referral judgment and urgent action; the software records rather than makes those decisions.

### Dependencies

- Authorized access to student and staff identity data from MIS, including an agreed stable key and update process.
- Compatible RFID cards/readers and a reliable mapping from scanned values to school identities. A card UID must not be assumed to equal the printed school ID.
- An agreed owner for RFID mapping or replacement-card updates if MIS does not supply this mapping.
- Approved SMS and email services, sending credentials, funding, and maintained recipient contacts.
- An appointed operational account/configuration owner and backup, with an approved provisioning/revocation and recipient-update procedure while administration UI is deferred.
- A verified nurse email address, approved summary template/content, sender identity, and reliable service-status feedback for completion emails.
- Approved hosting, backups, access controls, and clinic downtime arrangements.

| Risk | Impact | Mitigation |
|---|---|---|
| Reader mismatch or unavailable RFID mapping | Scan cannot identify the patient | Validate hardware and mapping early; retain manual lookup. |
| Unknown, duplicate, or stale MIS identity data | Wrong or duplicate patient record | Validate source keys, show sync age/errors, require explicit reconciliation. |
| Visitor mistaken for a missing school record | Incorrect classification/routing | Choose patient type explicitly; never infer visitor status from a failed scan. |
| No operational support owner while administration is deferred | Accounts, access changes, or recipient settings cannot be maintained reliably | Resolve D10 before go-live; approve a process and backup without adding an unapproved admin module. |
| Delayed Messenger reply | Referral remains pending | Show waiting cases and contact attempts; allow documentation of actions under existing clinic procedures. Do not promise response-time improvement. |
| Missing/outdated contacts or gateway failure | Notifications do not reach intended recipients | Validate directory, show failures, and support manual follow-up and controlled retry. |
| Duplicate scans, completion requests, or repeated saves | Duplicate encounters, nurse emails, other messages, or stock changes | Resume existing work; create one completion-email event per completed visit and retry that event rather than creating a new send. |
| UI shows Email sent before service acceptance | Clinic staff believe an unsent email reached the nurse | Separate visit-save success from actual message status; retain pending/failed states and the generated summary in Messages. |
| Excessive clinical disclosure | Patient confidentiality compromised | Restrict permissions and approved message content; review access and retention with the school. |
| Prototype features treated as approved scope | Unplanned modules or contradictory workflows | Apply Section 13 and the alignment notes in Appendix C. |

---

## 11. Evidence and Validation Notes

The supplied v2.0.0 document reports interview gaps and transcription issues. Those claims were not independently checked against the original transcript here. Background quantities, complaint lists, report choices, and notification policies therefore remain inherited context or proposed details, not newly verified findings.

The latest instructions resolve patient population, RFID inclusion, clearance/doctor exclusions, MIS boundaries, administration deferral, the Students filter, responsive visual direction, and the completed-visit nurse email/Message view. They do not identify production recipients, a support owner, approved email content/disclosure, sending credentials, hardware, integration schedule, or clinical escalation timing. Those remaining details are recorded in Section 12.

Figma provides design context. Screen existence and labels do not establish business approval, backend behavior, or a successful end-to-end test.

October 15 QA notes record design-structure, navigation, and representative visual checks, including the latest 171 targeted assertions for filters and generated-email states. These checks concern an editable prototype with fictional data. No real email delivery, RFID hardware, MIS connection, production authentication, or clinical acceptance is evidenced by those results.

---

## 12. Decisions and Items to Confirm Before Baseline

### 12.1 Resolved scope decisions

| ID | Decision | Current position |
|---|---|---|
| D1 | Patient population | Students and faculty/staff are the primary population; visitors are also supported. Patient accounts are not required. |
| D2 | Clearances | Excluded entirely from the current scope and milestones. |
| D5 — scope | RFID inclusion and intake destination | Included in R1; a unique scan match automatically opens Log New Visit for that patient. Hardware details remain open below. |
| D6 — role/channel | Doctor account and communication | No doctor role or login. Nurse contacts doctor through Messenger and documents replies and actions. |
| D3 — purpose | MIS integration boundary | Read school student/staff identity data only; no clinical-data sync or writeback. |
| D10 — scope | Administration workspace | Deferred from current scope; no administrator login or administration screens. Operational support ownership remains open below. |
| D11 — scope | Completion summary email | Successfully completed visits automatically generate an email to the designated nurse, with truthful status and a matching summary in Messages. Applies to all supported patient types and outcomes. |
| D12 | Patient filters and visual direction | All patients, Students, Staff, Visitors; beginner-friendly responsive blue-and-white design with the supplied login illustration. |

### 12.2 Open operational decisions

| ID | Decision needed | Draft position / action | Suggested decision owner | Affects |
|---|---|---|---|---|
| D3 | MIS interface, accessible fields, source key, update interval, and reconciliation owner | Approve an API, read-only integration, or scheduled file import with equivalent one-way behavior. No real-time guarantee is assumed. Confirm whether RFID mapping is supplied. | MIS/ITS and project team | FR2–FR3, NFR6 |
| D4 | Other concerned-party events, recipients, SMS/email routing, templates, funding, and visitor contact policy | Use 7.4.2 as a starting proposal. Confirm external admission/discharge alerts and permitted overrides. The nurse completion-email trigger is already required under D11/FR19. | Nurse, school administration, MIS/ITS | FR11–FR12; deferred FR17–FR18 |
| D5 | Reader/card compatibility and mapping maintenance | Test actual equipment and replacement-card behavior; keep manual fallback. | MIS/ITS and clinic | FR1, NFR2/NFR4 |
| D6 — procedure | Referral form content, destination labels, and pending-reply/escalation procedure | Nurse-managed Messenger workflow; confirm needed printed output and clinical procedure without adding a doctor account. | Nurse and clinic leadership | FR10 |
| D7 | Migration of historical Sheets/paper records | Retain prior draft assumption of new records from go-live with a possible controlled Sheets import; confirm scope separately from MIS identity import. | Clinic and project team | R1 rollout |
| D8 | Final report content and authorized audiences | Use FR14; validate any additional reports before extending scope. | Clinic and school administration | FR14 |
| D9 | Hosting, devices, backup/restore targets, and downtime procedure | Browser-based deployment with desktop/tablet/phone layouts; confirm actual clinic devices, operating environment, and recovery targets. | MIS/ITS and project team | NFR1–NFR2, NFR4–NFR5 |
| D10 | Operational support owner, backup, and procedures while admin UI is deferred | Confirm who provisions/revokes access and maintains sender/recipient/service settings, using an approved support process. No administrator app or new broad nurse permissions are assumed. | School administration and MIS/ITS | FR16, FR11–FR12, FR19; go-live readiness |
| D11 | Nurse email address, approved summary fields, sending service, and operational handling | Confirm the designated recipient/address, sender identity, clinical detail permitted in the template, queue/retry arrangements, and handling of corrected/resubmitted summaries. Preserve required completion trigger, Messages access, duplicate prevention, and truthful send status. | School nurse, clinic leadership, and MIS/ITS | FR12, FR19, NFR3/NFR5 |

---

## 13. Change Control and Acceptance

The team and clinic baseline this document after resolving applicable operational decisions. Before go-live, the school must assign operational support ownership and approve account/recipient/service procedures, even while administration UI is deferred. Approval does not require reopening resolved scope decisions. This revision records the project team's requested changes; it is not a claim of school baseline approval.

Each later change request states the business goal, affected requirements, delivery impact, and approving owner. Changes to R1 after development starts need Project Manager and clinic approval. Prototype features that conflict with this document require either a design correction or an approved BRD change.

The following are **acceptance scenarios to execute during development/pilot**, not tests already performed.

| ID | Scenario | Expected result | Requirements |
|---|---|---|---|
| AC1 | Scan a known student's RFID while signed in | Correct student's Log New Visit opens automatically with identity populated; no completed visit or notification is created by the scan. | FR1, FR5, FR11 |
| AC2 | Identify a known staff member by supported RFID or manual school ID | Staff visit opens with staff details and appropriate department association; no student-only fields are mandatory. | FR1–FR2 |
| AC3 | Search by partial name or unreadable-card fallback | Operator can select the correct result and open a visit; ambiguous results never silently select a patient. | FR1 |
| AC4 | Scan an unknown card | No-match guidance appears; manual lookup/registration is available; no automatic visitor classification. | FR1, FR3 |
| AC5 | Register and later revisit a visitor | A unique clinic identifier is issued without school ID/grade/section; later visits reuse the record; no automatic adviser routing. | FR3, FR11 |
| AC6 | Scan repeatedly or scan another card during unsaved work | No duplicate visit and no overwritten draft; existing work can be resumed. | FR1, FR6 |
| AC7 | Sync updated school data, including a previously provisional school identity | Identity updates reconcile without duplicated patients, changed clinical notes, lost visitor records, or clinical writeback to MIS. | FR2–FR4 |
| AC8 | Nurse needs physician input and receives a later Messenger reply | Nurse records contact, waiting status, reply/advice, action, and resolution; no doctor login is needed. | FR10 |
| AC9 | Save an approved concerned-party notification event, then save it again without a new event | Intended recipients receive only the approved attempts once per event/channel; repeat save does not resend. An administration editor is not required for this scenario. | FR11–FR12 |
| AC10 | Sending service fails or recipient is missing | Visit remains saved; failure/missing-contact status is visible; controlled retry/manual follow-up is available. | FR12 |
| AC11 | **Deferred acceptance:** a future administrator changes an account, rule, or directory entry | Not a current-release gate. Reassess authorized changes, audit history, and clinical-access restrictions if administration scope is reinstated. | Deferred FR15, FR17–FR18 |
| AC12 | Operator logs out or account is deactivated | Further protected access is denied; scanning an RFID card does not restore access. | FR16 |
| AC13 | Review delivered roles, menus, and workflows | No current administrator workspace/login, doctor account/portal, or clearance module. Nurse referral tracking, clinic sign-in, My account, and Sign out remain available. | Scope, FR10, FR16 |
| AC14 | Correct a recorded supply use and run a monthly report | Stock reflects the corrected use once; report includes students, staff, and visitors under the correct categories. | FR13–FR14 |
| AC15 | Choose Students, Staff, Visitors, then All patients | Each filter shows only its category; All patients restores combined results without changing identities or duplicating records. | FR1 |
| AC16 | Complete a student, staff, or visitor visit using each supported outcome | The encounter is saved, one nurse-summary email event is generated from its saved data, and the completion result offers View in Messages with the actual sending status. No manual email composition is required. | FR5, FR7, FR12, FR19 |
| AC17 | Open the completion email through View in Messages and the Messages inbox | Recipient is the designated nurse; subject/body match the correct patient's completed visit and outcome. Show available approved data without invented values, and allow return to the matching completed visit. Other visit messages remain accessible. | FR12, FR19, NFR3 |
| AC18 | Repeat completion/save, refresh, or retry after a send failure; later correct the visit | No duplicate completion-email event or unrelated resend. Saved visit survives failure; the summary, actual status, and attempt history remain visible. Original sent content is preserved when the clinical record is corrected. | FR12, FR19, NFR5–NFR6 |
| AC19 | Complete a visit with sending unavailable or a missing nurse address | Visit completes and remains saved; Messages shows pending/failed/missing-recipient guidance, never a false Email sent label. A controlled retry or documented manual follow-up is available. | FR12, FR19 |
| AC20 | Review login and clinic screens at desktop, tablet, and phone sizes | Supplied login illustration is proportionally fitted with a readable form; blue-and-white styling, plain wording, category filters, and full scrollable email content remain usable without clipping. No traceability codes or testing controls appear in ordinary UI. | NFR1/NFR4; 7.5 |
| AC21 | Change own password or sign out as an authorized clinic user | Personal password change is secure and does not expose stored credentials; sign-out ends access. No administrative privileges are needed for own-account utilities. | FR16 |
| AC22 | Scan a card, save an ongoing visit, or attempt completion with missing required information/a failed visit save | No completed-visit nurse email is generated or sent. Preserve the form and show the relevant validation/save error; only a successfully saved completion triggers FR19. | FR1, FR5, FR7, FR19 |
| AC23 | Open a patient record and select a recorded complaint, combine with a visit date, then return to All complaints | Complaint is a dropdown with distinct values from that patient's history, including recorded custom complaints. Exact complaint/date filters work together; All complaints clears only complaint filtering. Empty history remains understandable. | FR4, 7.2.1 |
| AC24 | Edit a follow-up note, cancel, then edit and save; try a blank edit or a stale/failed save | Cancel preserves saved text. Successful edits retain original author/time, show latest editor/time, and expose all previous versions. Invalid/failed/stale saves preserve input and existing saved data. No visit, stock, or email side effects. | FR4, NFR5–NFR6, 7.2.1 |

---

## 14. Glossary

| Term | Meaning |
|---|---|
| LVPRMS | La Verdad Patient Record Management System. |
| BRD | Business Requirements Document. |
| Patient | A student, faculty/staff member, or visitor attended to by the clinic. |
| Clinic user | An authorized nurse or nursing assistant operating clinical functions. |
| System Administrator | Earlier proposed support role; its login and workspace are deferred. Operational support ownership remains necessary without automatically granting clinical access. |
| Visit / encounter | One episode of clinic attendance linked to a patient's history. |
| Encounter state | Current progress of a visit, such as in progress, resting, awaiting doctor reply, or completed. |
| Disposition | Recorded outcome when the encounter is completed. |
| Referral | Nurse-initiated request for physician input or direction to an external care facility; documented locally with external communication. |
| Relayed advice/orders | Physician instructions received externally and entered by the nurse with source and timing. |
| MIS | School Management Information System supplying student and staff identity data. |
| ITS | School IT support/services office; exact organizational designation to be confirmed. |
| RFID | Radio Frequency Identification used to identify a school patient from a supported card mapping. |
| School ID | Institutional student/staff identifier; not necessarily the same as the RFID card's scanned value. |
| Local patient identifier | Stable LVPRMS identifier for every patient, including visitors. |
| Notification directory | Maintained SMS/email recipients and their routing associations, separate from clinical records. |
| Alert configuration | Settings controlling supported notification events, recipient groups, channels, and approved templates. |
| Nurse-summary email | Automatically generated email based on a saved completed visit, sent to the designated nurse and retained in Messages with its actual sending status. |
| Messages | Authorized clinic view of generated visit emails and other approved notifications, including their content, linked visit, status, and attempt history; not a Messenger inbox or chat module. |

---

## 15. References

| Source | Location / review status |
|---|---|
| Latest project-team instructions | October 14–15, 2026 conversation; October 15 administration deferral, responsive visual/theme instructions, supplied login background, Students filter, and completed-visit nurse email take precedence. |
| BRD v2.2.0 | Immediate prior revision of this file; superseded by v2.2.1. Existing requirement identifiers retained. |
| BRD v2.1.0 | Earlier scope revision; historical mapping retained below. |
| BRD v2.0.0 revised | Supplied file: BRD_v2.0.0_revised.md; reviewed as the base document. |
| Pasted historical BRD/template | Supplied Pasted text.txt; reviewed for background and prior requirements, not treated as overriding instructions. |
| LVCC Clinic System Figma | [Design file](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System); current Clinic app · Responsive revision and historical screens are distinguished in Appendix C. |
| October 15 Figma change/QA records | `docs/superpowers/qa/2026-10-15-clinic-responsive-review.md`, `2026-10-15-clinic-blue-polish-review.md`, and `2026-10-15-login-students-nurse-email-review.md`; design evidence, not proof of live services. |
| School Clinic Interview — Compiled Transcript (07/22) | Referenced in supplied BRD as part of APPDEV/ISPM/BPM Project Information; original not independently reviewed here. |
| Clinic Project Proposal (Group 2 Deck) | Referenced in supplied BRD; original not independently reviewed here. |
| Assignment 1 – BPM and Minutes of Meeting (08/27/26) | Historical references retained from the supplied BRD; originals not independently reviewed here. |

---

## Appendix A. Revision Change Mapping

### Historical mapping: v2.0.0 to v2.1.0

This table records the previous revision's changes. Its administrative scope and requirement count are superseded by the v2.2.0 mapping below and the current scope in Section 4.

| Earlier position | Revised position | Affected items |
|---|---|---|
| RFID deferred; manual ID primary | RFID required in R1 with automatic navigation to Log New Visit | FR1, NFR2/NFR4, D5 |
| Faculty/staff coverage pending; visitors excluded | Students and faculty/staff primary; visitors supported | Roles, FR2–FR3, FR11, FR14, D1 |
| Clearance pending | Clearance excluded | Scope, D2, milestones |
| Doctor login undecided | No doctor role or account | Roles, FR10, FR15, D6 |
| Referral form with issued/closed status | Nurse tracks external Messenger contact, waiting, advice received, actions, and resolution | FR10, 7.3 |
| MIS specified as file import; live sync deferred | One-way school identity import/sync is required; transport and frequency await MIS agreement | FR2, D3 |
| Admin manages accounts only | Proposed limited support role covers accounts, alert settings, and recipient directory; owner unconfirmed | FR15, FR17–FR18, D10 |
| Email first; SMS deferred | SMS and email supported in R2 with configurable routing | FR11–FR12, FR17–FR18 |
| School ID treated as universal patient key | Stable local patient ID plus verified school/RFID mappings; visitors need no school ID | FR2–FR3, NFR6 |
| Disposition required for every save | Save an ongoing state; require final disposition on completion | FR5, FR7 |
| Requirements count: 16 FR + 6 NFR | Requirements count: **18 FR + 6 NFR**; FR17 and FR18 added | Section 8–9 |

Earlier v1.4.0 requirement numbers differ from the current numbering. The pasted template's doctor-channel, clearance, visitor-exclusion, and Admin-only-account statements are superseded where they conflict with this revision.

### Change mapping from v2.1.0 to v2.2.0

| Earlier position | Current position | Affected items |
|---|---|---|
| Administrative workspace and configuration/directory editors in scheduled releases | Administration set aside; FR15/FR17/FR18 deferred. Operational support process still required. | Sections 1, 3–4, FR15–FR18, D10, AC11/AC13 |
| Ordinary completion had no automatic message by default, with notification policy open | Every successfully completed visit generates a nurse-summary email. External-recipient routing remains separately proposed. | 7.2/7.4, FR11–FR12, new FR19, D11, AC16–AC19 |
| Patient types supported but Students filter not explicit | All patients, Students, Staff, Visitors are explicit search filters. | 7.1, FR1, AC15 |
| General usability guidance; specific visual direction not baseline | Responsive blue-and-white clinic design, supplied login illustration, plain labels, and readable Messages content required. | 7.5, NFR1/NFR4, AC20 |
| 18 functional requirements in scheduled scope | 19 documented: 16 current and 3 deferred; 6 NFRs retained. Existing IDs remain traceability labels, not interface copy. | Section 8; document basis |

### Change mapping from v2.2.0 to v2.2.1

| Earlier position | Current position | Affected items |
|---|---|---|
| History complaint filtering did not specify the control | A dropdown lists distinct complaints recorded for the selected patient, defaults to All complaints, and combines with date filtering. | 7.2.1, FR4, AC23 |
| Follow-up notes required author/time but editing was unspecified | Authorized clinic users can edit with Save changes/Cancel; original attribution and previous versions remain accessible, and failed/stale saves preserve input. | 7.2.1, FR4, AC24 |

## Appendix B. Team and Milestones

**Team, retained from supplied BRD:** Villar — Business Analyst; Forteza — Project Manager; Broñola and Espeleta — Developers; Buen — QA; Casimiro — UI/UX Designer.

**Milestones, dates to be agreed after baseline:**

- Requirements validation: confirm remaining operational decisions, support owner/procedures, MIS access, RFID equipment, nurse address/template/service, and other notification policies.
- R1: align responsive clinic prototype, validate RFID mapping, implement identity import/sync, patient-category filters and visitor registration, patient records/visit logging, secure clinic access, and clinic pilot. No administration UI.
- R2: implement nurse-managed referral tracking, completion-triggered nurse-summary emails and Messages, other approved SMS/email delivery, and duplicate/failure handling. Configure operational prerequisites through the agreed support process; administration editors remain deferred.
- R3: implement inventory and reports, then validate data accuracy and workflows.
- Go-live: complete acceptance checks, operator handover, backups/restore verification, and downtime arrangements.

No clearance module or doctor-facing application is scheduled. Costs and delivery dates are not supplied; confirm hardware, SMS/email service, hosting, and support costs during planning rather than assuming zero cost.

Reinstating administration requires a separate scope decision; its earlier milestone allocation is superseded.

## Appendix C. Figma Alignment Notes

The October 15 revision is on **Clinic app · Responsive** in the same Figma file. Earlier pages retain historical screens for reference and do not establish delivered scope. The QA records document structural and representative visual checks; no live hardware, MIS exchange, authentication, or actual email delivery was verified. This document update does not edit Figma.

| Current design/reference element | Alignment with this BRD |
|---|---|
| [Today dashboard](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=174-4244) | Preserves scan/manual intake and ongoing work. A unique identity match opens the corresponding visit form; the prototype does not prove real RFID reading or persistence. |
| [Login](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4259) and responsive variants | Supplied school illustration fitted proportionally; readable form and the current blue-and-white theme. No administrator or doctor role picker. |
| [Patients](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4372) | All patients, Students, Staff, Visitors filters; type-appropriate registration and identity display. School IDs remain identification data, while requirement/fixture codes stay out of ordinary UI. |
| [New visit](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9408) and completion | Keep Save visit distinct from Complete visit; require an outcome only for completion. Explain the nurse email before completion; generate from saved data after success. |
| [Completed visit](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10833) | Successful-send design state shows Visit completed · Email sent and View in Messages. Production must show the true state and provide pending/failure/missing-recipient handling. |
| [Messages inbox](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=225-7898) and nurse-email details | Generated subject/body match the linked patient, saved visit, and outcome; show nurse recipient and send status. Other notification failures remain accessible. Figma sends no real emails. |
| Nurse-managed referral states | Nurse records actual external Messenger contact, replies, and actions; preparation is not evidence of contact. No doctor-facing account or automated Messenger inbox. |
| Historical administration/doctor/clearance or complaint-spike concepts | Not current clinic scope. Administration is deferred; doctor access and clearances are excluded; complaint-spike rules remain unapproved. Historical screen preservation does not reinstate those features. |
| School identity data and visitor records | MIS supplies school identity only, with no clinical writeback or automatic operator-account creation. Visitors remain local and do not require school-only fields. |

