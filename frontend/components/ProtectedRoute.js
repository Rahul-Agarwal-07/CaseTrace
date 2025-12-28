'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '../utils/auth';

export default function ProtectedRoute({ children, requiredRoles }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = getRole();

    // 1️⃣ Not logged in
    if (!userRole) {
      router.push('/login');
      return;
    }

    // 2️⃣ Role-based access check
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      // Redirect unauthorized user to their dashboard
      if (userRole === 'ADMIN') router.push('/admin-dashboard');
      else router.push('/dashboard');
      return;
    }

    // 3️⃣ Authorized
    setRole(userRole);
    setIsLoading(false);
  }, [router, requiredRoles]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        Loading...
      </div>
    );
  }

  return children;
}
