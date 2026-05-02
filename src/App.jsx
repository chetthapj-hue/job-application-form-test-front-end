import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Applicants from './pages/Applicants';
import ApplicantDetails from './pages/ApplicantDetails';
import Apply from './pages/public/Apply';
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
