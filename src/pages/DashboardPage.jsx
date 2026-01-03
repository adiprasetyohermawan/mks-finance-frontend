// src/pages/DashboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getKpi, getSyncHealth } from "../api/client";
import "../styles/dashboard.css";

function Badge({ status }) {
  const s = (status || "").toLowerCase();
  const className =
    s === "ok"
      ? "badge badge-ok"
      : s === "warn"
      ? "badge badge-warn"
      : "badge badge-bad";
  return <span className={className}>{status || "unknown"}</span>;
}

function formatMaybeNumber(n) {
  if (n === null || n === undefined) return "-";
  if (typeof n === "number") return n.toLocaleString();
  return String(n);
}

function safeEntries(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj);
}

function KpiCard({ title, rows }) {
  return (
    <section className="card kpiCard">
      <div className="cardTitle">{title}</div>

      <div className="kpiGrid">
        {rows.map((r) => (
          <div key={r.label} className="kpiTile">
            <div className="kpiValue">{formatMaybeNumber(r.value)}</div>
            <div className="muted kpiLabel">{r.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function KeyValueList({ title, data }) {
  const items = safeEntries(data);

  const sorted = useMemo(() => {
    return items.sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));
  }, [items]);

  return (
    <section className="card">
      <div className="cardTitle">{title}</div>

      {sorted.length === 0 ? (
        <div className="muted mt8">No data</div>
      ) : (
        <div className="kvList">
          {sorted.map(([k, v]) => (
            <div key={k} className="kvItem">
              <div className="kvKey">{k}</div>
              <div className="kvVal">{formatMaybeNumber(v)}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function DashboardPage() {
  const [kpi, setKpi] = useState(null);
  const [sync, setSync] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const [k, s] = await Promise.all([
          getKpi({ signal: ac.signal }),
          getSyncHealth({ signal: ac.signal }),
        ]);
        setKpi(k);
        setSync(s);
      } catch (e) {
        setErr(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, []);

  const syncBanner = useMemo(() => {
    if (!sync) return null;

    return (
      <section className="banner syncSection">
        <div className="syncHeader">
          <div>
            <div className="syncTitleRow">
              <div className="bannerTitle">Sync Health</div>
              <Badge status={sync.status} />
            </div>
            <div className="muted">
              POC evidence (SLA target ≤ {formatMaybeNumber(sync.sla_target_seconds)}s)
            </div>
          </div>
        </div>

        <div className="syncGrid">
          <div className="syncMetric">
            <div className="syncMetricLabel">SLA target (seconds)</div>
            <div className="syncMetricValue">{formatMaybeNumber(sync.sla_target_seconds)}</div>
          </div>

          <div className="syncMetric">
            <div className="syncMetricLabel">Current lag (seconds)</div>
            <div className="syncMetricValue">{formatMaybeNumber(sync.lag_seconds)}</div>
          </div>

          <div className="syncMetric">
            <div className="syncMetricLabel">Last success</div>
            <div className="syncMetricValue">
              {sync.last_success_at ? new Date(sync.last_success_at).toLocaleString() : "-"}
            </div>
          </div>

          <div className="syncMetric">
            <div className="syncMetricLabel">Last error</div>
            <div className="syncMetricValue">{sync.last_error || "-"}</div>
          </div>
        </div>
      </section>
    );
  }, [sync]);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2>Dashboard</h2>
          <div className="muted">Key metrics and data synchronization status</div>
        </div>
      </div>

      {syncBanner}

      {loading && <div className="card">Loading dashboard…</div>}

      {!loading && err && (
        <div className="card cardError">
          <div className="cardTitle">Dashboard error</div>
          <pre className="json">{err}</pre>
          <div className="muted mt8">
            Also check the browser DevTools Console for the stack trace.
          </div>
        </div>
      )}

      {!loading && !err && kpi && (
        <>
          <div className="grid3">
            <KpiCard
              title="Customers"
              rows={[
                { label: "Total", value: kpi.customers?.total },
                { label: "Active", value: kpi.customers?.active },
              ]}
            />
            <KpiCard
              title="Credit Applications"
              rows={[{ label: "Total", value: kpi.credit_applications?.total }]}
            />
            <KpiCard
              title="Vehicle Ownership"
              rows={[{ label: "Total", value: kpi.vehicle_ownership?.total }]}
            />
          </div>

          <div className="spacer16" />

          <div className="grid2">
            <KeyValueList title="Customers by Segment" data={kpi.customers?.by_segment} />
            <KeyValueList
              title="Credit Applications by Status"
              data={kpi.credit_applications?.by_status}
            />
          </div>
        </>
      )}
    </div>
  );
}