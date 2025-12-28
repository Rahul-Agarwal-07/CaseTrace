"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setRole } from "../../utils/auth";
import styles from "../../styles/LoginPage.module.css";
import { loginUser } from "../../utils/api";

export default function LoginPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  /* ================= HANDLE LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      setError("User ID and Password are required.");
      return;
    }

    try {
      const data = await loginUser(userId, password);

      if (data.success) {
        // Save token
        localStorage.setItem("token", data.sessionToken);

        // Save role
        setRole(data.role);

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  /* ================= HANDLE FORGOT PASSWORD ================= */
  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      setForgotMessage("Please enter your registered email.");
      return;
    }

    setForgotMessage(
      "If the email exists, reset instructions have been sent."
    );

    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotEmail("");
      setForgotMessage("");
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {/* LEFT PANEL */}
      <div className={styles.leftPanel}>
        <div className={styles.systemHeader}>
          <div className={styles.seal}>⚖️ CaseTrace</div>
          <h1>Judicial Evidence System</h1>
          <span className={styles.systemTag}>
            Government-Grade Digital Infrastructure
          </span>
        </div>

        <div className={styles.assuranceGrid}>
          <div className={styles.assuranceItem}>
            <h3>Evidence Integrity</h3>
            <p>
              All digital evidence is stored in an immutable format with
              cryptographic verification.
            </p>
          </div>

          <div className={styles.assuranceItem}>
            <h3>Chain of Custody</h3>
            <p>
              Every access, transfer, and review is permanently logged and
              auditable.
            </p>
          </div>

          <div className={styles.assuranceItem}>
            <h3>Role-Based Access</h3>
            <p>
              System access is strictly enforced based on judicial roles and
              authority.
            </p>
          </div>
        </div>

        <div className={styles.systemNotice}>
          Authorized access only. All actions performed in this system are
          monitored and recorded.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          {!showForgotPassword ? (
            <>
              <h2 className={styles.formTitle}>Secure Login</h2>
              <p className={styles.formSubtitle}>
                Access for authorized personnel only
              </p>

              <form onSubmit={handleSubmit}>
                {/* Login error */}
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.formGroup}>
                  <label>User ID</label>
                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>

                <div className={styles.formMeta}>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className={styles.linkButton}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Login
                </button>
              </form>

              {/* New Admin Button */}
              <div className={styles.adminRedirect}>
                <p>Want to become an Admin and create cases?</p>
                <button
                  className={styles.secondaryButton}
                  onClick={() => router.push("/create-account")}
                >
                  Create Admin Account
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.formTitle}>Password Recovery</h2>
              <p className={styles.formSubtitle}>
                Enter your registered email
              </p>

              <form onSubmit={handleForgotPassword}>
                {forgotMessage && (
                  <div
                    className={
                      forgotMessage.includes("sent")
                        ? styles.success
                        : styles.error
                    }
                  >
                    {forgotMessage}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  Send Reset Instructions
                </button>

                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
