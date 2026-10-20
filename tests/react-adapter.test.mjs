import test from "node:test";
import assert from "node:assert/strict";
import { createDemoAdapter } from "../src/services/demo-adapter.js";
test("React demo adapter preserves revision rejection and atomic failed saves", () => {
  let value = null,
    fail = false;
  const a = createDemoAdapter({
    storage: {
      getItem: () => value,
      setItem: (_, v) => {
        if (fail) throw Error();
        value = v;
      },
    },
  });
  a.commit(() => {}, 0);
  assert.throws(() => a.commit(() => {}, 0), { code: "STALE_REVISION" });
  const before = a.read();
  fail = true;
  assert.throws(() => a.commit((s) => s.patients.pop(), before.revision), {
    code: "SAVE_FAILED",
  });
  assert.deepEqual(a.read(), before);
});
