import test from "node:test";
import assert from "node:assert/strict";
import {
  mapVisit,
  requiredId,
  endpoints,
} from "../src/services/api-contracts.js";
import { createApiAdapter } from "../src/services/api-adapter.js";
test("backend referral preparation is not evidence of completed care", () => {
  const v = mapVisit({
    visit_id: 1,
    patient_id: 2,
    status: "referred",
    created_at: "2026-10-20T00:00:00Z",
  });
  assert.notEqual(v.state, "Completed");
  assert.match(v.state, /unconfirmed/i);
});
test("API detail reads retain issued supply quantity, unit and source ID", async () => {
  const api = createApiAdapter({
    fetchImpl: async (url) =>
      new Response(
        JSON.stringify({
          data: url.endsWith("/supplies")
            ? [
                {
                  item_id: 7,
                  quantity_used: 2,
                  inventory_item: { item_name: "Gauze", unit: "pieces" },
                },
              ]
            : [],
        }),
      ),
    tokenStore: { get: () => null, clear() {} },
  });
  const result = await api.visitDetails("4");
  assert.deepEqual(result.supplies, [
    { itemId: "7", name: "Gauze", unit: "pieces", quantity: 2 },
  ]);
});
test("API identifiers reject objects and booleans rather than inventing record keys", () => {
  for (const id of [undefined, null, "", {}, false, NaN])
    assert.throws(() => requiredId(id));
  assert.equal(requiredId(5), "5");
});
test("all 24 nurse contract methods retain verified verbs, paths and encoded IDs", async () => {
  const expected = {
    login: ["POST", "/login"],
    me: ["GET", "/me"],
    logout: ["POST", "/logout"],
    password: ["PUT", "/me/password"],
    lookup: ["GET", "/patients/lookup"],
    patients: ["GET", "/patients"],
    createPatient: ["POST", "/patients"],
    patient: ["GET", "/patients/:id"],
    updatePatient: ["PUT", "/patients/:id"],
    deletePatient: ["DELETE", "/patients/:id"],
    history: ["GET", "/patients/:id/history"],
    symptoms: ["GET", "/symptoms"],
    symptom: ["GET", "/symptoms/:id"],
    visits: ["GET", "/visits"],
    createVisit: ["POST", "/visits"],
    updateVisit: ["PUT", "/visits/:id"],
    inventory: ["GET", "/inventory-items"],
    issueSupply: ["POST", "/visit-supplies"],
    supplies: ["GET", "/visits/:id/supplies"],
    createReferral: ["POST", "/diagnostic-referrals"],
    referral: ["GET", "/visits/:id/referral"],
    createLog: ["POST", "/notification-logs"],
    notifications: ["GET", "/visits/:id/notifications"],
    summary: ["GET", "/reports/summary"],
  };
  assert.deepEqual(endpoints, expected);
  for (const [name, [method, path]] of Object.entries(expected)) {
    let actual;
    const api = createApiAdapter({
      fetchImpl: async (url, options) => {
        actual = { url, method: options.method };
        return new Response(JSON.stringify({ data: [] }));
      },
      tokenStore: { get: () => null, clear() {} },
    });
    await api.call(name, "patient/7");
    assert.deepEqual(actual, {
      url: "/api/v1" + path.replace(":id", "patient%2F7"),
      method,
    });
  }
});
