import { createApiClient } from "./api-client.js";
import { mapPatient, mapVisit, endpoints } from "./api-contracts.js";
export function createApiAdapter(options) {
  const client = createApiClient(options),
    request = client.request;
  const id = encodeURIComponent;
  const call = (name, value, body) => {
    const [method, path] = endpoints[name];
    return request(path.replace(":id", id(value ?? "")), { method, body });
  };
  return {
    ...client,
    call,
    async read() {
      let patients = [],
        page = 1;
      while (true) {
        const r = await request("/patients?page=" + page);
        patients.push(...r.data.data.map(mapPatient));
        if (!r.data.next_page_url) break;
        page++;
      }
      const [active, discharged, referred, inventory] = await Promise.all(
        ["active", "discharged", "referred"]
          .map((status) => request("/visits?status=" + status))
          .concat(request("/inventory-items")),
      );
      return {
        schemaVersion: 1,
        revision: 0,
        patients,
        visits: [...active.data, ...discharged.data, ...referred.data].map(
          mapVisit,
        ),
        inventory: inventory.data.map((i) => ({
          id: String(i.item_id),
          name: i.item_name,
          quantity: Number(i.stock_quantity),
          unit: i.unit,
          step: 1,
          lowAt: 10,
        })),
        drafts: {},
        messages: [],
        referrals: [],
        audit: [],
        inventoryVersion: 1,
      };
    },
    async login(email, password) {
      return request("/login", { method: "POST", body: { email, password } });
    },
    async password(current, next, confirmation) {
      return call("password", null, {
        current_password: current,
        new_password: next,
        new_password_confirmation: confirmation,
      });
    },
    lookup: (identifier) =>
      request("/patients/lookup?" + new URLSearchParams({ identifier })),
    async visitDetails(visitId) {
      const response = await call("supplies", visitId);
      return {
        supplies: response.data.map((row) => ({
          itemId: String(row.item_id),
          name: row.inventory_item?.item_name || "Item details unavailable",
          unit: row.inventory_item?.unit || "",
          quantity: Number(row.quantity_used),
        })),
      };
    },
  };
}
