"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { hasRole } from "../../utils/auth";
import { addCase } from "../../utils/api";
import styles from "../../styles/CaseRegistration.module.css";

function CaseRegistrationContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ caseName: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState(null); // store generated users
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || !formData.caseName || !formData.caseName.trim()) {
    return alert("Please enter a case name");
  }

    setIsSubmitting(true);

    try {
      const data = await addCase(formData);

      if (data.success) {
        setCredentials(data.users);
        setShowCredentials(true);
        setFormData({ caseName: "", description: "" });
      } else {
        alert(data.message || "Case creation failed");
      }
    } catch (err) {
      alert(err.message || "Case creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const copyToClipboard = () => {
    const text = credentials
      .map((u) => `${u.role}: ${u.userId} / Password: ${u.password}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert("Credentials copied to clipboard!");
  };

  const downloadCredentials = () => {
    const text =
      `Case ID: ${credentials[0]?.userId.split("-")[1]}\n\n` +
      credentials
        .map((u) => `${u.role}: ${u.userId} / Password: ${u.password}`)
        .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `case_credentials_${credentials[0]?.userId.split("-")[1]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Case Registration</h1>
        <div className={styles.formCard}>
          <p className={styles.description}>
            Register a new case securely in the system. All information is
            stored with full integrity and traceability.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Case Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="caseName"
                className={styles.input}
                value={formData.caseName}
                onChange={handleChange}
                placeholder="Enter case name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Case Description
              </label>
              <textarea
                id="description"
                name="description"
                className={styles.textarea}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter case description (optional)"
                rows={6}
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Case"}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setFormData({ name: "", description: "" })}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Credentials Card Section */}
        {showCredentials && credentials && (
          <div className={styles.credentialsOverlay}>
            <div className={styles.credentialsCard}>
              {/* Warning note */}
              <p className={styles.credentialsNote}>
                ⚠️ Please copy or download these credentials now. They will not
                be shown again!
              </p>

              <h2>Generated User Credentials</h2>
              <ul>
                {credentials.map((u) => (
                  <li key={u.userId}>
                    <span>
                      <strong>{u.role}:</strong> {u.userId}
                    </span>
                    <span>
                      <strong>Password:</strong> {u.password}
                    </span>
                  </li>
                ))}
              </ul>
              <div className={styles.credentialsActions}>
                <button onClick={copyToClipboard}>Copy</button>
                <button onClick={downloadCredentials}>Download</button>
                <button onClick={() => setShowCredentials(false)}>Hide</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function CaseRegistration() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <CaseRegistrationContent />
    </ProtectedRoute>
  );
}
