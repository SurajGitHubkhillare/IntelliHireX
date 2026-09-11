import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FakeJobDetector from './pages/FakeJobDetector';
import AtsChecker from './pages/AtsChecker';
import JobBoard from './pages/JobBoard';
import Applications from './pages/Applications';
import EmployerApplicants from './pages/EmployerApplicants';
import PostJob from './pages/PostJob';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'ROLE_ADMIN' && user.role !== 'ROLE_EMPLOYER') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fake-job-detector" 
            element={
              <ProtectedRoute>
                <FakeJobDetector />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ats-checker" 
            element={
              <ProtectedRoute>
                <AtsChecker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <JobBoard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/applicants" 
            element={
              <AdminRoute>
                <EmployerApplicants />
              </AdminRoute>
            } 
          />
          <Route 
            path="/post-job" 
            element={
              <AdminRoute>
                <PostJob />
              </AdminRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
