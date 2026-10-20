import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
test("React fields retain searchable education choices, labels and escaped patient text", async () => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true },
    appType: "custom",
  });
  try {
    const { Field } = await server.ssrLoadModule("/src/components/ui.jsx");
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
  } finally {
    await server.close();
  }
});
