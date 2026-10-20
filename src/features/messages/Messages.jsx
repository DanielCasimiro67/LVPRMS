import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useClinic } from "../../app/ClinicProvider.jsx";
import {
  Heading,
  Card,
  Button,
  Badge,
  Field,
  Notice,
  ErrorBox,
  useDirtyGuard,
  when,
} from "../../components/ui.jsx";
import { useForm } from "../../components/useForm.js";
import {
  messageDetails,
  messageStatuses,
  recordManualFollowUp,
  createMessageService,
} from "../../../js/messages.js";
export function Messages() {
  const c = useClinic(),
    { id } = useParams(),
    [params] = useSearchParams(),
    m = c.data.messages.find((m) => m.id === id);
  if (c.mode === "api")
    return (
      <>
        <Heading>Messages</Heading>
        <Notice title="Not available yet">
          The current API provides visit notification logs, but no nurse-summary
          inbox, delivery, retry or follow-up contract. Messages are not loaded
          here. Use demo mode to review the approved workflow.
        </Notice>
        <Button to="/today">Back to Today</Button>
      </>
    );
  if (id)
    return m ? (
      <Message key={id} raw={m} />
    ) : (
      <>
        <Heading>Message not found</Heading>
        <Button to="/messages">Back to Messages</Button>
      </>
    );
  const filter = params.get("status") || "";
  return (
    <>
      <Heading sub="Check message status and follow up when needed.">
        Messages
      </Heading>
      <p className="small muted">
        {c.mode === "demo"
          ? "Demonstration only. Email results are simulated; no real email is delivered."
          : "The current API provides visit logs only; nurse summaries and message actions are not available yet."}
      </p>
      <nav className="actions" aria-label="Message status filters">
        {[["", "All messages"], ...Object.entries(messageStatuses)].map(
          ([v, l]) => (
            <Button
              key={v}
              to={"/messages?" + new URLSearchParams({ status: v })}
              className={filter === v ? "filter-selected" : ""}
            >
              {l}
            </Button>
          ),
        )}
      </nav>
      {[
        ["nurse-summary", "Nurse visit summaries"],
        ["concerned-party", "Other visit updates"],
      ].map(([kind, title]) => (
        <Card key={kind} title={title}>
          {c.data.messages
            .filter((m) => m.kind === kind && (!filter || m.status === filter))
            .map((raw) => {
              const m = messageDetails(raw);
              return (
                <article className="message-row" key={m.id}>
                  <div className="patient-info">
                    <strong>{m.subject}</strong>
                    <p>
                      {c.data.patients.find((p) => p.id === m.patientId)?.name}{" "}
                      · To: {m.recipientName}
                    </p>
                    <p className="small muted">{when(m.at)}</p>
                  </div>
                  <Badge>{messageStatuses[m.status]}</Badge>
                  <Button to={"/messages/" + m.id}>Open message</Button>
                </article>
              );
            })}
          {!c.data.messages.some(
            (m) => m.kind === kind && (!filter || m.status === filter),
          ) && <p>No messages match this filter.</p>}
        </Card>
      ))}
      <Button to="/today">Back to Today</Button>
    </>
  );
}
function Message({ raw }) {
  const c = useClinic(),
    m = messageDetails(raw),
    [open, setOpen] = useState(false),
    f = useForm({ note: "" }, c.data.revision),
    guard = useDirtyGuard(f.dirty),
    [feedback, setFeedback] = useState("");
  const process = (retry) => {
    if (f.dirty.current) {
      setFeedback(
        "Save or cancel the manual follow-up before updating message status.",
      );
      return;
    }
    try {
      c.runtime.session.requireSession();
      const service = createMessageService({
        repository: c.runtime.adapter.repository,
      });
      (retry ? service.retryMessage : service.processMessage)(
        m.id,
        f.rev.current,
      );
      c.reload();
      f.rev.current = c.runtime.adapter.read().revision;
      setFeedback(
        c.runtime.adapter.read().messages.find((x) => x.id === m.id)?.status ===
          "sent"
          ? "Message accepted by the simulated sending service"
          : "Message status updated.",
      );
    } catch (e) {
      f.setError(e.message);
    }
  };
  return (
    <>
      <Heading sub="Review the message and follow up when needed.">
        Message details
      </Heading>
      <Card
        title={
          m.kind === "nurse-summary" ? "Visit summary email" : "Visit update"
        }
      >
        <strong>{m.subject}</strong>
        <p>{c.data.patients.find((p) => p.id === m.patientId)?.name}</p>
        <p>
          To: {m.recipientName} · {m.recipient} · Email
        </p>
        <Badge>{messageStatuses[m.status] || "Status unavailable"}</Badge>
        <p className="small muted">
          Generated {when(m.at)} · Demonstration only
        </p>
        <div className="message-body">{m.body}</div>
        {m.status === "failed" && (
          <Notice title="Message could not be sent" kind="warning">
            The visit is saved. Retry or contact the recipient directly.
          </Notice>
        )}
        {m.status === "missing-recipient" && (
          <Notice title="Nurse email address is missing" kind="warning">
            The visit is saved. Ask school support to check the recipient before
            retrying.
          </Notice>
        )}
        <ErrorBox error={f.error} />
        <p role="status">{feedback}</p>
        <div className="actions">
          {["failed", "missing-recipient"].includes(m.status) && (
            <Button primary onClick={() => process(true)}>
              Retry message
            </Button>
          )}
          {m.status === "pending" && (
            <Button primary onClick={() => process(false)}>
              Check status
            </Button>
          )}
          <Button onClick={() => setOpen(true)}>Record manual follow-up</Button>
        </div>
        {open && (
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                const r = c.mutate(
                  (s, a, t) =>
                    recordManualFollowUp(s, m.id, f.values.note, a, t),
                  f.rev.current,
                );
                f.rev.current = r.state.revision;
                f.clean();
                f.setValues({ note: "" });
                setOpen(false);
              } catch (e) {
                f.setError(e.message);
              }
            }}
          >
            <Field
              label="What did you do to follow up?"
              name="follow-up-note"
              note
              value={f.values.note}
              onChange={(v) => f.change("note", v)}
              required
            />
            <div className="actions">
              <Button primary type="submit">
                Save follow-up
              </Button>
              <Button
                onClick={() => {
                  f.clean();
                  f.setValues({ note: "" });
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>
      <div className="actions">
        <Button to="/messages">Back to Messages</Button>
        {m.visitId && <Button to={"/visits/" + m.visitId}>View visit</Button>}
        <Button to="/today">Back to Today</Button>
      </div>
      <Card title="Message history" icon="history">
        <p className="small muted">
          The original email content is kept when a visit is corrected. Manual
          follow-up does not change the email status.
        </p>
        <details>
          <summary>Sending attempts ({m.attempts?.length || 0})</summary>
          {m.attempts?.map((a, i) => (
            <article className="note" key={i}>
              <strong>
                Attempt {i + 1} · {messageStatuses[a.status]}
              </strong>
              <p>
                {a.recipient} · {when(a.at)}
              </p>
              <p>{a.detail}</p>
            </article>
          ))}
        </details>
        <details open={!!m.followUps?.length}>
          <summary>Manual follow-up ({m.followUps?.length || 0})</summary>
          {m.followUps?.map((n, i) => (
            <article className="note" key={i}>
              <p>{n.note}</p>
              <p className="small muted">
                {n.author} · {when(n.at)}
              </p>
            </article>
          ))}
        </details>
      </Card>
      {guard}
    </>
  );
}
