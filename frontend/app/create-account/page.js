"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setRole, setUser, getUsers } from "../../utils/auth";
import styles from "../../styles/CreateAccount.module.css";
import { createAdmin } from "../../utils/api";

export default function CreateAccount() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await createAdmin(name, email, password);

      if (data.success) {
        alert(`Account created successfully! Your User ID is ${data.userId}`);

        // Save role and user locally if needed
        setRole(data.role);
        setUser({ name, email, userId: data.userId, role: data.role });

        // Redirect to admin dashboard
        router.push("/admin-dashboard");
      } else {
        setError(data.message || "Account creation failed");
      }
    } catch (err) {
      setError(err.message || "Account creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Create Admin Account</h1>
        <p className={styles.subtitle}>
          Register as an Admin. You can create cases after logging in.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
