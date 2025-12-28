"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getRole } from "../../utils/auth";
import {
  uploadEvidence,
  accessEvidence,
  verifyEvidence,
  getEvidenceCount,
  getAuditTrail,
} from "../../utils/api";
import styles from "../../styles/Dashboard.module.css";

function DashboardContent() {
  const [userRole, setUserRole] = useState(null);

  const [evidenceCount, setEvidenceCount] = useState(0);

  const [auditTrail, setAuditTrail] = useState([]);        // last 5 logs
  const [totalAuditCount, setTotalAuditCount] = useState(0); // ALL logs count

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentEvidence, setCurrentEvidence] = useState(null);

  const [verifiedMap, setVerifiedMap] = useState({});
  const [loadingEvidenceIndex, setLoadingEvidenceIndex] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  /* =========================
     HELPERS
  ========================= */
  const refreshAuditTrail = async () => {
    const auditRes = await getAuditTrail();

    // total logs count
    setTotalAuditCount(auditRes.length);

    // only 5 most recent
    const recent = auditRes
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    setAuditTrail(recent);
  };

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    const init = async () => {
      try {
        setGlobalLoading(true);

        setUserRole(getRole());

        const countRes = await getEvidenceCount();
        setEvidenceCount(countRes.count);

        await refreshAuditTrail();
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setGlobalLoading(false);
      }
    };

    init();
  }, []);

  /* =========================
     UPLOAD
  ========================= */
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Select a file");

    try {
      setGlobalLoading(true);

      await uploadEvidence(selectedFile);

      setSelectedFile(null);
      setShowUploadForm(false);

      const countRes = await getEvidenceCount();
      setEvidenceCount(countRes.count);

      await refreshAuditTrail();
    } catch {
      alert("Upload failed");
    } finally {
      setGlobalLoading(false);
    }
  };

  /* =========================
     VIEW EVIDENCE
  ========================= */
  const handleViewEvidence = async (index) => {
    setLoadingEvidenceIndex(index);
    setGlobalLoading(true);

    try {
      const res = await accessEvidence(index);

      setCurrentEvidence({
        index,
        cid: res.cid,
        fileHash: res.fileHash,
        verified: verifiedMap[index] ?? res.verified,
        timestamp: res.timestamp,
        ipfsUrl: res.ipfsUrl,
      });
    } catch {
      alert("Access failed");
    } finally {
      setLoadingEvidenceIndex(null);
      setGlobalLoading(false);
    }
  };

  /* =========================
     VERIFY (JUDGE)
  ========================= */
  const handleVerifyEvidence = async (index) => {
    try {
      setGlobalLoading(true);

      await verifyEvidence(index);

      setVerifiedMap((prev) => ({ ...prev, [index]: true }));

      setCurrentEvidence((prev) =>
        prev && prev.index === index ? { ...prev, verified: true } : prev
      );

      await refreshAuditTrail();

      alert(`Evidence #${index + 1} verified`);
    } catch {
      alert("Verification failed");
    } finally {
      setGlobalLoading(false);
    }
  };

  if (!userRole) return null;

  return (
    <DashboardLayout>
      <div className={styles.dashboard}>
        {/* HEADER */}
        <header className={styles.dashboardHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Role: {userRole}</p>
        </header>

        {/* STATS */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span>Total Evidence</span>
            <strong>{evidenceCount}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Total Audit Logs</span>
            <strong>{totalAuditCount}</strong>
          </div>
        </div>

        {/* INVESTIGATOR */}
        {userRole === "INVESTIGATOR" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Upload Evidence</h2>

            {!showUploadForm ? (
              <button
                className={styles.primaryButton}
                onClick={() => setShowUploadForm(true)}
              >
                Upload New Evidence
              </button>
            ) : (
              <form className={styles.form} onSubmit={handleUploadSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Select File</label>
                  <input
                    type="file"
                    className={styles.input}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required
                  />
                </div>

                <div className={styles.formActions}>
                  <button className={styles.primaryButton} type="submit">
                    Upload
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setShowUploadForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {/* EVIDENCE REVIEW */}
        {(userRole === "VIEWER" || userRole === "JUDGE") && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Evidence Review</h2>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Evidence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: evidenceCount }).map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      Evidence #{idx + 1}{" "}
                      {verifiedMap[idx] && (
                        <span className={styles.verifiedText}>✔ Verified</span>
                      )}
                    </td>

                    <td className={styles.actionCell}>
                      <button
                        className={styles.primaryButton}
                        onClick={() => handleViewEvidence(idx)}
                        disabled={loadingEvidenceIndex === idx}
                      >
                        {loadingEvidenceIndex === idx ? "Viewing..." : "View"}
                      </button>

                      {userRole === "JUDGE" && (
                        <button
                          className={styles.verifyButton}
                          disabled={verifiedMap[idx]}
                          onClick={() => handleVerifyEvidence(idx)}
                        >
                          {verifiedMap[idx] ? "Verified" : "Verify"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* AUDIT TRAIL */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Audit Trail</h2>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Action</th>
                <th>Performed By</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {auditTrail.map((log, i) => (
                <tr key={i}>
                  <td>{log.action}</td>
                  <td>{log.performedBy}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* MODAL */}
        {currentEvidence && (
          <div
            className={styles.modalOverlay}
            onClick={() => setCurrentEvidence(null)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Evidence #{currentEvidence.index + 1}</h3>
              <p><strong>CID:</strong> {currentEvidence.cid}</p>
              <p><strong>File Hash:</strong> {currentEvidence.fileHash}</p>
              <p><strong>Verified:</strong> {currentEvidence.verified ? "Yes" : "No"}</p>
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(currentEvidence.timestamp).toLocaleString()}
              </p>

              <div className={styles.modalButtons}>
                <button
                  className={styles.primaryButton}
                  onClick={() => window.open(currentEvidence.ipfsUrl, "_blank")}
                >
                  Open IPFS
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={() => setCurrentEvidence(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GLOBAL LOADER */}
        {globalLoading && (
          <div className={styles.globalLoader}>
            <div className={styles.spinnerLarge}></div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRoles={["INVESTIGATOR", "VIEWER", "JUDGE"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
