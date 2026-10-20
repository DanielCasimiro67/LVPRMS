import React from "react";
import { createHashRouter, Navigate } from "react-router-dom";
import { App, Unavailable, UnknownCard } from "./App.jsx";
import { Account } from "../features/access/Access.jsx";
import { Today } from "../features/today/Today.jsx";
import { Patients, Record, Profile } from "../features/patients/Patients.jsx";
import { VisitPage } from "../features/visits/Visits.jsx";
import { Messages } from "../features/messages/Messages.jsx";
import { Referrals } from "../features/referrals/Referrals.jsx";
import { Inventory } from "../features/inventory/Inventory.jsx";
import { Reports } from "../features/reports/Reports.jsx";
export function createClinicRouter() {
  return createHashRouter([
    {
      path: "/",
      element: <App />,
      errorElement: (
        <main className="standalone-content">
          <Unavailable />
        </main>
      ),
      children: [
        { index: true, element: <Navigate to="/today" replace /> },
        { path: "login", element: null },
        { path: "logout", element: null },
        { path: "session-ended", element: null },
        { path: "today", element: <Today /> },
        { path: "account", element: <Account /> },
        { path: "patients", element: <Patients /> },
        { path: "patients/register", element: <Profile /> },
        { path: "patients/:id/edit", element: <Profile /> },
        { path: "patients/:id", element: <Record /> },
        { path: "visits/:id", element: <VisitPage /> },
        { path: "visits/:id/complete", element: <VisitPage /> },
        { path: "visits/:id/correct", element: <VisitPage /> },
        { path: "messages", element: <Messages /> },
        { path: "messages/:id", element: <Messages /> },
        { path: "referrals", element: <Referrals /> },
        { path: "referrals/:id/:action?", element: <Referrals /> },
        { path: "inventory", element: <Inventory /> },
        { path: "inventory/:id/:action?", element: <Inventory /> },
        { path: "reports", element: <Reports /> },
        { path: "reports/:kind", element: <Reports /> },
        { path: "reports/:kind/print", element: <Reports /> },
        { path: "intake/unknown", element: <UnknownCard /> },
        { path: "*", element: <Unavailable /> },
      ],
    },
  ]);
}
