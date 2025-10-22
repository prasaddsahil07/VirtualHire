import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthRoute;
