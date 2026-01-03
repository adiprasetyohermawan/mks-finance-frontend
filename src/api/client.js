const API_BASE = import.meta.env.VITE_API_BASE || "";

function toQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

async function fetchJSON(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = typeof data === "object" && data && data.error ? data.error : res.statusText;
    const err = new Error(`HTTP ${res.status} ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function getHealth() {
  return fetchJSON("/api/v1/health");
}

export function getCustomers(params = {}) {
  return fetchJSON(`/api/v1/customers${toQuery(params)}`);
}

export function getCustomerProfile(customerId) {
  return fetchJSON(`/api/v1/customers/${encodeURIComponent(customerId)}/profile`);
}

export function getKpi() {
  return fetchJSON("/api/v1/stats/kpi");
}

export function getSyncHealth() {
  return fetchJSON("/api/v1/sync/health");
}