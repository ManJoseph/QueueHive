import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader'; // Optional: for a better UX

const RoleProtectedRoute = ({ requiredRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    // Show a loader while authentication state is being determined
    return <Loader />;
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    // User does not have the required role, redirect to an appropriate page
    // (e.g., unauthorized page or back to their own dashboard)
    // For now, redirecting to login is a safe fallback.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
