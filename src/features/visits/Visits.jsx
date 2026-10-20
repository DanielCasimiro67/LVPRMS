import React, { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useClinic } from "../../app/ClinicProvider.jsx";
import {
  Heading,
  Card,
  Field,
  Button,
  Identity,
  Badge,
  ErrorBox,
  Notice,
  ConfirmIdentity,
  useDirtyGuard,
  when,
} from "../../components/ui.jsx";
import { useForm } from "../../components/useForm.js";
import {
  complaints,
  encounterStates,
  outcomes,
  saveVisit,
  completeVisit,
  correctVisit,
  careValues,
} from "../../../js/visits.js";
import { startOrResumeVisit } from "../../../js/clinic.js";
const EmailExplanation = () => (
  <p className="small muted">
    Completing this visit generates a summary email for the school nurse. You
    can review its status in Messages.
  </p>
);
function Summary({ visit: v }) {
  return (
    <>
      <h3>{v.complaint}</h3>
      {[
        ["Assessment", v.assessment],
        ["Temperature (°C)", v.temperature],
        ["Pulse (bpm)", v.pulse],
        ["Blood pressure (mmHg)", v.bp],
        ["Treatment", v.treatment],
        ["Final notes", v.finalNotes],
        ["Transfer destination", v.transferDestination],
      ]
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([l, x]) => (
          <p className="note-text" key={l}>
            <strong>{l}:</strong> {x}
          </p>
        ))}
      {v.supplies?.map((i, k) => (
        <p key={k}>
          {i.name} · {i.quantity} {i.unit}
        </p>
      ))}
      <p>
        <strong>Outcome:</strong> {v.outcome || "Not recorded"}
      </p>
    </>
  );
}
export function VisitPage() {
  const c = useClinic(),
    { id } = useParams(),
    [params] = useSearchParams(),
    location = useLocation(),
    saved =
      c.data.visits.find((v) => v.id === id) ||
      (id === "new"
        ? c.data.visits.find(
            (v) =>
              v.patientId === params.get("patient") && v.state !== "Completed",
          )
        : null),
    patientId = saved?.patientId || params.get("patient"),
    p = c.data.patients.find((p) => p.id === patientId);
  if (!p)
    return (
      <>
        <Heading>Visit not found</Heading>
        <Button to="/patients">Back to patients</Button>
      </>
    );
  if (c.mode === "api" && saved) return <ApiVisit patient={p} visit={saved} />;
  if (saved?.state === "Completed" && !location.pathname.endsWith("/correct"))
    return <Completed patient={p} visit={saved} />;
  return (
    <CareForm
      key={location.pathname + patientId}
      patient={p}
      saved={saved}
      correcting={location.pathname.endsWith("/correct")}
      completing={location.pathname.endsWith("/complete")}
    />
  );
}
function CareForm({ patient: p, saved, correcting, completing }) {
  const c = useClinic(),
    nav = useNavigate(),
    draft = correcting
      ? c.data.correctionDrafts?.[saved.id]
      : c.data.drafts[p.id],
    initial = { ...saved, ...draft },
    f = useForm(
      {
        patientId: p.id,
        visitId: saved?.id || "",
        complaintChoice:
          initial.complaintChoice ||
          (complaints.includes(initial.complaint)
            ? initial.complaint
            : initial.complaint
              ? "Other"
              : ""),
        otherComplaint:
          initial.otherComplaint ||
          (initial.complaint && !complaints.includes(initial.complaint)
            ? initial.complaint
            : ""),
        state: initial.state || "In progress",
        assessment: initial.assessment || "",
        temperature: initial.temperature ?? "",
        pulse: initial.pulse ?? "",
        bp: initial.bp || "",
        treatment: initial.treatment || "",
        supplies: initial.supplies?.length
          ? initial.supplies
          : [{ itemId: "", quantity: "" }],
        outcome: initial.outcome || "",
        finalNotes: initial.finalNotes || "",
        reason: "",
      },
      c.data.revision,
    ),
    v = f.values,
    [confirmed, setConfirmed] = useState(!correcting),
    [savedNotice, setSavedNotice] = useState(false),
    guard = useDirtyGuard(f.dirty, {
      beforeUnload: false,
      onDiscard: () => {
        const r = c.mutate((s) => {
          if (correcting) delete s.correctionDrafts?.[saved.id];
          else delete s.drafts[p.id];
        }, f.rev.current);
        f.rev.current = r.state.revision;
      },
      onSave: () => {
        const r = c.mutate(
          (s, a, t) =>
            correcting
              ? correctVisit(s, saved.id, v, v.reason, a, t)
              : saveVisit(s, v, a, t),
          f.rev.current,
        );
        f.rev.current = r.state.revision;
      },
    });
  useEffect(() => {
    if (c.mode !== "demo" || saved || correcting) return;
    try {
      const current = c.runtime.adapter.read();
      if (!current.drafts[p.id]) {
        const r = c.mutate(
          (s, a, t) => startOrResumeVisit(s, p.id, a, t),
          f.rev.current,
        );
        f.rev.current = r.state.revision;
      }
    } catch (e) {
      f.setError(e.message);
    }
  }, []);
  const change = (key, value) => {
    f.change(key, value);
    if (c.mode === "demo") {
      try {
        const values = { ...v, [key]: value };
        const r = c.mutate((s, a, t) => {
          if (correcting)
            (s.correctionDrafts ??= {})[saved.id] = { ...values, dirty: true };
          else
            s.drafts[p.id] = {
              ...s.drafts[p.id],
              ...values,
              patientId: p.id,
              dirty: true,
              createdAt: s.drafts[p.id]?.createdAt || saved?.startedAt || t,
              id: s.drafts[p.id]?.id || saved?.id || crypto.randomUUID(),
            };
        }, f.rev.current);
        f.rev.current = r.state.revision;
      } catch (e) {
        f.setError(e.message);
      }
    }
  };
  const input = (label, key, props = {}) => (
    <Field
      label={label}
      name={key}
      value={v[key]}
      onChange={(x) => change(key, x)}
      {...props}
    />
  );
  if (!confirmed)
    return (
      <>
        <Heading>Confirm patient before editing</Heading>
        <ConfirmIdentity
          patient={p}
          state={c.data}
          onConfirmed={() => setConfirmed(true)}
          onCancel={() => nav("/visits/" + saved.id)}
        />
      </>
    );
  const save = (e) => {
    e.preventDefault();
    try {
      if (
        !completing &&
        e.nativeEvent.submitter?.dataset.intent === "complete"
      ) {
        careValues(c.data, v, { completing: true });
        f.clean();
        nav("/visits/" + (saved?.id || "new") + "/complete?patient=" + p.id);
        return;
      }
      const r = c.mutate(
        (s, a, t) =>
          correcting
            ? correctVisit(s, saved.id, v, v.reason, a, t)
            : completing
              ? completeVisit(s, v, a, t)
              : saveVisit(s, v, a, t),
        f.rev.current,
      );
      f.clean();
      f.rev.current = r.state.revision;
      setSavedNotice(true);
      nav("/visits/" + r.result.id);
    } catch (e) {
      f.setError(e.message);
    }
  };
  const usedSupplies = () => (
    <>
      <h3>
        Medicine or supplies given{" "}
        <span className="small muted">(optional)</span>
      </h3>
      <div className="form-stack">
        {v.supplies.map((row, i) => {
          const item = c.data.inventory.find((x) => x.id === row.itemId);
          const update = (key, value) =>
            change(
              "supplies",
              v.supplies.map((r, j) => (i === j ? { ...r, [key]: value } : r)),
            );
          return (
            <div className="supply-row" data-supply-row key={i}>
              <Field
                label="Medicine or supply"
                name={"supply-" + i}
                options={[
                  ["", "Choose an item"],
                  ...c.data.inventory.map((x) => [
                    x.id,
                    `${x.name} (${x.unit})`,
                  ]),
                ]}
                value={row.itemId}
                onChange={(x) => update("itemId", x)}
              />
              <Field
                label="Quantity"
                name={"quantity-" + i}
                type="number"
                min={item?.step || 1}
                step={item?.step || 1}
                value={row.quantity}
                onChange={(x) => update("quantity", x)}
              />
              <Button
                onClick={() =>
                  change(
                    "supplies",
                    v.supplies.filter((_, j) => j !== i),
                  )
                }
              >
                Remove
              </Button>
            </div>
          );
        })}
      </div>
      <div className="actions">
        <Button
          onClick={() =>
            change("supplies", [...v.supplies, { itemId: "", quantity: "" }])
          }
        >
          Add another supply
        </Button>
      </div>
    </>
  );
  return (
    <>
      <Identity patient={p} />
      <Heading
        sub={
          completing
            ? "Record what happened when the patient left."
            : "Record the complaint and care. Time and clinic staff are recorded automatically."
        }
      >
        {correcting
          ? "Correct visit"
          : completing
            ? "Complete visit"
            : saved
              ? "Ongoing visit"
              : "New visit"}
      </Heading>
      <form
        id={completing ? "complete-form" : "intake-form"}
        className="form-stack visit-form"
        onSubmit={save}
      >
        <ErrorBox error={f.error} />
        {savedNotice && (
          <Notice title="Visit saved" kind="success">
            Your changes are saved.
          </Notice>
        )}
        <fieldset disabled={c.mode === "api"} className="borderless form-stack">
          {completing ? (
            <Card title="Visit outcome" icon="visit">
              {input("Outcome", "outcome", {
                options: [["", "Choose an outcome"], ...outcomes],
                required: true,
              })}
              {input("Final notes", "finalNotes", { note: true })}
              <EmailExplanation />
              <div className="actions">
                <Button primary type="submit">
                  Complete visit
                </Button>
                <Button
                  to={"/visits/" + (saved?.id || "new") + "?patient=" + p.id}
                >
                  Continue care
                </Button>
              </div>
            </Card>
          ) : (
            <Card
              title={correcting ? "Complaint and assessment" : "Quick visit"}
              icon="visit"
            >
              <div className="quick-fields">
                {input("Complaint", "complaintChoice", {
                  options: [["", "Choose a complaint"], ...complaints],
                  required: true,
                })}
                {input("Encounter state", "state", {
                  options: encounterStates,
                  required: true,
                  disabled: correcting,
                })}
              </div>
              {v.complaintChoice === "Other" &&
                input("Other complaint", "otherComplaint", { required: true })}
              <details
                className="optional-care"
                open={
                  correcting ||
                  !!(
                    initial.assessment ||
                    initial.temperature ||
                    initial.pulse ||
                    initial.bp
                  ) ||
                  undefined
                }
              >
                <summary>Vitals and assessment (optional)</summary>
                <div className="form-stack">
                  {input("Assessment notes", "assessment", { note: true })}
                  <div className="vitals-grid">
                    {input("Temperature (°C)", "temperature", {
                      type: "number",
                      step: ".1",
                    })}
                    {input("Pulse (bpm)", "pulse", {
                      type: "number",
                      step: "1",
                    })}
                    {input("Blood pressure (mmHg)", "bp", {
                      placeholder: "For example, 118/76",
                    })}
                  </div>
                </div>
              </details>
              {usedSupplies()}
              <details
                className="optional-care"
                open={correcting || !!initial.treatment || undefined}
              >
                <summary>Treatment notes (optional)</summary>
                {input("Treatment notes", "treatment", { note: true })}
              </details>
              {correcting && (
                <>
                  {input("Reason for correction", "reason", {
                    note: true,
                    required: true,
                  })}
                  {saved.state === "Completed" && (
                    <>
                      {input("Outcome", "outcome", {
                        options: outcomes,
                        required: true,
                      })}
                      {input("Final notes", "finalNotes", { note: true })}
                    </>
                  )}
                </>
              )}
              <p className="small muted" id="draft-status">
                {saved
                  ? "Visit saved. Changes remain a draft until you save."
                  : "This visit has not been saved."}
              </p>
              <EmailExplanation />
              <div className="actions">
                <Button primary type="submit">
                  {correcting ? "Save correction" : "Save visit"}
                </Button>
                {!correcting && (
                  <Button type="submit" data-intent="complete" formNoValidate>
                    Complete visit
                  </Button>
                )}
                {saved && !correcting && <ReferralLink visit={saved} />}
              </div>
            </Card>
          )}
        </fieldset>
      </form>
      <div className="actions">
        <Button to="/today">Back to Today</Button>
        <Button to={"/patients/" + p.id}>View patient history</Button>
      </div>
      {guard}
    </>
  );
}
export function ReferralLink({ visit: v }) {
  const c = useClinic(),
    r = c.data.referrals.find(
      (r) => r.visitId === v.id && r.state !== "Resolved",
    );
  return (
    <Button to={r ? "/referrals/" + r.id : "/referrals/new?visit=" + v.id}>
      {r ? "View referral" : "Prepare referral"}
    </Button>
  );
}
function Completed({ patient, visit: v }) {
  const c = useClinic(),
    m = c.data.messages.find(
      (m) => m.visitId === v.id && m.kind === "nurse-summary",
    );
  return (
    <>
      <Identity patient={patient} />
      <Heading>Visit completed</Heading>
      <Notice
        title={
          "Visit completed · " +
          ({
            pending: "Email pending",
            sent: "Email sent",
            failed: "Email failed",
            "missing-recipient": "Missing recipient",
          }[m?.status] || "Email status unavailable")
        }
        kind="success"
      >
        {c.mode === "demo"
          ? "Email results are simulated. No real email is delivered."
          : "No nurse-summary delivery contract is available."}
      </Notice>
      {m && (
        <Button primary to={"/messages/" + m.id}>
          View in Messages
        </Button>
      )}
      <Card title="Visit summary" icon="visit">
        <Summary visit={v} />
        <p className="small muted">
          Recorded by {v.loggedBy || "Not recorded"} · Completed{" "}
          {when(v.completedAt)}
        </p>
        <div className="actions">
          <Button to={"/patients/" + patient.id}>View patient record</Button>
          <Button to="/today">Back to Today</Button>
          <Button to={"/visits/" + v.id + "/correct"}>Correct visit</Button>
          <ReferralLink visit={v} />
        </div>
      </Card>
      {v.revisions?.length > 0 && (
        <Card title="Correction history">
          {v.revisions.map((r, i) => (
            <details key={i}>
              <summary>
                {r.reason} · {r.author} · {when(r.at)}
              </summary>
              <Summary visit={r.before} />
            </details>
          ))}
        </Card>
      )}
    </>
  );
}

function ApiVisit({ patient, visit }) {
  const c = useClinic(),
    [details, setDetails] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    c.runtime.api
      .visitDetails(visit.id)
      .then((v) => {
        if (active) setDetails(v);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [visit.id]);
  return (
    <>
      <Identity patient={patient} />
      <Heading>Saved visit</Heading>
      <Notice title="API record">
        Backend status: {visit.backendStatus}. Clinical narratives, corrections
        and completion outcomes are not available in this API. Referral status
        alone does not confirm checkout.
      </Notice>
      <Card title="Visit details" icon="visit">
        <p>{visit.complaint}</p>
        <Badge>{visit.state}</Badge>
        <p>Arrived: {when(visit.startedAt)}</p>
        <p>
          Temperature: {visit.temperature ?? "Not recorded"} · Pulse:{" "}
          {visit.pulse ?? "Not recorded"} · Blood pressure:{" "}
          {visit.bp || "Not recorded"}
        </p>
        <h3>Issued medicine and supplies</h3>
        <ErrorBox error={error} />
        {!details && !error && <p>Loading saved supply use…</p>}
        {error && (
          <p>
            Supply history is unavailable. This does not mean no supplies were
            issued.
          </p>
        )}
        {details?.supplies.map((row, i) => (
          <p key={i}>
            {row.name} · {row.quantity} {row.unit}
          </p>
        ))}
        {details && !details.supplies.length && (
          <p>No issued supplies were returned for this visit.</p>
        )}
      </Card>
      <Button to={"/patients/" + patient.id}>View patient history</Button>
      <Button to="/today">Back to Today</Button>
    </>
  );
}
