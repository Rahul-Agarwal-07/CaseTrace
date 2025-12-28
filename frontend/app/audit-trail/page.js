'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getAuditTrail } from '../../utils/api'; // call real API
import styles from '../../styles/AuditTrail.module.css';

function AuditTrailContent() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const logs = await getAuditTrail();
        // Map logs to frontend-friendly format
        const mappedLogs = logs.map((log, index) => ({
          id: index,
          action: log.action,
          userRole: log.performedByRole || 'N/A',
          timestamp: Number(log.timestamp),
          evidenceName: log.evidenceName || '—',
          caseName: log.caseName || '—',
        }));
        setAuditLogs(mappedLogs);
      } catch (err) {
        console.error('Failed to fetch audit trail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.container}>Loading audit trail...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Audit Trail</h1>
        <p className={styles.description}>
          Complete log of all actions performed in the system, including evidence uploads, accesses, and verification activities.
        </p>

        {auditLogs.length === 0 ? (
          <div className={styles.emptyMessage}>
            No audit trail entries available.
          </div>
        ) : (
          <div className={styles.cardsContainer}>
            {auditLogs.map((log) => (
              <div key={log.id} className={styles.auditCard}>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Case:</span>
                  <span className={styles.cardValue}>{log.caseName}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Evidence:</span>
                  <span className={styles.cardValue}>{log.evidenceName}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Action:</span>
                  <span className={styles.actionBadge}>{log.action}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Performed By Role:</span>
                  <span className={styles.roleBadge}>{log.userRole}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Timestamp:</span>
                  <span className={styles.cardValue}>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AuditTrail() {
  return (
    <ProtectedRoute requiredRoles={["INVESTIGATOR", "VIEWER", "JUDGE"]}>
      <AuditTrailContent />
    </ProtectedRoute>
  );
}
