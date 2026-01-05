// src/pages/CustomersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomers } from "../api/client.js";
import "../styles/customers.css";

function debounceValue(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function CustomersPage() {
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [segment, setSegment] = useState("");
  const [sortBy, setSortBy] = useState("last_updated");
  const [order, setOrder] = useState("desc");

  const qDebounced = debounceValue(q, 350);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ limit: 20, offset: 0, total: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canPrev = offset > 0;
  const nextOffset = useMemo(() => offset + limit, [offset, limit]);
  const prevOffset = useMemo(() => Math.max(0, offset - limit), [offset, limit]);

  useEffect(() => setOffset(0), [limit, qDebounced, status, gender, segment, sortBy, order]);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError("");

    const params = {
      limit,
      offset,
      q: qDebounced,
      status,
      gender,
      segment,
      sort_by: sortBy,
      order,
    };

    getCustomers(params, { signal: ac.signal })
      .then((json) => {
        setRows(Array.isArray(json.customers) ? json.customers : []);
        setMeta({
          limit: json.limit ?? limit,
          offset: json.offset ?? offset,
          total: json.total ?? null,
        });
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(e?.message || String(e));
        setRows([]);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [limit, offset, qDebounced, status, gender, segment, sortBy, order]);

  const showingText = useMemo(() => {
    const start = meta.offset + 1;
    const end = meta.offset + rows.length;
    if (!rows.length) return "No rows";
    if (meta.total == null) return `Showing ${start}–${end}`;
    return `Showing ${start}–${end} of ${meta.total}`;
  }, [meta.offset, meta.total, rows.length]);

  return (
    <div className="page pageWide">
      <div className="pageHeader">
        <div>
          <h2>Customers</h2>
          <div className="muted">
            Search and browse customer records, then open the 360° profile view for complete details.
          </div>
        </div>

        <div className="inline">
          <select className="select" value={limit} onChange={(e) => setLimit(Number(e.target.value))} disabled={loading}>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <button className="btn" disabled={!canPrev || loading} onClick={() => setOffset(prevOffset)}>
            Prev
          </button>
          <button className="btn" disabled={loading} onClick={() => setOffset(nextOffset)}>
            Next
          </button>
        </div>
      </div>

      <section className="card">
        <div className="filters">
          <input
            className="input"
            placeholder="Search by customer ID, name, or NIK"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select className="select" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">All Gender</option>
            <option value="L">L</option>
            <option value="P">P</option>
          </select>

          <select className="select" value={segment} onChange={(e) => setSegment(e.target.value)}>
            <option value="">All Segment</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Premium">Premium</option>
          </select>

          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="last_updated">Sort by Last Updated</option>
            <option value="registration_date">Sort by Registration Date</option>
            <option value="full_name">Sort by Full Name</option>
          </select>

          <select className="select" value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <div className="right muted">{showingText}</div>
        </div>

        {error && (
          <div className="error">
            <b>Error:</b> {error}
            <div className="hint">
              Verify:
              <pre>curl -s "http://localhost:8080/api/v1/customers?limit=1&offset=0" | jq</pre>
            </div>
          </div>
        )}

        <div className="tableWrap">
          <table className="customersTable">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>City</th>
                <th>Segment</th>
                <th>Status</th>
                <th>Last Updated (UTC)</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={8}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8}>No data</td></tr>
              ) : (
                rows.map((c) => (
                  <tr key={c.customer_id}>
                    <td className="mono">{c.customer_id}</td>
                    <td className="nameCell">{c.full_name ?? "-"}</td>
                    <td>{c.gender ?? "-"}</td>
                    <td>{c.city ?? "-"}</td>
                    <td><span className="chip">{c.customer_segment ?? "-"}</span></td>
                    <td>{c.status ?? "-"}</td>
                    <td className="mono">{c.last_updated ?? "-"}</td>
                    <td className="actionCell">
                      <Link to={`/customers/${encodeURIComponent(c.customer_id)}`} className="linkBtn">
                        View 360
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}