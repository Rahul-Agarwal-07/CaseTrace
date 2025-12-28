"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getRole } from "../../utils/auth";
import { getCases, getEvidence, getAuditTrail } from "../../utils/data";
import styles from "../../styles/AdminDashboard.module.css";

function AdminDashboardContent() {
  const [userRole, setUserRole] = useState(null);
  const [cases, setCases] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);

  useEffect(() => {
    const role = "admin"; // for now, hardcode admin
    setUserRole(role);
    setCases(getCases().filter((c) => c.createdBy === role));
    setEvidence(getEvidence());
    setAuditTrail(getAuditTrail());
  }, []);

  if (!userRole) return null;

  return (
    <DashboardLayout>
      <div className={styles.dashboard}>
        {/* HEADER */}
        <header className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.pageTitle}>Admin Dashboard</h1>
            <p className={styles.pageSubtitle}>
              Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </p>
          </div>
        </header>

        {/* STATS GRID */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span>Total Cases</span>
            <strong>{cases.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Total Evidence</span>
            <strong>{evidence.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Verified Evidence</span>
            <strong>{evidence.filter((e) => e.verified).length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Audit Logs</span>
            <strong>{auditTrail.length}</strong>
          </div>
        </div>

        {/* CASE LIST */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>My Cases</h2>
          {cases.length === 0 ? (
            <p className={styles.emptyMessage}>No cases created yet.</p>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Case Name</th>
                    <th>Description</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.description || "—"}</td>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* AUDIT TRAIL */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Audit Trail</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Evidence</th>
                  <th>Action</th>
                  <th>Role</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {auditTrail.slice(0, 10).map((log) => (
                  <tr key={log.id}>
                    <td>{log.caseName}</td>
                    <td>{log.evidenceName}</td>
                    <td>{log.action}</td>
                    <td>{log.userRole}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
