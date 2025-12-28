'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getRole, clearAuth } from '../utils/auth';
import { FiHome, FiFileText, FiShield } from 'react-icons/fi';
import styles from '../styles/DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState(null);

  // Load role on mount
  useEffect(() => {
    const role = getRole();
    if (!role) router.push('/login');
    else setUserRole(role);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const getRoleDisplayName = (role) =>
    role ? role.charAt(0).toUpperCase() + role.slice(1) : '';

  const isActive = (path) => pathname === path;
  const handleNavigation = (path) => router.push(path);

  // Nav items based on role
  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: userRole === 'ADMIN' ? '/admin-dashboard' : '/dashboard', roles: ['ADMIN', 'INVESTIGATOR', 'VIEWER', 'JUDGE'] },
    { name: 'Case Registration', icon: <FiFileText />, path: '/case-registration', roles: ['ADMIN'] },
    { name: 'Audit Trail', icon: <FiShield />, path: '/audit-trail', roles: ['INVESTIGATOR', 'VIEWER', 'JUDGE'] },
  ];

  if (!userRole) return null;

  return (
    <div className={styles.dashboardContainer}>
      {/* TOP NAVBAR */}
      <header className={styles.topNavbar}>
        <div className={styles.brand}>CaseTrace</div>
        <nav className={styles.nav}>
          {navItems.map(
            (item) =>
              item.roles.includes(userRole) && (
                <button
                  key={item.name}
                  className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.name}</span>
                </button>
              )
          )}
        </nav>
        <div className={styles.userMenu}>
      
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={styles.contentArea}>{children}</main>
    </div>
  );
}
