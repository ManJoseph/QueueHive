import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RoleProtectedRoute = ({ requiredRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role; // Assuming 'role' is a claim in the JWT

    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      // User does not have the required role, redirect to an appropriate page (e.g., unauthorized or login)
      // For now, let's redirect to login, but a dedicated unauthorized page would be better.
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    // Token is invalid, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
