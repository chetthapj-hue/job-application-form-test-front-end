import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Departments = lazy(() => import('./pages/Departments'));
const Applicants = lazy(() => import('./pages/Applicants'));
const ApplicantDetails = lazy(() => import('./pages/ApplicantDetails'));
const Apply = lazy(() => import('./pages/public/Apply'));
const Login = lazy(() => import('./pages/admin/Login'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Apply />} />
          <Route path="/apply" element={<Apply />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="departments" element={<Departments />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="applicant/:id" element={<ApplicantDetails />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
