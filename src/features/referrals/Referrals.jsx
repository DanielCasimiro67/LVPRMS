import React, { useState } from "react";
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
  Button,
  Field,
  Identity,
  Badge,
  Notice,
  ErrorBox,
  useDirtyGuard,
  when,
} from "../../components/ui.jsx";
import { useForm } from "../../components/useForm.js";
import {
  prepareReferral,
  appendReferralActivity,
  transferReferral,
  referralStates,
} from "../../../js/referrals.js";
function Activities({ referral: r }) {
  return (
    <div className="result-list">
      {r.activities?.map((a, i) => (
        <article className="note" key={a.id || i}>
          <strong>
            {
              {
                contact:
                  a.result === "sent" ? "Contact recorded" : "Contact attempt",
                reply: "Reply recorded",
                action: "Action recorded",
                resolve: "Follow-up resolved",
                transfer: "Transfer recorded",
              }[a.kind]
            }
          </strong>
          <p>
            {when(a.occurredAt)} · {a.doctor} {a.source}
          </p>
          {[
            ["Notes", a.notes],
            ["Advice received", a.advice],
            ["Planned next action", a.nextAction],
            ["Actions taken", a.actions],
            ["Destination", a.destination],
            ["Outcome", a.outcome],
          ]
            .filter(([, v]) => v)
            .map(([l, v]) => (
              <p className="note-text" key={l}>
                <strong>{l}:</strong> {v}
              </p>
            ))}
          <p className="small muted">
            Recorded by {a.author} · {when(a.recordedAt)}
          </p>
        </article>
      ))}
      {!r.activities?.length && (
        <p>No contact or follow-up activity has been recorded.</p>
      )}
    </div>
  );
}
export function Referrals() {
  const c = useClinic(),
    { id } = useParams(),
    [params] = useSearchParams(),
    location = useLocation(),
    action = location.pathname.split("/")[3],
    r = c.data.referrals.find((r) => r.id === id),
    visit = c.data.visits.find(
      (v) => v.id === (id === "new" ? params.get("visit") : r?.visitId),
    ),
    p = c.data.patients.find(
      (p) => p.id === (visit?.patientId || r?.patientId),
    );
  if (c.mode === "api")
    return (
      <>
        <Heading>Referrals</Heading>
        <Notice title="Not available yet">
          The current API cannot persist referral follow-up without changing
          encounter status. Existing backend referrals are not loaded here. Use
          demo mode to review the approved workflow.
        </Notice>
        <Button to="/today">Back to Today</Button>
      </>
    );
  if (id === "new")
    return visit && p ? (
      <ReferralForm
        key={location.pathname}
        visit={visit}
        patient={p}
        action="new"
      />
    ) : (
      <Heading>Save a visit before preparing a referral</Heading>
    );
  if (id && !r)
    return (
      <>
        <Heading>Referral not found</Heading>
        <Button to="/referrals">Back to referrals</Button>
      </>
    );
  if (r && !visit)
    return (
      <>
        <Heading>Referral needs a saved visit</Heading>
        <Notice title="Visit not linked">
          Open the patient and prepare a referral against a saved visit.
        </Notice>
        <Button to="/referrals">Back to referrals</Button>
      </>
    );
  if (r && action && action !== "print")
    return (
      <ReferralForm
        key={location.pathname}
        referral={r}
        visit={visit}
        patient={p}
        action={action}
      />
    );
  if (r)
    return (
      <>
        <Identity patient={p} />
        <Heading sub="Track contact, replies, and actions.">
          {action === "print" ? "Referral summary" : "Referral"}
        </Heading>
        <Notice
          title={
            visit.state !== "Completed"
              ? "Patient is still in the clinic"
              : visit.outcome === "Referred to an external facility"
                ? "Transferred to " +
                  (visit.transferDestination || "an external facility")
                : "Visit completed"
          }
          kind={visit.state === "Completed" ? "success" : "info"}
        >
          Contacting the doctor does not check the patient out. Pending
          follow-up remains available after checkout.
        </Notice>
        <Card title="Referral details" icon="referrals">
          <strong>{r.reason}</strong>
          <Badge>{r.state}</Badge>
          <p>{r.destination || "Doctor or destination not recorded"}</p>
          <p className="note-text">{r.notes}</p>
          <p className="small muted">
            Prepared by {r.preparedBy} · {when(r.preparedAt)}
          </p>
          {r.state !== "Resolved" && (
            <>
              <div className="actions">
                <Button
                  primary
                  to={
                    "/referrals/" +
                    id +
                    (r.state === "Prepared"
                      ? "/contact"
                      : r.state === "Awaiting doctor reply"
                        ? "/reply"
                        : "/actions")
                  }
                >
                  {r.state === "Prepared"
                    ? "Record contact"
                    : r.state === "Awaiting doctor reply"
                      ? "Record reply"
                      : "Record action"}
                </Button>
                {visit.state !== "Completed" && (
                  <Button to={"/referrals/" + id + "/transfer"}>
                    Record actual transfer
                  </Button>
                )}
              </div>
              <details className="optional-care">
                <summary>Other follow-up actions</summary>
                <div className="actions">
                  {r.state === "Awaiting doctor reply" && (
                    <Button to={"/referrals/" + id + "/contact"}>
                      Add contact attempt
                    </Button>
                  )}
                  <Button to={"/referrals/" + id + "/actions"}>
                    Record action
                  </Button>
                  <Button to={"/referrals/" + id + "/resolve"}>
                    Resolve follow-up
                  </Button>
                </div>
              </details>
            </>
          )}
        </Card>
        <Card title="Activity history" icon="history">
          <Activities referral={r} />
        </Card>
        <div className="actions">
          <Button to="/referrals">Back to referrals</Button>
          <Button to={"/visits/" + visit.id}>View visit</Button>
          <Button to={"/referrals/" + id + "/print"}>Print summary</Button>
          {action === "print" && (
            <Button onClick={() => window.print()}>Print / Save PDF</Button>
          )}
        </div>
        {c.data.messages
          .filter((m) => m.visitId === visit.id && m.kind === "nurse-summary")
          .map((m) => (
            <Button key={m.id} to={"/messages/" + m.id}>
              View in Messages
            </Button>
          ))}
      </>
    );
  const filter = params.get("status") || "";
  return (
    <>
      <Heading sub="Track contact, replies, and actions.">Referrals</Heading>
      <Card title="Follow-ups" icon="patients">
        <nav className="actions" aria-label="Referral status filters">
          {[["", "All follow-ups"], ...referralStates.map((x) => [x, x])].map(
            ([v, l]) => (
              <Button
                key={v}
                to={"/referrals?" + new URLSearchParams({ status: v })}
                className={filter === v ? "filter-selected" : ""}
              >
                {l}
              </Button>
            ),
          )}
        </nav>
        {c.data.referrals
          .filter((r) => !filter || filter === r.state)
          .map((r) => (
            <ReferralRow key={r.id} state={c.data} referral={r} />
          ))}
        {!c.data.referrals.some((r) => !filter || filter === r.state) && (
          <p>
            No follow-ups match this filter. To prepare a referral, open a saved
            visit.
          </p>
        )}
      </Card>
    </>
  );
}
export function ReferralRow({ state, referral: r }) {
  const visit = state.visits.find((v) => v.id === r.visitId);
  const patient = state.patients.find(
    (p) => p.id === (visit?.patientId || r.patientId),
  );
  return (
    <article className="patient-row">
      <div className="patient-info">
        <strong>{patient?.name || "Patient unavailable"}</strong>
        <p className="small muted">
          {r.reason || visit?.complaint || "Reason not recorded"} ·{" "}
          {when(r.updatedAt || r.preparedAt)}
        </p>
        <p className="small muted">
          {!visit
            ? "Visit not linked"
            : visit.state === "Completed"
              ? "Checked out · " + (visit.outcome || "Visit completed")
              : "In clinic"}
        </p>
      </div>
      <Badge>{r.state}</Badge>
      <Button to={"/referrals/" + r.id}>Open</Button>
    </article>
  );
}
function ReferralForm({ referral: r, visit, patient, action }) {
  const c = useClinic(),
    nav = useNavigate(),
    f = useForm(
      {
        id: crypto.randomUUID(),
        reason: "",
        notes: "",
        destination: "",
        doctor:
          r?.activities?.filter((a) => a.doctor).at(-1)?.doctor ||
          r?.destination ||
          "",
        occurredAt: new Date(Date.now() + 8 * 3600000)
          .toISOString()
          .slice(0, 16),
        result: "",
        advice: "",
        nextAction: "",
        actions: "",
        outcome: "",
        confirmed: false,
      },
      c.data.revision,
    ),
    v = f.values,
    guard = useDirtyGuard(f.dirty),
    titles = {
      new: "Prepare referral",
      contact: "Record contact",
      reply: "Record doctor’s reply",
      actions: "Record action",
      resolve: "Resolve follow-up",
      transfer: "Record actual transfer",
    },
    labels = {
      new: "Save referral",
      contact: "Save contact",
      reply: "Save reply",
      actions: "Save action",
      resolve: "Resolve follow-up",
      transfer: "Confirm transfer and checkout",
    },
    input = (label, key, props = {}) => (
      <Field
        label={label}
        name={key}
        value={v[key]}
        onChange={(x) => f.change(key, x)}
        {...props}
      />
    );
  if (!titles[action]) return <Heading>Action unavailable</Heading>;
  if (
    r?.state === "Resolved" ||
    (action === "transfer" && visit.state === "Completed")
  )
    return (
      <>
        <Heading>Action unavailable</Heading>
        <Button to={"/referrals/" + r.id}>Back to referral</Button>
      </>
    );
  return (
    <>
      <Identity patient={patient} />
      <Heading>{titles[action]}</Heading>
      <Card
        title={
          action === "new"
            ? "Referral details"
            : action === "transfer"
              ? "Transfer and checkout"
              : action === "reply"
                ? "Reply details"
                : action === "contact"
                  ? "Messenger contact"
                  : "Actions and outcome"
        }
        icon="referrals"
      >
        <form
          id="referral-form"
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            try {
              const input = {
                ...v,
                occurredAt: v.occurredAt + "+08:00",
                kind:
                  { actions: "action", resolve: "resolve" }[action] || action,
              };
              const result = c.mutate(
                (s, a, t) =>
                  action === "new"
                    ? prepareReferral(s, visit.id, input, a, t)
                    : action === "transfer"
                      ? transferReferral(s, r.id, input, a, t)
                      : appendReferralActivity(s, r.id, input, a, t),
                f.rev.current,
              );
              f.clean();
              nav("/referrals/" + result.result.id);
            } catch (e) {
              f.setError(e.message);
            }
          }}
        >
          <ErrorBox error={f.error} />
          <fieldset
            disabled={c.mode === "api"}
            className="borderless form-stack"
          >
            {action === "new" && (
              <>
                {input("Reason for referral", "reason", {
                  note: true,
                  required: true,
                })}
                {input("Doctor or destination", "destination")}
                {input("Notes", "notes", { note: true })}
                <p>
                  Preparing a referral does not contact the doctor. After
                  sending your message through Messenger, record the contact
                  here.
                </p>
              </>
            )}
            {["contact", "reply"].includes(action) && (
              <>
                {input("Doctor’s name", "doctor", { required: true })}
                {action === "contact" && (
                  <Field
                    label="Contact method"
                    name="source"
                    value="Messenger"
                    readOnly
                  />
                )}
                {input(
                  action === "reply"
                    ? "Reply date and time"
                    : "Contact date and time",
                  "occurredAt",
                  {
                    type: "datetime-local",
                    required: true,
                    hint: "Philippine time",
                  },
                )}
              </>
            )}
            {action === "contact" && (
              <>
                {input("Contact result", "result", {
                  options: [
                    ["", "Choose a result"],
                    ["sent", "Message sent"],
                    ["not-reached", "Unable to contact"],
                  ],
                  required: true,
                })}
                {input("Notes", "notes", { note: true })}
              </>
            )}
            {action === "reply" && (
              <>
                {input("Advice received", "advice", {
                  note: true,
                  required: true,
                })}
                {input("Planned next action", "nextAction", {
                  note: true,
                  required: true,
                })}
                <p className="small muted">
                  Recorded by {c.operator.name} from the Messenger reply.
                </p>
              </>
            )}
            {["actions", "resolve"].includes(action) && (
              <>
                {input("Actions taken", "actions", {
                  note: true,
                  required: true,
                })}
                {action === "resolve" && (
                  <>
                    {input("Outcome", "outcome", {
                      note: true,
                      required: true,
                    })}
                    {input("External destination", "destination")}
                  </>
                )}
                <p className="small muted">
                  Saving this follow-up does not complete or reopen the visit.
                </p>
              </>
            )}
            {action === "transfer" && (
              <>
                {c.data.drafts[patient.id]?.dirty && (
                  <Notice title="Review unsaved care first" kind="warning">
                    Save or discard care changes before confirming transfer.{" "}
                    <Button to={"/visits/" + visit.id}>Review visit</Button>
                  </Notice>
                )}
                {input("Destination facility", "destination", {
                  required: true,
                })}
                <details className="optional-care">
                  <summary>Transfer notes (optional)</summary>
                  {input("Transfer notes", "notes", { note: true })}
                </details>
                <label className="transfer-confirmation">
                  <input
                    name="confirmed"
                    type="checkbox"
                    checked={v.confirmed}
                    onChange={(e) => f.change("confirmed", e.target.checked)}
                    required
                  />
                  I confirm the patient has left the clinic for this facility.
                </label>
                <p className="small muted">
                  This completes the visit as Referred to an external facility
                  and generates a summary email for the school nurse. Check its
                  status in Messages; email is simulated here. Pending doctor
                  replies stay open.
                </p>
              </>
            )}
            <div className="actions">
              <Button to={r ? "/referrals/" + r.id : "/visits/" + visit.id}>
                Cancel
              </Button>
              <Button
                primary
                type="submit"
                disabled={
                  action === "transfer" && !!c.data.drafts[patient.id]?.dirty
                }
              >
                {labels[action]}
              </Button>
            </div>
          </fieldset>
        </form>
      </Card>
      {guard}
    </>
  );
}
