// import Link from 'next/link';
// import styles from '../styles/LandingPage.module.css';

// export default function LandingPage() {
//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         <h1 className={styles.title}>Digital Evidence Management System</h1>
//         <p className={styles.description}>
//           A comprehensive platform for secure storage, management, and tracking of digital evidence
//           with complete audit trail capabilities. Designed for law enforcement agencies, legal
//           professionals, and judicial systems to ensure integrity and accountability in evidence handling.
//         </p>
//         <div className={styles.features}>
//           <h2 className={styles.featuresTitle}>Key Features</h2>
//           <ul className={styles.featureList}>
//             <li className={styles.featureItem}>
//               <strong>Secure Evidence Storage</strong>
//               <span>Centralized repository for digital evidence with secure access controls</span>
//             </li>
//             <li className={styles.featureItem}>
//               <strong>Role-Based Access Control</strong>
//               <span>Granular permissions system for investigators, viewers, and judges</span>
//             </li>
//             <li className={styles.featureItem}>
//               <strong>Complete Audit Trail</strong>
//               <span>Comprehensive logging of all actions and access for full accountability</span>
//             </li>
//           </ul>
//         </div>
//         <div className={styles.actions}>
//           <Link href="/login" className={styles.loginButton}>
//             Login to System
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import styles from "../styles/LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.productName}>CaseTrace</span>

            <h1 className={styles.heroTitle}>
              Digital Evidence Management
              <br />
              Built for the Justice System
            </h1>

            <p className={styles.heroSubtitle}>
              A secure, auditable, and tamper-resistant platform for managing
              digital evidence with complete chain-of-custody and judicial-grade
              access control.
            </p>

            <div className={styles.heroActions}>
              <Link href="/login" className={styles.primaryButton}>
                Access System
              </Link>
              <Link href="/about" className={styles.secondaryButton}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className={styles.valueSection}>
        <h2 className={styles.sectionTitle}>
          Built for Accountability, Transparency, and Trust
        </h2>
        <p className={styles.sectionDescription}>
          Every piece of evidence is protected, traceable, and verifiable —
          ensuring its admissibility and integrity throughout the legal process.
        </p>
      </section>

      {/* FEATURES GRID */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>Immutable Evidence Storage</h3>
            <p>
              Digital evidence is securely stored with cryptographic integrity,
              preventing unauthorized modification or tampering.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Role-Based Access Control</h3>
            <p>
              Controlled access for investigators, viewers, and judicial
              authorities with strict permission enforcement.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Complete Audit Trail</h3>
            <p>
              Every action — upload, access, review, or transfer — is
              permanently logged for full accountability.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Chain of Custody Tracking</h3>
            <p>
              Maintains a transparent and verifiable history of evidence
              handling across its entire lifecycle.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Judicial-Grade Security</h3>
            <p>
              Designed to meet the strict security and compliance requirements
              of courts and legal institutions.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Scalable Case Management</h3>
            <p>
              Efficiently manage multiple cases, users, and evidence types
              across institutions and jurisdictions.
            </p>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className={styles.trustSection}>
        <h2 className={styles.sectionTitle}>Designed for Legal Institutions</h2>
        <p className={styles.sectionDescription}>
          This system follows best practices for digital forensics, legal
          compliance, and evidence admissibility — ensuring confidence at every
          level of the justice system.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className={styles.ctaSection}>
        <h2>Access the Evidence System</h2>
        <p>
          Authorized personnel can securely log in to manage and review
          evidence.
        </p>
        <Link href="/login" className={styles.primaryButton}>
          Login to System
        </Link>
      </section>
    </div>
  );
}
