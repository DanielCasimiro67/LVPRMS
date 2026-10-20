import React, { createContext, useContext, useEffect, useState } from "react";
import { createDemoAdapter } from "../services/demo-adapter.js";
import { createApiAdapter } from "../services/api-adapter.js";
import { createSessionService } from "../../js/services.js";
import { enableInventory } from "../../js/inventory.js";
const Context = createContext(null);
export function createRuntime({ mode = "demo", baseUrl = "/api/v1" } = {}) {
  const session = createSessionService({ storage: sessionStorage });
  const tokenStore = {
    get: () => sessionStorage.getItem("lvcc.api.token"),
    clear: () => sessionStorage.removeItem("lvcc.api.token"),
  };
  const api = createApiAdapter({
    baseUrl,
    tokenStore,
    onUnauthorized: () =>
      window.dispatchEvent(new Event("clinic:unauthorized")),
  });
  const adapter = createDemoAdapter({
    storage: {
      getItem: (k) => localStorage.getItem(k),
      setItem: (k, v) => {
        if (localStorage.getItem("lvcc.demo.storageFailure") === "true")
          throw Error("Storage unavailable");
        localStorage.setItem(k, v);
      },
    },
  });
  return { mode, session, api, adapter, tokenStore };
}
const empty = {
  schemaVersion: 1,
  revision: 0,
  patients: [],
  visits: [],
  messages: [],
  referrals: [],
  inventory: [],
  audit: [],
  drafts: {},
};
export function ClinicProvider({ runtime: r, children }) {
  const [data, setData] = useState(() => {
      if (r.mode === "api") return empty;
      try {
        return r.adapter.read();
      } catch {
        return empty;
      }
    }),
    [operator, setOperator] = useState(() =>
      r.mode === "demo" ? r.session.current() : null,
    ),
    [error, setError] = useState(() => {
      if (r.mode === "api") return "";
      try {
        r.adapter.read();
        return "";
      } catch (e) {
        return e.message;
      }
    }),
    [feedback, setFeedback] = useState(""),
    [expired, setExpired] = useState(false),
    [loading, setLoading] = useState(r.mode === "api" && !!r.tokenStore.get());
  const reload = async () => {
    if (r.mode === "demo") {
      setData(r.adapter.read());
      return;
    }
    setLoading(true);
    try {
      const me = await r.api.call("me");
      const u = me.data;
      if (!["nurse", "nursing_assistant"].includes(u.role))
        throw Error(
          "This workspace is for clinic nurses and nursing assistants.",
        );
      setOperator({ ...u, id: String(u.user_id), name: u.username });
      setData(await r.api.read());
      setFeedback("");
    } catch (e) {
      setFeedback(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (r.mode === "api" && r.tokenStore.get()) reload();
  }, []);
  useEffect(() => {
    if (!operator || r.mode !== "demo") return;
    try {
      const saved = r.adapter.read();
      if (saved.inventoryVersion !== 1)
        setData(
          r.adapter.commit(
            (s) => enableInventory(s, operator, new Date().toISOString()),
            saved.revision,
          ),
        );
    } catch (e) {
      setError(e.message);
    }
  }, [operator?.id]);
  useEffect(() => {
    const unauthorized = () => {
      r.tokenStore.clear();
      setExpired(true);
      setOperator(null);
      setData(empty);
      location.hash = "/session-ended";
    };
    window.addEventListener("clinic:unauthorized", unauthorized);
    const timer = setInterval(() => {
      if (r.mode === "demo" && operator && !r.session.current()) {
        setExpired(true);
        setOperator(null);
        location.hash = "/session-ended";
      }
    }, 1000);
    const activity = () => {
      if (r.mode === "demo" && operator) {
        if (!r.session.current()) {
          setExpired(true);
          setOperator(null);
          location.hash = "/session-ended";
        } else {
          try {
            r.session.touch();
          } catch (e) {
            setFeedback(e.message);
          }
        }
      }
    };
    window.addEventListener("pointerdown", activity);
    window.addEventListener("keydown", activity);
    const changed = (ev) => {
      if (ev.key === "lvcc.clinic.v1" || ev.key === null)
        setFeedback(
          "Records changed in another tab. Your entries are kept; reload before saving.",
        );
    };
    window.addEventListener("storage", changed);
    return () => {
      clearInterval(timer);
      window.removeEventListener("clinic:unauthorized", unauthorized);
      window.removeEventListener("pointerdown", activity);
      window.removeEventListener("keydown", activity);
      window.removeEventListener("storage", changed);
    };
  }, [operator]);
  function mutate(change, revision = data.revision) {
    if (r.mode !== "demo")
      throw Error("Not available yet: this API cannot persist this workflow.");
    let who;
    try {
      who = r.session.requireSession();
    } catch (e) {
      setExpired(true);
      setOperator(null);
      location.hash = "/session-ended";
      throw e;
    }
    let result;
    const next = r.adapter.commit((s) => {
      result = change(s, who, new Date().toISOString());
    }, revision);
    setData(next);
    return { state: next, result };
  }
  async function login(username, password) {
    setExpired(false);
    if (r.mode === "demo") {
      const who = await r.session.signIn(username, password);
      setOperator(who);
    } else {
      const result = await r.api.login(username, password);
      if (!["nurse", "nursing_assistant"].includes(result.data.role))
        throw Error(
          "This workspace is for clinic nurses and nursing assistants.",
        );
      sessionStorage.setItem("lvcc.api.token", result.access_token);
      await reload();
    }
  }
  async function logout() {
    setExpired(false);
    if (r.mode === "api") {
      try {
        await r.api.call("logout");
      } finally {
        r.tokenStore.clear();
        setData(empty);
        setOperator(null);
      }
    } else {
      r.session.signOut();
      setOperator(null);
    }
  }
  return (
    <Context.Provider
      value={{
        data,
        operator,
        expired,
        mode: r.mode,
        error,
        feedback,
        setFeedback,
        loading,
        reload,
        mutate,
        login,
        logout,
        runtime: r,
        changePassword: (...args) =>
          r.mode === "demo"
            ? r.session.changePassword(...args)
            : r.api.password(...args),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useClinic = () => useContext(Context);
