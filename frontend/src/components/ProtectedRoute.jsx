import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isProfileComplete } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if profile is complete for candidates and interviewers
  if ((user?.role === 'candidate' || user?.role === 'recruiter') && !isProfileComplete()) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
