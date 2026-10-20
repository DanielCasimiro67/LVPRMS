import React, { useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useClinic } from "../../app/ClinicProvider.jsx";
import {
  Heading,
  Card,
  Button,
  Field,
  Badge,
  ErrorBox,
  ConfirmIdentity,
  Identity,
  useDirtyGuard,
  when,
  Notice,
} from "../../components/ui.jsx";
import { useForm } from "../../components/useForm.js";
import {
  searchPatients,
  patientDescription,
  startOrResumeVisit,
  addPatientNote,
  editPatientNote,
} from "../../../js/clinic.js";
import {
  profileDraft,
  profileCompletion,
  createProfile,
  updateProfile,
  inferProfileType,
  departments,
  grades,
  programs,
  years,
  sections,
  schoolRecords,
} from "../../../js/profiles.js";
export function Patients() {
  const c = useClinic(),
    [params, setParams] = useSearchParams(),
    q = params.get("q") || "",
    type = params.get("type") || "all",
    rows = searchPatients(c.data, { query: q, type });
  return (
    <>
      <Heading sub="Find a student, staff member, or visitor.">
        Patients
      </Heading>
      <Card title="Find a patient" icon="patients">
        <Field
          label="Search"
          name="patient-query"
          value={q}
          placeholder="Search by name or school ID"
          onChange={(v) => setParams({ q: v, type }, { replace: true })}
        />
        <nav className="actions" aria-label="Patient category">
          {[
            ["all", "All patients"],
            ["student", "Students"],
            ["staff", "Staff"],
            ["visitor", "Visitors"],
          ].map(([v, l]) => (
            <Button
              key={v}
              to={"/patients?" + new URLSearchParams({ type: v, q })}
              className={v === type ? "filter-selected" : ""}
            >
              {l}
            </Button>
          ))}
          <Button primary to="/patients/register">
            Register patient
          </Button>
        </nav>
        <div id="patient-results" className="result-list">
          {rows.map((p) => (
            <article className="patient-row" key={p.id}>
              <div className="patient-info">
                <strong>{p.name}</strong>
                <p className="small muted">{patientDescription(p)}</p>
                {c.mode === "demo" && (
                  <span className="small muted">
                    {profileCompletion(c.data, p).complete
                      ? "Record complete"
                      : "Record incomplete"}
                  </span>
                )}
              </div>
              <Badge>
                {c.data.visits.some(
                  (v) => v.patientId === p.id && v.state !== "Completed",
                )
                  ? "In clinic"
                  : "No active visit"}
              </Badge>
              <Button to={"/patients/" + p.id}>Open</Button>
            </article>
          ))}
          {!rows.length && (
            <div className="empty-state">
              <h3>No matching patient</h3>
              <p>Try another name or school ID, or register a new patient.</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
export function Profile() {
  const c = useClinic(),
    { id } = useParams(),
    [params] = useSearchParams(),
    nav = useNavigate(),
    p = c.data.patients.find((p) => p.id === id),
    [confirmed, setConfirmed] = useState(!id),
    f = useForm(
      p
        ? profileDraft(c.data, p)
        : {
            name: "",
            departmentGroup: "",
            schoolId: params.get("schoolId") || "",
            rfid: params.get("rfid") || "",
            grade: "",
            section: "",
            program: "",
            year: "",
            contact: "",
            emergencyName: "",
            emergencyPhone: "",
            emergencyRelationship: "",
          },
      c.data.revision,
    ),
    v = f.values,
    guard = useDirtyGuard(f.dirty),
    [candidates, setCandidates] = useState([]);
  if (id && !p) return <Heading>Patient not found</Heading>;
  if (!confirmed)
    return (
      <>
        <Heading>Confirm patient before editing</Heading>
        <ConfirmIdentity
          state={c.data}
          patient={p}
          onConfirmed={() => setConfirmed(true)}
          onCancel={() => nav("/patients/" + id)}
        />
      </>
    );
  const input = (label, key, props = {}) => (
    <Field
      label={label}
      name={key}
      value={v[key]}
      onChange={(x) => f.change(key, x)}
      {...props}
    />
  );
  const student = inferProfileType(v) === "student";
  return (
    <>
      <Heading
        sub={
          p
            ? p.name
            : "Choose the department. The patient category is filled in automatically."
        }
      >
        {id ? "Edit patient details" : "Register a patient"}
      </Heading>
      {v.managed && (
        <Notice title="School details are managed by the school">
          You can update the personal and emergency contact details here.
        </Notice>
      )}
      <form
        id="profile-form"
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const result = c.mutate((s, a, t) => {
              if (p) return updateProfile(s, p.id, v, a, t).id;
              const next = createProfile(s, v, a, t);
              startOrResumeVisit(s, next.id, a, t);
              return next.id;
            }, f.rev.current);
            f.clean();
            nav(
              p ? "/patients/" + p.id : "/visits/new?patient=" + result.result,
            );
          } catch (e) {
            f.setError(e.message);
            setCandidates(e.details?.candidates || []);
          }
        }}
      >
        <ErrorBox error={f.error} />
        <fieldset disabled={c.mode === "api"} className="form-stack borderless">
          <Card title="Patient details" icon="patients">
            <div className="profile-grid">
              {input("Full name", "name", {
                required: true,
                readOnly: v.managed,
              })}
              {input("Department", "departmentGroup", {
                options: departments,
                disabled: v.managed,
              })}
            </div>
            <p id="profile-category" role="status">
              {inferProfileType(v)
                ? "Patient category: " +
                  { student: "Student", staff: "Staff", visitor: "Visitor" }[
                    inferProfileType(v)
                  ]
                : "Choose a department to identify the patient category."}
            </p>
            {v.departmentGroup !== "none" && (
              <>
                <div className="profile-grid">
                  {input("School ID", "schoolId", {
                    required: student,
                    readOnly: v.managed,
                  })}
                  {input("RFID", "rfid", {
                    required: student,
                    readOnly: v.managed,
                  })}
                </div>
                {!p && (
                  <>
                    <Button
                      onClick={() => {
                        const r = schoolRecords(c.data).find(
                          (r) => r.schoolId === v.schoolId || r.rfid === v.rfid,
                        );
                        if (r) {
                          f.setValues((old) => ({
                            ...old,
                            ...r,
                            managed: true,
                          }));
                          f.dirty.current = true;
                        } else
                          f.setError(
                            "No matching school record. Check the ID or enter the details manually.",
                          );
                      }}
                    >
                      Find school record
                    </Button>
                    <p className="small muted">
                      Suggestions use fictional saved school records in this
                      preview.
                    </p>
                  </>
                )}
                {v.departmentGroup === "higher-ed" && (
                  <div className="profile-grid">
                    {input("Program", "program", {
                      choices: programs,
                      required: true,
                      readOnly: v.managed,
                    })}
                    {input("Year level", "year", {
                      choices: years,
                      required: true,
                      readOnly: v.managed,
                    })}
                  </div>
                )}
                {v.departmentGroup === "basic-ed" && (
                  <div className="profile-grid">
                    {input("Grade level", "grade", {
                      choices: grades,
                      required: true,
                      readOnly: v.managed,
                    })}
                    {input("Section", "section", {
                      list: "sections",
                      required: true,
                      readOnly: v.managed,
                    })}
                    <datalist id="sections">
                      {sections(c.data, v.grade).map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>
                )}
              </>
            )}
            {input("Personal contact number (optional)", "contact", {
              type: "tel",
            })}
          </Card>
          <Card title="Emergency contact">
            <p className="small muted">
              Emergency details are needed to complete the record, but you can
              save and finish them later.
            </p>
            <div className="profile-grid">
              {input("Emergency contact name", "emergencyName")}
              {input("Emergency contact number", "emergencyPhone", {
                type: "tel",
              })}
            </div>
            {input("Relationship (optional)", "emergencyRelationship")}
          </Card>
          {candidates.map((p) => (
            <Button key={p.id} to={"/patients/" + p.id}>
              Open {p.name}
            </Button>
          ))}
          {candidates.length > 0 &&
            input("Reason for registering separately", "duplicateReason")}
          <div className="actions">
            <Button primary type="submit">
              {p ? "Save changes" : "Save and start visit"}
            </Button>
            <Button to={p ? "/patients/" + p.id : "/patients"}>Cancel</Button>
          </div>
        </fieldset>
      </form>
      {guard}
    </>
  );
}
function NoteEditor({ patient, note, onClose, onDirtyChange }) {
  const c = useClinic(),
    [confirmed, setConfirmed] = useState(!note),
    f = useForm({ text: note?.text || "" }, c.data.revision),
    guard = useDirtyGuard(f.dirty);
  if (!confirmed)
    return (
      <ConfirmIdentity
        patient={patient}
        state={c.data}
        onConfirmed={() => setConfirmed(true)}
        onCancel={onClose}
      />
    );
  return (
    <form
      data-note-editor={note ? true : undefined}
      className="form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          c.mutate(
            (s, a, t) =>
              note
                ? editPatientNote(s, patient.id, note.id, f.values.text, a, t)
                : addPatientNote(s, patient.id, f.values.text, a, t),
            f.rev.current,
          );
          f.clean();
          onDirtyChange?.(false);
          onClose();
        } catch (e) {
          f.setError(e.message);
        }
      }}
    >
      <ErrorBox error={f.error} />
      <Field
        label={note ? "Edit follow-up note" : "Add a note"}
        name={note ? "edit-note" : "patient-note"}
        note
        value={f.values.text}
        onChange={(v) => {
          f.change("text", v);
          if (!note) f.dirty.current = Boolean(v);
          onDirtyChange?.(Boolean(v));
        }}
        required
      />
      <div className="actions">
        <Button primary type="submit">
          {note ? "Save changes" : "Save note"}
        </Button>
        {note && (
          <Button
            onClick={() => {
              f.clean();
              onDirtyChange?.(false);
              onClose();
            }}
          >
            Cancel
          </Button>
        )}
      </div>
      {guard}
    </form>
  );
}
export function Record() {
  const c = useClinic(),
    { id } = useParams(),
    nav = useNavigate(),
    p = c.data.patients.find((p) => p.id === id),
    [date, setDate] = useState(""),
    [complaint, setComplaint] = useState(""),
    [edit, setEdit] = useState(null),
    [composeDirty, setComposeDirty] = useState(false),
    [error, setError] = useState("");
  if (!p) return <Heading>Patient not found</Heading>;
  const visits = c.data.visits.filter((v) => v.patientId === id),
    options = [...new Set(visits.map((v) => v.complaint).filter(Boolean))],
    missing = c.mode === "demo" ? profileCompletion(c.data, p) : null;
  return (
    <>
      <Heading sub="Visit history and follow-up notes.">Patient record</Heading>
      <section className="identity-panel">
        <strong>{p.name}</strong>
        <p>{patientDescription(p)}</p>
      </section>
      <Card title="Patient details" icon="patients">
        <p>{patientDescription(p)}</p>
        {missing && (
          <>
            <Badge>
              {missing.complete ? "Record complete" : "Record incomplete"}
            </Badge>
            {!missing.complete && (
              <p>To finish: {missing.missing.join(", ")}</p>
            )}
          </>
        )}
        <p>School ID: {p.schoolId || "Not recorded"}</p>
        <p>Personal contact: {p.contact || "Not recorded"}</p>
        <p>
          Emergency contact: {p.emergencyName || "Not recorded"} ·{" "}
          {p.emergencyPhone || "Not recorded"}
        </p>
        <p className="muted">
          Allergy: {p.allergy || "Not recorded"} · Blood type:{" "}
          {p.bloodType || "Not recorded"}
        </p>
        <div className="actions">
          <Button
            primary
            disabled={c.mode === "api"}
            onClick={() => {
              try {
                const r = c.mutate((s, a, t) =>
                  startOrResumeVisit(s, id, a, t),
                );
                nav(
                  r.result.kind === "visit"
                    ? "/visits/" + r.result.visit.id
                    : "/visits/new?patient=" + id,
                );
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            {visits.some((v) => v.state !== "Completed")
              ? "Resume visit"
              : "Start visit"}
          </Button>
          <Button to={"/patients/" + id + "/edit"}>Edit details</Button>
        </div>
        <ErrorBox error={error} />
      </Card>
      <Card title="Visit history" icon="history">
        <div className="filter-grid">
          <Field
            label="Visit date"
            name="history-date"
            type="date"
            value={date}
            onChange={setDate}
          />
          <Field
            label="Complaint"
            name="history-complaint"
            options={[["", "All complaints"], ...options]}
            value={complaint}
            onChange={setComplaint}
          />
        </div>
        <div id="history-results" className="result-list">
          {visits
            .filter(
              (v) =>
                (!date ||
                  new Intl.DateTimeFormat("en-CA", {
                    timeZone: "Asia/Manila",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(new Date(v.startedAt)) === date) &&
                (!complaint || v.complaint === complaint),
            )
            .map((v) => (
              <article className="patient-row" key={v.id}>
                <div>
                  <strong>
                    {when(v.startedAt)} · {v.complaint}
                  </strong>
                  <p className="small muted">{v.loggedBy || "Not recorded"}</p>
                </div>
                <Badge>{v.state}</Badge>
                <Button to={"/visits/" + v.id}>Open</Button>
              </article>
            ))}
          {!visits.some(
            (v) =>
              (!date ||
                new Intl.DateTimeFormat("en-CA", {
                  timeZone: "Asia/Manila",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(new Date(v.startedAt)) === date) &&
              (!complaint || v.complaint === complaint),
          ) && <p>No visits match these filters.</p>}
        </div>
      </Card>
      <Card title="Follow-up notes" icon="history">
        {(p.notes || []).map((n) =>
          edit === n.id ? (
            <NoteEditor
              key={n.id}
              patient={p}
              note={n}
              onClose={() => setEdit(null)}
            />
          ) : (
            <article className="note" data-note-id={n.id} key={n.id}>
              <p className="note-text">{n.text}</p>
              <p className="small muted">
                {n.author} · {when(n.at)}
              </p>
              {n.updatedAt && (
                <p className="small muted">
                  Edited by {n.updatedBy} · {when(n.updatedAt)}
                </p>
              )}
              <Button
                data-edit-note={n.id}
                disabled={edit !== null || composeDirty || c.mode === "api"}
                onClick={() => setEdit(n.id)}
              >
                Edit note
              </Button>
              {n.revisions?.length > 0 && (
                <details>
                  <summary>Edit history</summary>
                  {n.revisions.map((r, i) => (
                    <p className="note-text" key={i}>
                      {r.text} · {r.author} · {when(r.at)}
                    </p>
                  ))}
                </details>
              )}
            </article>
          ),
        )}
        {!p.notes?.length && <p>No additional notes.</p>}
        {edit === null && c.mode === "demo" && (
          <NoteEditor
            key={p.notes?.length || 0}
            patient={p}
            onDirtyChange={setComposeDirty}
            onClose={() => setEdit(null)}
          />
        )}
      </Card>
      {p.profileHistory?.length > 0 && (
        <Card title="Patient detail history">
          {p.profileHistory.map((h, i) => (
            <details key={i}>
              <summary>
                {h.author} · {when(h.at)}
              </summary>
              {Object.entries({
                name: "Full name",
                departmentGroup: "Department",
                schoolId: "School ID",
                rfid: "RFID",
                grade: "Grade level",
                section: "Section",
                program: "Program",
                year: "Year level",
                contact: "Personal contact",
                emergencyName: "Emergency contact name",
                emergencyPhone: "Emergency contact number",
                emergencyRelationship: "Relationship",
              })
                .filter(([key]) => h.before[key] !== h.after[key])
                .map(([key, label]) => (
                  <p className="note-text" key={key}>
                    <strong>{label}:</strong> {h.before[key] || "Not recorded"}{" "}
                    → {h.after[key] || "Not recorded"}
                  </p>
                ))}
            </details>
          ))}
        </Card>
      )}
      <Button to="/patients">Back to patients</Button>
    </>
  );
}
