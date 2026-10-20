import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClinic } from "../../app/ClinicProvider.jsx";
import {
  Heading,
  Card,
  Field,
  Button,
  Password,
  ErrorBox,
  Notice,
  Icon,
} from "../../components/ui.jsx";
export function Login() {
  const c = useClinic(),
    nav = useNavigate(),
    [user, setUser] = useState(c.mode === "demo" ? "elena.lim" : ""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <main id="main" tabIndex="-1" className="login-layout">
      <section className="card login-card">
        <h2>
          <Icon />
          Welcome back
        </h2>
        <p className="muted">Sign in to La Verdad Clinic.</p>
        <h1 className="tagline">Patient care, kept simple.</h1>
        <form
          id="login-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await c.login(user, password);
              nav("/today");
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <ErrorBox error={error} />
          <Field
            label={c.mode === "api" ? "Email" : "Username"}
            name="username"
            markRequired={false}
            type={c.mode === "api" ? "email" : "text"}
            value={user}
            onChange={setUser}
            required
            autoComplete="username"
          />
          <Password
            label="Password"
            name="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          <Button primary type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="login-help">
          Need help signing in? Contact school support.
        </p>
      </section>
    </main>
  );
}
export function Account() {
  const c = useClinic(),
    [v, setV] = useState(["", "", ""]),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false),
    [busy, setBusy] = useState(false),
    [mask, setMask] = useState(0);
  return (
    <>
      <Heading sub="Manage your password.">My account</Heading>
      {success && (
        <Notice title="Password changed" kind="success">
          {c.mode === "demo"
            ? "Your new password works for this demo until the page is reloaded."
            : "Your password has been updated."}
        </Notice>
      )}
      <Card title={c.operator.name}>
        <p>{c.operator.role}</p>
        <Field
          label="Username"
          name="account-username"
          value={c.operator.username}
          readOnly
          hint="Contact school support to change your username."
        />
      </Card>
      <Card title="Change password">
        <form
          id="password-form"
          className="form-stack"
          onSubmit={async (e) => {
            e.preventDefault();
            setMask((x) => x + 1);
            setBusy(true);
            setError("");
            try {
              await c.changePassword(...v);
              setV(["", "", ""]);
              setSuccess(true);
            } catch (e) {
              setError({
                message: e.message,
                field:
                  e.code === "CURRENT_PASSWORD"
                    ? "current-password"
                    : e.code === "PASSWORD_CONFIRMATION"
                      ? "confirm-password"
                      : "new-password",
              });
            } finally {
              setBusy(false);
            }
          }}
        >
          <ErrorBox error={error} />
          {["Current password", "New password", "Confirm new password"].map(
            (label, i) => (
              <Password
                key={mask + "-" + i}
                label={label}
                name={
                  ["current-password", "new-password", "confirm-password"][i]
                }
                value={v[i]}
                onChange={(value) =>
                  setV((v) => v.map((old, k) => (k === i ? value : old)))
                }
                autoComplete={i ? "new-password" : "current-password"}
              />
            ),
          )}
          {c.mode === "demo" && (
            <p className="small muted">
              Demo password changes reset when you reload this page.
            </p>
          )}
          <div className="actions">
            <Button primary type="submit" disabled={busy}>
              Save password
            </Button>
            <Button to="/today">Back to Today</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
export function Expired() {
  return (
    <main id="main" tabIndex="-1" className="standalone-content">
      <Heading>Please sign in again</Heading>
      <Card title="Your session has ended">
        <p>Sign in again to continue with your saved work.</p>
        <Button to="/login" primary>
          Sign in
        </Button>
      </Card>
    </main>
  );
}
export function Recovery() {
  const c = useClinic();
  return (
    <main id="main" tabIndex="-1" className="standalone-content">
      <Heading>Records could not be opened</Heading>
      <Card title="Your saved data has been kept">
        <ErrorBox error={c.error} />
        <p>
          Try again after checking your browser storage. If the problem
          continues, download your saved data and ask school support for help.
        </p>
        <div className="actions">
          <Button onClick={() => location.reload()}>Try again</Button>
          <Button
            onClick={() => {
              const raw = localStorage.getItem("lvcc.clinic.v1");
              const url = URL.createObjectURL(
                new Blob([raw || ""], { type: "application/json" }),
              );
              const a = document.createElement("a");
              a.href = url;
              a.download = "clinic-records-recovery.json";
              a.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            Download saved data
          </Button>
        </div>
      </Card>
    </main>
  );
}
