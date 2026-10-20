import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ClinicProvider, createRuntime } from "./app/ClinicProvider.jsx";
import { createClinicRouter } from "./app/router.jsx";
import "../css/tokens.css";
import "../css/app.css";
import "./react.css";
const runtime = createRuntime({
  mode: import.meta.env.VITE_DATA_MODE || "demo",
  baseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1",
});
createRoot(document.getElementById("app")).render(
  <ClinicProvider runtime={runtime}>
    <a
      className="skip-link"
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("main")?.focus();
      }}
    >
      Skip to content
    </a>
    <RouterProvider router={createClinicRouter()} />
    <div
      id="announcement"
      className="sr-only"
      role="status"
      aria-live="polite"
    />
  </ClinicProvider>,
);
