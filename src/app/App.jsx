import React, { useEffect } from "react";
import {
  Outlet,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useClinic } from "./ClinicProvider.jsx";
import { Login, Expired, Recovery } from "../features/access/Access.jsx";
import { Button, Icon, Heading, Card, Notice } from "../components/ui.jsx";
import { createMessageService } from "../../js/messages.js";
const navigation = [
  ["Today", "/today", "today"],
  ["Patients", "/patients", "patients"],
  ["Referrals", "/referrals", "referrals"],
  ["Inventory", "/inventory", "inventory"],
  ["Reports", "/reports", "reports"],
];
export function App() {
  const c = useClinic(),
    location = useLocation(),
    nav = useNavigate(),
    path = location.pathname,
    printing = path.endsWith("/print");
  useEffect(() => {
    const h = document.querySelector("h1");
    if (h) {
      document.title =
        (path === "/login" ? "Sign in" : h.textContent) + " · La Verdad Clinic";
      h.focus({ preventScroll: true });
    }
  }, [path]);
  useEffect(() => {
    if (path === "/logout") {
      c.logout().finally(() => nav("/login", { replace: true }));
    }
  }, [path]);
  useEffect(() => {
    if (c.mode !== "demo" || !c.operator || !/^\/visits\/[^/]+$/.test(path))
      return;
    const timer = setTimeout(() => {
      try {
        c.runtime.session.requireSession();
        const s = c.runtime.adapter.read(),
          pending = s.messages.filter(
            (m) =>
              m.kind === "nurse-summary" &&
              m.status === "pending" &&
              !m.attempts?.length &&
              s.visits.some(
                (v) =>
                  path === "/visits/" + v.id &&
                  v.id === m.visitId &&
                  v.state === "Completed",
              ),
          );
        if (!pending.length) return;
        const service = createMessageService({
          repository: c.runtime.adapter.repository,
        });
        for (const m of pending) service.processMessage(m.id);
        c.reload();
      } catch (e) {
        c.setFeedback(e.message);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [path, c.data.revision]);
  if (c.error) return <Recovery />;
  if (path === "/login") return <Login />;
  if (path === "/session-ended") return <Expired />;
  if (c.expired) return <Navigate to="/session-ended" replace />;
  if (c.loading)
    return (
      <main className="standalone-content">
        <Heading>Loading clinic records…</Heading>
      </main>
    );
  if (!c.operator) return <Navigate to="/login" replace />;
  if (path === "/logout") return <Heading>Signing out…</Heading>;
  if (printing)
    return (
      <main
        id="main"
        className={
          path.startsWith("/reports") ? "report-print" : "referral-print"
        }
      >
        <Outlet />
      </main>
    );
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Clinic workspace">
        <p className="brand">✚ &nbsp;La Verdad</p>
        <p className="brand-subtitle">SCHOOL CLINIC</p>
        <nav className="nav-links" aria-label="Main navigation">
          {navigation.map(([l, to, icon]) => (
            <Link
              key={to}
              to={to}
              className="nav-link"
              aria-current={
                path.startsWith(to) ||
                (to === "/today" &&
                  (path.startsWith("/visits") ||
                    path.startsWith("/messages") ||
                    path === "/account"))
                  ? "page"
                  : undefined
              }
            >
              <Icon name={icon} />
              <span>{l}</span>
            </Link>
          ))}
        </nav>
        <div className="account-links">
          <p>{c.operator.name}</p>
          <p className="small muted">{c.operator.role}</p>
          <Button to="/account">My account</Button>
          <Button to="/logout">Sign out</Button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="school">La Verdad Christian College · Clinic</span>
          <Button to="/messages">Messages</Button>
        </header>
        <main id="main" className="content" tabIndex="-1">
          {c.mode === "api" && (
            <Notice title="API preview">
              Some actions are not available yet because the backend cannot
              persist the approved workflow. No demo data is used in this mode.
            </Notice>
          )}
          {c.feedback && (
            <Notice title="Please review">
              {c.feedback}{" "}
              <Button onClick={() => c.reload()}>Reload records</Button>
            </Notice>
          )}
          <div key={path} className="route-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export function Unavailable() {
  return (
    <>
      <Heading>Page unavailable</Heading>
      <Card title="This page is not available">
        <Button primary to="/today">
          Back to Today
        </Button>
      </Card>
    </>
  );
}

export function UnknownCard() {
  return (
    <>
      <Heading>Card not recognized</Heading>
      <Card title="We couldn’t find this card">
        <p>
          Search by name, or register a new patient. Department details identify
          the patient category.
        </p>
        <div className="actions">
          <Button primary to="/patients">
            Search by name
          </Button>
          <Button to="/patients/register">Register patient</Button>
          <Button to="/today">Try scanning again</Button>
        </div>
      </Card>
    </>
  );
}
