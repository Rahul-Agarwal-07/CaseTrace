// frontend-only authentication utilities

export const getRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  return null;
};

export const setRole = (role) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', role);
  }
};

export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const getUsers = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  return [];
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};

export const isAuthenticated = () => getRole() !== null;

export const hasRole = (requiredRole) => getRole() === requiredRole;

export const canAccessRoute = (route) => {
  const role = getRole();
  if (!role) return false;

  if (route === '/case-registration') return role === 'admin';
  return ['INVESTIGATOR', 'VIEWER', 'JUDGE', 'admin'].includes(role);
};
