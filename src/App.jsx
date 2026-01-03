import React from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage.jsx";
import CustomerProfilePage from "./pages/CustomerProfilePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="title">Customer Profile 360 - MKS Finance</div>
          <div className="subtitle">Near Real-time Data Synchronization & Profile Access</div>
        </div>

        <nav className="nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/customers">Customers</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:customerId" element={<CustomerProfilePage />} />
        <Route path="*" element={<div>404 page not found</div>} />
      </Routes>
    </div>
  );
}