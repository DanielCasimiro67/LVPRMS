import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { MemoryRouter } from "react-router-dom";
test("React fields retain searchable education choices, labels and escaped patient text", async () => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true },
    appType: "custom",
  });
  try {
    const { Field, Badge } = await server.ssrLoadModule(
      "/src/components/ui.jsx",
    );
    assert.match(renderToStaticMarkup(React.createElement(Badge, null, "No active visit")), /badge-neutral/);
    assert.doesNotMatch(renderToStaticMarkup(React.createElement(Badge, null, "In clinic")), /badge-success|badge-neutral/);
    const html = renderToStaticMarkup(
      React.createElement(Field, {
        label: "Program",
        name: "program",
        value: "<patient>",
        choices: ["BSIS"],
        onChange() {},
      }),
    );
    assert.match(html, /<datalist/);
    assert.match(html, /value="BSIS"/);
    assert.match(html, /&lt;patient&gt;/);
    assert.match(html, /for="program"/);
    for (const label of ["Record incomplete", "Awaiting doctor reply"]) {
      assert.match(
        renderToStaticMarkup(React.createElement(Badge, null, label)),
        /badge-waiting/,
      );
    }
    assert.match(
      renderToStaticMarkup(React.createElement(Badge, null, "Record complete")),
      /badge-success/,
    );
    const { ReferralRow } = await server.ssrLoadModule(
      "/src/features/referrals/Referrals.jsx",
    );
    const row = renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ReferralRow, {
          state: {
            patients: [{ id: "mara", name: "Mara Santos" }],
            visits: [
              {
                id: "v1",
                patientId: "mara",
                complaint: "Headache",
                state: "Completed",
                outcome: "Sent home",
              },
            ],
          },
          referral: {
            id: "r1",
            visitId: "v1",
            state: "Awaiting doctor reply",
            preparedAt: "2026-10-20T01:00:00Z",
          },
        }),
      ),
    );
    assert.match(row, /Mara Santos/);
    assert.match(row, /Headache/);
    assert.match(row, /Checked out/);
    assert.match(row, /badge-waiting/);
    assert.doesNotMatch(row, /Patient unavailable/);
  } finally {
    await server.close();
  }
});
