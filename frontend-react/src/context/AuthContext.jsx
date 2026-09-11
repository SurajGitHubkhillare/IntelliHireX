import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const sanitizeRole = (email, role) => {
    if (email === 'recruiter@intellihirex.com') return 'ROLE_EMPLOYER';
    if (email === 'admin@intellihirex.com') return 'ROLE_ADMIN';
    return role;
  };

  const sanitizeFullName = (name, email, role) => {
    if (email === 'recruiter@intellihirex.com' || role === 'ROLE_EMPLOYER' || name === 'Demo Recruiter') return 'Recruiter';
    if (email === 'admin@intellihirex.com' || role === 'ROLE_ADMIN') return 'System Admin';
    if (name === 'Demo Candidate') return 'Candidate';
    return name || 'User';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    let role = localStorage.getItem('role');
    let fullName = localStorage.getItem('fullName');

    if (token) {
      role = sanitizeRole(email, role);
      fullName = sanitizeFullName(fullName, email, role);
      localStorage.setItem('role', role);
      localStorage.setItem('fullName', fullName);
      setUser({ token, email, role, fullName });
    }
  }, []);

  const login = (userData) => {
    const cleanRole = sanitizeRole(userData.email, userData.role);
    const cleanFullName = sanitizeFullName(userData.fullName, userData.email, cleanRole);
    const updatedUserData = { ...userData, role: cleanRole, fullName: cleanFullName };

    localStorage.setItem('token', updatedUserData.token);
    localStorage.setItem('email', updatedUserData.email);
    localStorage.setItem('role', cleanRole);
    localStorage.setItem('fullName', cleanFullName);
    setUser(updatedUserData);
    navigate('/');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
