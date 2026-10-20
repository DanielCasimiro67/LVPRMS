import React, { useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useClinic } from "../../app/ClinicProvider.jsx";
import {
  Heading,
  Card,
  Field,
  Button,
  Badge,
  ErrorBox,
  when,
} from "../../components/ui.jsx";
import {
  reportRows,
  summarizeReports,
  clinicDay,
} from "../../../js/reports.js";
import { patientDescription } from "../../../js/clinic.js";
const titles = {
    daily: "Reports",
    monthly: "Monthly summary",
    complaints: "Visits by complaint",
    frequent: "Frequent patients",
  },
  count = (n) => `${n} visit${n === 1 ? "" : "s"}`;
export function Reports() {
  const c = useClinic(),
    { kind = "daily" } = useParams(),
    [params] = useSearchParams(),
    nav = useNavigate(),
    location = useLocation(),
    print = location.pathname.endsWith("/print"),
    today = clinicDay(new Date()),
    month = today.slice(0, 7),
    end = new Date(
      Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)), 0),
    )
      .toISOString()
      .slice(0, 10),
    [f, setF] = useState({
      from: params.get("from") ?? (kind === "daily" ? today : month + "-01"),
      to: params.get("to") ?? (kind === "daily" ? today : end),
      type: params.get("type") || "all",
      complaint: params.get("complaint") || "",
    }),
    [error, setError] = useState("");
  if (!titles[kind]) return <Heading>Report not found</Heading>;
  let rows = [];
  try {
    rows = reportRows(
      c.data,
      print
        ? Object.fromEntries(params)
        : Object.fromEntries(
            new URLSearchParams({
              from: params.get("from") ?? f.from,
              to: params.get("to") ?? f.to,
              type: params.get("type") || "all",
              complaint: params.get("complaint") || "",
            }),
          ),
    );
  } catch {}
  const x = summarizeReports(rows),
    total = `${count(x.total)} · ${x.types.student} students · ${x.types.staff} staff · ${x.types.visitor} visitors`,
    href = (kind, filters = f, printing = false) =>
      "/reports" +
      (kind === "daily"
        ? printing
          ? "/daily/print"
          : ""
        : "/" + kind + (printing ? "/print" : "")) +
      "?" +
      new URLSearchParams(filters),
    input = (label, key, props = {}) => (
      <Field
        label={label}
        name={key}
        value={f[key]}
        onChange={(v) => setF((f) => ({ ...f, [key]: v }))}
        {...props}
      />
    ),
    breakdown = (title, rows) => (
      <>
        <h3>{title}</h3>
        {rows.length ? (
          rows.map((r, i) => (
            <p key={i}>
              {r.label}: {count(r.count)}
            </p>
          ))
        ) : (
          <p>No matching visits.</p>
        )}
      </>
    );
  return (
    <>
      <Heading
        sub={
          print
            ? `${params.get("from") || "All dates"} to ${params.get("to") || "All dates"} · Prepared by ${c.operator.name}`
            : "Review saved clinic activity by date and patient type."
        }
      >
        {print && kind === "daily" ? "Daily patient log" : titles[kind]}
      </Heading>
      {!print && (
        <Card title="Report filters" icon="reports">
          <form
            id="report-filters"
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                reportRows(c.data, f);
                setError("");
                nav(
                  href(
                    kind,
                    f,
                    e.nativeEvent.submitter?.dataset.print === "true",
                  ),
                );
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            <ErrorBox error={error} />
            <div className="report-filters">
              <fieldset className="date-range">
                <legend>Date range</legend>
                <div>
                  {input("From", "from", { type: "date" })}
                  {input("To", "to", { type: "date" })}
                </div>
              </fieldset>
              {input("Patient type", "type", {
                options: [
                  ["all", "All patients"],
                  ["student", "Students"],
                  ["staff", "Staff"],
                  ["visitor", "Visitors"],
                ],
              })}
              {input("Complaint", "complaint", {
                options: [
                  ["", "All complaints"],
                  ...[
                    ...new Set(
                      c.data.visits.map((v) => v.complaint).filter(Boolean),
                    ),
                  ],
                ],
              })}
            </div>
            <div className="actions">
              <Button primary type="submit">
                Apply filters
              </Button>
              <Button type="submit" data-print="true">
                {kind === "daily" ? "Print daily log" : "Print report"}
              </Button>
              {kind !== "daily" && (
                <Button to={href("daily")}>Back to reports</Button>
              )}
            </div>
          </form>
        </Card>
      )}
      {kind === "daily" && (
        <Card
          title={print ? "Daily patient log" : "Clinic activity"}
          icon="patients"
        >
          <p className="report-total">{total}</p>
          {print ? (
            <div className="report-table-wrap">
              <table className="report-table">
                <thead>
                  <tr>
                    {[
                      "Date / time",
                      "Patient",
                      "Patient details",
                      "Complaint",
                      "State / outcome",
                    ].map((t) => (
                      <th key={t}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((v) => (
                    <tr key={v.id}>
                      <td>{when(v.startedAt)}</td>
                      <td>{v.patient.name}</td>
                      <td>{patientDescription(v.patient)}</td>
                      <td>{v.complaint}</td>
                      <td>
                        {v.state}
                        {v.outcome && (
                          <>
                            <br />
                            {v.outcome}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td colSpan="5">No visits match these filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            rows.map((v) => (
              <article className="patient-row" key={v.id}>
                <div className="patient-info">
                  <strong>{v.patient.name}</strong>
                  <p className="small muted">
                    {patientDescription(v.patient)} · {v.complaint}
                  </p>
                  <p className="small muted">{when(v.startedAt)}</p>
                </div>
                <Badge>{v.state}</Badge>
                <Button to={"/visits/" + v.id}>Open</Button>
              </article>
            ))
          )}
          {!print && !rows.length && <p>No visits match these filters.</p>}
        </Card>
      )}
      {kind === "monthly" && (
        <Card title="Monthly summary">
          <p className="report-total">{total}</p>
          {breakdown(
            "Monthly totals",
            x.months.map((m) => ({
              ...m,
              label: new Date(m.label + "-01T00:00:00Z").toLocaleDateString(
                "en",
                { month: "long", year: "numeric", timeZone: "UTC" },
              ),
            })),
          )}
          {breakdown(
            "Students by grade and section / program and year",
            x.students,
          )}
          {breakdown("Staff by department", x.departments)}
          <p>Visitors: {count(x.types.visitor)}</p>
        </Card>
      )}
      {kind === "complaints" && (
        <Card title="Visits by complaint">
          {x.complaints.map((r) => (
            <div key={r.label}>
              <p>
                {r.label} · {count(r.count)}
              </p>
              <div className="report-bar" aria-hidden="true">
                <span
                  style={{
                    width:
                      (100 * r.count) / (x.complaints[0]?.count || 1) + "%",
                  }}
                />
              </div>
            </div>
          ))}
          {!rows.length && <p>No visits match these filters.</p>}
        </Card>
      )}
      {kind === "frequent" && (
        <Card title="Frequent patients" icon="patients">
          {x.frequent.map((r) => (
            <article className="patient-row" key={r.patient.id}>
              <div className="patient-info">
                <strong>{r.patient.name}</strong>
                <p>{patientDescription(r.patient)}</p>
              </div>
              <Badge>{count(r.count)}</Badge>
              <Button to={"/patients/" + r.patient.id}>Open</Button>
            </article>
          ))}
          {!rows.length && <p>No patients match these filters.</p>}
        </Card>
      )}
      {print ? (
        <div className="actions">
          <Button primary onClick={() => window.print()}>
            Print / Save PDF
          </Button>
          <Button to={href(kind, Object.fromEntries(params))}>
            Back to reports
          </Button>
        </div>
      ) : (
        kind === "daily" && (
          <Card title="Other reports" icon="reports">
            <div className="actions">
              {["monthly", "complaints", "frequent"].map((k) => (
                <Button
                  key={k}
                  to={href(k, { type: f.type, complaint: f.complaint })}
                >
                  {titles[k]}
                </Button>
              ))}
            </div>
          </Card>
        )
      )}
      <p className="small muted report-note">
        Counts include saved ongoing and completed visits, grouped by arrival
        date in Philippine time. Drafts are excluded. Patient categories and
        education/department groups use the current patient record.
      </p>
    </>
  );
}
