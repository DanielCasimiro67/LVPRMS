import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClinic } from "../../app/ClinicProvider.jsx";
import {
  Heading,
  Card,
  Button,
  Badge,
  ErrorBox,
  Modal,
  Field,
  Icon,
} from "../../components/ui.jsx";
import {
  resolveIntake,
  createScanReader,
  createScanGate,
} from "../../../js/intake.js";
import { startOrResumeVisit, patientDescription } from "../../../js/clinic.js";
import { dischargeVisit } from "../../../js/discharge.js";
import { outcomes } from "../../../js/visits.js";
export function Discharge({ visit, onClose }) {
  const c = useClinic(),
    nav = useNavigate(),
    [revision] = useState(c.data.revision),
    [outcome, setOutcome] = useState(""),
    [notes, setNotes] = useState(""),
    [error, setError] = useState(""),
    reader = useRef(createScanReader()),
    p = c.data.patients.find((p) => p.id === visit.patientId);
  return (
    <Modal title="Discharge patient?" onCancel={onClose}>
      <p>
        <strong>{p.name}</strong> · {visit.complaint}
      </p>
      <p>
        Completing this visit generates a summary email for the school nurse.
        You can review its status in Messages.
      </p>
      {c.data.drafts[p.id]?.dirty ? (
        <>
          <p>Review unsaved care first</p>
          <Button to={"/visits/" + visit.id}>Review visit</Button>
          <div className="actions">
            <Button autoFocus primary onClick={onClose}>
              Keep in clinic
            </Button>
            <Button disabled>Confirm discharge</Button>
          </div>
        </>
      ) : (
        <form
          id="discharge-form"
          className="form-stack"
          onKeyDownCapture={(e) => {
            if (reader.current.feed(e.key)) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onSubmit={(e) => {
            e.preventDefault();
            if (e.nativeEvent.submitter?.dataset.intent !== "discharge") return;
            try {
              c.mutate(
                (s, a, t) =>
                  dischargeVisit(
                    s,
                    visit.id,
                    { outcome, finalNotes: notes },
                    a,
                    t,
                  ),
                revision,
              );
              onClose();
              nav("/visits/" + visit.id);
            } catch (e) {
              setError(e.message);
            }
          }}
        >
          <ErrorBox error={error} />
          <Field
            label="Outcome"
            name="outcome"
            id="discharge-outcome"
            options={[["", "Choose an outcome"], ...outcomes]}
            value={outcome}
            onChange={setOutcome}
            required
          />
          <details>
            <summary>Final notes (optional)</summary>
            <Field
              label="Final notes"
              name="finalNotes"
              note
              value={notes}
              onChange={setNotes}
            />
          </details>
          <div className="actions">
            <Button autoFocus onClick={onClose} primary>
              Keep in clinic
            </Button>
            <Button type="submit" data-confirm data-intent="discharge">
              Confirm discharge
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
export function Today() {
  const c = useClinic(),
    nav = useNavigate(),
    [status, setStatus] = useState([
      "Ready to scan",
      "The patient’s visit form will open automatically.",
    ]),
    [error, setError] = useState(""),
    [discharge, setDischarge] = useState(null),
    gate = useRef(createScanGate()),
    busy = useRef(false);
  useEffect(() => {
    const reader = createScanReader();
    let timer;
    const f = (e) => {
      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.target.closest?.("input,textarea,select,dialog,[contenteditable]") ||
        document.querySelector("dialog[open]") ||
        busy.current
      )
        return;
      const value = reader.feed(e.key);
      if (!value || !gate.current.accept(value)) return;
      e.preventDefault();
      try {
        if (c.mode === "api") {
          setError(
            "Live scanning requires a verified unique-identity contract. Search by name while the backend is being aligned.",
          );
          return;
        }
        const current = c.runtime.adapter.read(),
          result = resolveIntake(current, value);
        busy.current = true;
        if (result.kind === "match") {
          setStatus(["ID scanned", "Patient found. Opening visit…"]);
          const active = current.visits.find(
            (v) => v.patientId === result.patientId && v.state !== "Completed",
          );
          if (active) {
            busy.current = false;
            setDischarge(active);
          } else {
            const r = c.mutate(
              (s, a, t) => startOrResumeVisit(s, result.patientId, a, t),
              current.revision,
            );
            timer = setTimeout(
              () => nav("/visits/new?patient=" + result.patientId),
              450,
            );
          }
        } else {
          setStatus(["Patient not found", "Opening registration…"]);
          timer = setTimeout(() => nav(result.href), 450);
        }
      } catch (e) {
        setError(e.message);
        busy.current = false;
      }
    };
    const blur = () => {
      reader.reset();
      clearTimeout(timer);
      busy.current = false;
    };
    window.addEventListener("keydown", f);
    window.addEventListener("blur", blur);
    return () => {
      clearTimeout(timer);
      busy.current = false;
      window.removeEventListener("keydown", f);
      window.removeEventListener("blur", blur);
    };
  }, [c.mode, c.operator?.id]);
  return (
    <>
      <Heading
        sub={
          new Date().toLocaleDateString("en-PH", {
            weekday: "long",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Manila",
          }) + " · Your clinic at a glance."
        }
      >
        Today
      </Heading>
      <ErrorBox error={error} />
      <section
        className="card scan-hero"
        id="scan-hero"
        data-state={status[0] === "Ready to scan" ? "ready" : "processing"}
      >
        <div className="scan-id" aria-hidden="true">
          <div className="scan-id-brand">
            <Icon name="visit" />
            <span>LA VERDAD · CLINIC</span>
          </div>
          <div className="scan-id-face">
            <div className="scan-id-photo" />
            <div className="scan-id-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="scan-id-stripe" />
        </div>
        <h2 id="scan-title">Please scan your ID</h2>
        <div id="scan-feedback" className="scan-feedback" role="status">
          <strong>{status[0]}</strong>
          <p>{status[1]}</p>
        </div>
        <p className="small muted">
          No ID? Search by name, or register a new patient.
        </p>
        <div className="actions">
          <Button to="/patients">Search by name</Button>
          <Button to="/patients/register">Register patient</Button>
        </div>
      </section>
      <Card title="In the clinic" icon="patients">
        <p>Continue care for patients who are still here.</p>
        {c.data.visits
          .filter((v) => v.state !== "Completed")
          .map((v) => {
            const p = c.data.patients.find((p) => p.id === v.patientId);
            return (
              p && (
                <article className="patient-row" key={v.id}>
                  <div className="patient-info">
                    <strong>{p.name}</strong>
                    <p className="small muted">
                      {patientDescription(p)} ·{" "}
                      {new Date(v.startedAt)
                        .toLocaleTimeString("en", {
                          timeZone: "Asia/Manila",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                        .toLowerCase()}
                    </p>
                  </div>
                  <Badge>{v.state}</Badge>
                  <Button to={"/visits/" + v.id}>Open</Button>
                  <Button
                    disabled={c.mode === "api"}
                    aria-label={"Discharge " + p.name}
                    onClick={() => setDischarge(v)}
                  >
                    Discharge
                  </Button>
                </article>
              )
            );
          })}
        {!c.data.visits.some((v) => v.state !== "Completed") && (
          <p>No patients are currently in the clinic.</p>
        )}
      </Card>
      <Card title="Needs attention" icon="attention">
        <div className="actions">
          <Button to="/referrals">
            {c.data.referrals.filter((r) => r.state !== "Resolved").length}{" "}
            referral follow-ups
          </Button>
          <Button to="/messages">
            {
              c.data.messages.filter((m) =>
                ["failed", "missing-recipient"].includes(m.status),
              ).length
            }{" "}
            messages need attention
          </Button>
        </div>
      </Card>
      <p className="small muted">
        {c.data.schoolUpdatedAt
          ? "School records updated " +
            new Date(c.data.schoolUpdatedAt).toLocaleString("en-PH", {
              timeZone: "Asia/Manila",
            })
          : "School records have not been updated yet."}
      </p>
      {discharge && (
        <Discharge
          visit={discharge}
          onClose={() => {
            gate.current = createScanGate();
            setStatus([
              "Ready to scan",
              "The patient’s visit form will open automatically.",
            ]);
            setDischarge(null);
          }}
        />
      )}
    </>
  );
}
