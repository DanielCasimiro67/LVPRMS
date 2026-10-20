export function createApiClient({
  baseUrl = "/api/v1",
  fetchImpl = globalThis.fetch,
  tokenStore = { get: () => null, clear() {} },
  onUnauthorized = () => {},
} = {}) {
  const base = baseUrl.replace(/\/+$/, "");
  return {
    async request(path, { body, ...options } = {}) {
      const headers = new Headers(options.headers);
      headers.set("Accept", "application/json");
      const token = tokenStore.get();
      if (token) headers.set("Authorization", "Bearer " + token);
      if (body !== undefined && !(body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(body);
      }
      const response = await fetchImpl(base + "/" + path.replace(/^\//, ""), {
        ...options,
        headers,
        body,
      });
      let data;
      try {
        data = await response.json();
      } catch {
        if (response.ok && response.status !== 204)
          throw Error("The server returned an unreadable response.");
        data = {};
      }
      if (response.status === 401) {
        tokenStore.clear();
        onUnauthorized();
      }
      if (!response.ok) {
        const error = new Error(
          data.message || "The request could not be completed.",
        );
        error.status = response.status;
        error.errors = data.errors || {};
        throw error;
      }
      return data;
    },
  };
}
