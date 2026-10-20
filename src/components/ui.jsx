import React, { useEffect, useRef, useState } from "react";
import { Link, useBlocker } from "react-router-dom";
import { NOTE_LIMIT, validateNote } from "../../js/note-rules.js";
import { matchesPatientIdentity } from "../../js/edit-identity.js";
import { patientDescription } from "../../js/clinic.js";
const icons = import.meta.glob("../../assets/icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
export function Icon({ name = "default" }) {
  return (
    <img
      className="icon"
      src={
        icons[`../../assets/icons/${name}.svg`] ||
        icons["../../assets/icons/default.svg"]
      }
      width="20"
      height="20"
      alt=""
    />
  );
}
export function Button({ to, primary = false, children, ...p }) {
  const props = {
    ...p,
    "data-safe-focus": p.autoFocus || undefined,
    className: `button${primary ? " button-primary" : ""} ${p.className || ""}`,
  };
  return to && !p.disabled ? (
    <Link {...props} to={to}>
      {children}
    </Link>
  ) : (
    <button type="button" {...props}>
      {children}
    </button>
  );
}
export function Heading({ children, sub }) {
  return (
    <header className="page-heading">
      <h1 tabIndex="-1">{children}</h1>
      {sub && <p className="muted">{sub}</p>}
    </header>
  );
}
export function Card({ title, icon = "default", children }) {
  return (
    <section className="card">
      <h2>
        <Icon name={icon} />
        {title}
      </h2>
      {children}
    </section>
  );
}
export function Notice({ title, children, kind = "info" }) {
  return (
    <div className={"notice notice-" + kind} role="status">
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  );
}
export function ErrorBox({ error }) {
  const ref = useRef();
  useEffect(() => {
    if (error) {
      const input = error.field && document.getElementById(error.field);
      if (input) input.focus();
      else ref.current?.focus();
    }
  }, [error]);
  return error ? (
    <div
      ref={ref}
      tabIndex="-1"
      className="notice notice-error form-error"
      role="alert"
    >
      {error.message || error}
    </div>
  ) : null;
}
export function Field({
  label,
  name,
  id = name,
  value = "",
  onChange,
  options,
  choices,
  note = false,
  hint,
  markRequired = true,
  ...p
}) {
  const ref = useRef(),
    inputId = id;
  useEffect(() => {
    if (note && ref.current) {
      try {
        validateNote(value, { required: p.required });
        ref.current.setCustomValidity("");
      } catch (e) {
        ref.current.setCustomValidity(e.message);
      }
    }
  }, [value, note, p.required]);
  const common = {
    ...p,
    list: choices ? inputId + "-choices" : p.list,
    id: inputId,
    name,
    value: value ?? "",
    onChange: (e) => onChange?.(e.target.value),
    ref,
    "aria-describedby": hint || note ? inputId + "-hint" : undefined,
  };
  return (
    <div className="field">
      <label htmlFor={inputId}>
        {label}
        {p.required && markRequired && <span aria-hidden="true"> *</span>}
      </label>
      {options ? (
        <select {...common}>
          {options.map((o) => {
            const [v, l] = Array.isArray(o) ? o : [o, o];
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
      ) : note ? (
        <textarea {...common} rows="3" />
      ) : (
        <input {...common} />
      )}{" "}
      {choices && (
        <datalist id={inputId + "-choices"}>
          {choices.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
      )}
      {(hint || note) && (
        <p
          id={inputId + "-hint"}
          className={
            "small muted note-counter" +
            (note && String(value || "").length > NOTE_LIMIT
              ? " note-over-limit"
              : "")
          }
        >
          {note
            ? `${String(value || "").length.toLocaleString()} / ${NOTE_LIMIT.toLocaleString()} characters${String(value || "").length > NOTE_LIMIT ? " — shorten before saving; text kept." : ""}`
            : hint}
        </p>
      )}
    </div>
  );
}
export function Password({ label, name, value, onChange, ...p }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <div className="password-control">
        <input
          {...p}
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={show ? "text" : "password"}
          required
        />
        <button
          className="password-toggle"
          data-password-toggle={name}
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-controls={name}
          aria-pressed={show}
          aria-label={(show ? "Hide " : "Show ") + label.toLowerCase()}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {show && <path d="m3 3 18 18" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
export function Identity({ patient: p }) {
  return (
    <div className="visit-identity">
      <section className="identity-panel">
        <strong>{p.name}</strong>
        <p>{patientDescription(p)}</p>
      </section>
      <p className="small">
        Allergy: {p.allergy || "Not recorded"} · Blood type:{" "}
        {p.bloodType || "Not recorded"}
      </p>
    </div>
  );
}
export function Badge({ children, className = "" }) {
  return (
    <span
      className={
        "badge " +
        ({
          Completed: "badge-success",
          Sent: "badge-sent",
          Failed: "badge-failed",
          Pending: "badge-pending",
          "Missing recipient": "badge-missing-recipient",
          "In stock": "badge-success",
          "Low stock": "badge-waiting",
          "Out of stock": "badge-waiting",
          Resolved: "badge-success",
          "Record complete": "badge-success",
          "Record incomplete": "badge-waiting",
          "Awaiting doctor reply": "badge-waiting",
          "Resting in clinic": "badge-success",
          "No active visit": "badge-success",
        }[children] || "") +
        " " +
        className
      }
    >
      {children}
    </span>
  );
}
export function Modal({ title, onCancel, children }) {
  const ref = useRef(),
    cancel = useRef(onCancel);
  cancel.current = onCancel;
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    d.querySelector("[data-safe-focus]")?.focus();
    return () => d.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="switch-dialog"
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        cancel.current();
      }}
    >
      <h2>{title}</h2>
      {children}
    </dialog>
  );
}
export function useDirtyGuard(
  dirty,
  { onDiscard, onSave, beforeUnload = true } = {},
) {
  const current = useRef(dirty);
  current.current = dirty;
  const [error, setError] = useState("");
  const check = () =>
    typeof current.current === "object"
      ? current.current.current
      : current.current;
  const blocker = useBlocker(check);
  useEffect(() => {
    const f = (e) => {
      if (beforeUnload && check()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", f);
    return () => window.removeEventListener("beforeunload", f);
  }, [beforeUnload]);
  const proceed = (fn) => {
    try {
      fn?.();
      if (typeof current.current === "object") current.current.current = false;
      blocker.proceed();
    } catch (e) {
      setError(e.message);
    }
  };
  return blocker.state === "blocked" ? (
    <Modal title="Unsaved changes" onCancel={() => blocker.reset()}>
      <p>Your changes have not been saved.</p>
      <ErrorBox error={error} />
      <div className="actions">
        <Button primary autoFocus onClick={() => blocker.reset()}>
          Keep editing
        </Button>
        {onSave && (
          <Button onClick={() => proceed(onSave)}>Save and switch</Button>
        )}
        <Button onClick={() => proceed(onDiscard)}>Discard changes</Button>
      </div>
    </Modal>
  ) : null;
}
export function ConfirmIdentity({ patient, state, onConfirmed, onCancel }) {
  const [value, setValue] = useState(""),
    [error, setError] = useState("");
  return (
    <Modal title="Confirm patient before editing" onCancel={onCancel}>
      <p>Ask the patient to present their RFID, school ID or patient ID.</p>
      <p>
        Patient ID: <strong>{patient.id}</strong>
      </p>
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (matchesPatientIdentity(state, patient.id, value)) onConfirmed();
          else
            setError("This ID does not uniquely match the selected patient.");
        }}
      >
        <ErrorBox error={error} />
        <Field
          label="RFID, school ID or patient ID"
          name="edit-identifier"
          value={value}
          onChange={setValue}
          required
        />
        <div className="actions">
          <Button primary type="submit">
            Confirm patient
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
export const when = (value) =>
  value
    ? new Date(value).toLocaleString("en-PH", { timeZone: "Asia/Manila" })
    : "Not recorded";
