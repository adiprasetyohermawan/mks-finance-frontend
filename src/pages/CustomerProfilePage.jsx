// src/pages/CustomerProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCustomerProfile } from "../api/client.js";
import "../styles/customerProfile.css";

function fmtMoney(n) {
  if (n === null || n === undefined || n === "") return "-";
  const x = Number(n);
  if (Number.isNaN(x)) return String(n);
  return x.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
}

function JsonBlock({ value }) {
  return <pre className="json">{JSON.stringify(value, null, 2)}</pre>;
}

function Tabs({ active, setActive, items }) {
  return (
    <div className="tabs">
      {items.map((t) => (
        <button
          key={t.key}
          className={active === t.key ? "tab active" : "tab"}
          onClick={() => setActive(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function CustomerProfilePage() {
  const { customerId } = useParams();

  const [data, setData] = useState(null);
  const [tab, setTab] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError("");

    getCustomerProfile(customerId, { signal: ac.signal })
      .then((json) => setData(json))
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(e?.message || String(e));
        setData(null);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [customerId]);

  const customer = data?.customer ?? null;
  const apps = Array.isArray(data?.credit_applications) ? data.credit_applications : [];
  const vehicles = Array.isArray(data?.vehicle_ownership) ? data.vehicle_ownership : [];

  const summary = useMemo(() => {
    const totalApps = apps.length;
    const approved = apps.filter((a) => a.application_status === "Approved").length;
    const pending = apps.filter((a) => a.application_status === "Pending" || a.application_status === "Under Review").length;

    const totalOutstanding = apps.reduce((acc, a) => acc + (Number(a.outstanding_amount) || 0), 0);

    return {
      totalApps,
      approved,
      pending,
      vehicles: vehicles.length,
      totalOutstanding,
    };
  }, [apps, vehicles]);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2>Customer 360</h2>
          <div className="muted">
            customer_id: <span className="mono">{customerId}</span>
          </div>
        </div>

        <Link className="btn" to="/customers">← Back</Link>
      </div>

      {error && (
        <div className="error">
          <b>Error:</b> {error}
          <div className="hint">
            Test backend:
            <pre>curl -s "http://localhost:8080/api/v1/customers/{customerId}/profile" | jq</pre>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card">Loading...</div>
      ) : !data ? (
        <div className="card">No data</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid4">
            <section className="card">
              <div className="cardTitle">Customer</div>
              <div className="bigText">{customer?.full_name ?? "-"}</div>
              <div className="muted">{customer?.city ?? "-"}, {customer?.province ?? "-"}</div>
              <div className="chips">
                <span className="chip">Segment: <b>{customer?.customer_segment ?? "-"}</b></span>
                <span className="chip">Status: <b>{customer?.status ?? "-"}</b></span>
                <span className="chip">Gender: <b>{customer?.gender ?? "-"}</b></span>
              </div>
            </section>

            <section className="card">
              <div className="cardTitle">Credit Apps</div>
              <div className="bigNumber">{summary.totalApps}</div>
              <div className="muted">Approved: <b>{summary.approved}</b> | In Review: <b>{summary.pending}</b></div>
            </section>

            <section className="card">
              <div className="cardTitle">Outstanding</div>
              <div className="bigText">{fmtMoney(summary.totalOutstanding)}</div>
              <div className="muted">Total outstanding amount across all credit applications</div>
            </section>

            <section className="card">
              <div className="cardTitle">Vehicles</div>
              <div className="bigNumber">{summary.vehicles}</div>
              <div className="muted">Vehicle ownership records</div>
            </section>
          </div>

          <div style={{ height: 12 }} />

          <section className="card">
            <Tabs
              active={tab}
              setActive={setTab}
              items={[
                { key: "summary", label: "Summary" },
                { key: "applications", label: `Credit Apps (${apps.length})` },
                { key: "vehicles", label: `Vehicles (${vehicles.length})` },
                { key: "raw", label: "Raw JSON" },
              ]}
            />

            {tab === "summary" && (
              <div className="grid2">
                <div>
                  <h3>Identity & Contact</h3>
                  <div className="kv">
                    <div className="kvRow"><div className="kvKey">NIK</div><div className="kvVal mono">{customer?.nik ?? "-"}</div></div>
                    <div className="kvRow"><div className="kvKey">DOB</div><div className="kvVal mono">{customer?.date_of_birth ?? "-"}</div></div>
                    <div className="kvRow"><div className="kvKey">Phone</div><div className="kvVal">{customer?.phone_number ?? "-"}</div></div>
                    <div className="kvRow"><div className="kvKey">Email</div><div className="kvVal">{customer?.email ?? "-"}</div></div>
                    <div className="kvRow"><div className="kvKey">Address</div><div className="kvVal">{customer?.address ?? "-"}</div></div>
                  </div>
                </div>

                <div>
                  <h3>Employment & Score</h3>
                  <div className="kv">
                    <div className="kvRow"><div className="kvKey">Occupation</div><div className="kvVal">{customer?.occupation ?? "-"}</div></div>
                    <div className="kvRow"><div className="kvKey">Employer</div><div className="kvVal">{customer?.employer_name ?? "-"}</div></div>
                    <div className="kvRow"><div className="kvKey">Monthly Income</div><div className="kvVal">{fmtMoney(customer?.monthly_income)}</div></div>
                    <div className="kvRow"><div className="kvKey">Credit Score</div><div className="kvVal mono">{customer?.credit_score ?? "-"}</div></div>
                    <div className="kvRow"><div className="kvKey">Last Updated</div><div className="kvVal mono">{customer?.last_updated ?? "-"}</div></div>
                  </div>
                </div>
              </div>
            )}

            {tab === "applications" && (
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Status</th>
                      <th>Vehicle</th>
                      <th>Loan Amount</th>
                      <th>Outstanding</th>
                      <th>Tenor</th>
                      <th>Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.length === 0 ? (
                      <tr><td colSpan={7}>No credit applications</td></tr>
                    ) : (
                      apps.map((a) => (
                        <tr key={a.application_id}>
                          <td className="mono">{a.application_id}</td>
                          <td><span className="chip">{a.application_status ?? "-"}</span></td>
                          <td>{a.vehicle_brand ?? "-"} {a.vehicle_model ?? "-"} ({a.vehicle_year ?? "-"})</td>
                          <td>{fmtMoney(a.loan_amount)}</td>
                          <td>{fmtMoney(a.outstanding_amount)}</td>
                          <td className="mono">{a.tenor_months ?? "-"}</td>
                          <td className="mono">{a.interest_rate ?? "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "vehicles" && (
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ownership ID</th>
                      <th>Type</th>
                      <th>Brand/Model</th>
                      <th>Year</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.length === 0 ? (
                      <tr><td colSpan={5}>No vehicle ownership</td></tr>
                    ) : (
                      vehicles.map((v) => (
                        <tr key={v.ownership_id ?? `${v.vehicle_type}-${v.brand}-${v.model}`}>
                          <td className="mono">{v.ownership_id ?? "-"}</td>
                          <td>{v.vehicle_type ?? "-"}</td>
                          <td>{v.brand ?? "-"} / {v.model ?? "-"}</td>
                          <td className="mono">{v.year ?? "-"}</td>
                          <td>{v.ownership_status ?? "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "raw" && <JsonBlock value={data} />}
          </section>
        </>
      )}
    </div>
  );
}