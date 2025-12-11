import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../context/AuthContext'; // Adjust path
import Loader from './Loader'; // Adjust path for Loader component

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null, // Decoded JWT payload + fullName
    role: null,
    userId: null,
    companyId: null, // For COMPANY_ADMIN
    isAuthenticated: false,
    isLoading: true, // To indicate initial loading of auth state
  });

  useEffect(() => {
    // On initial load, try to retrieve auth state from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');
    const storedCompanyId = localStorage.getItem('companyId');
    const storedFullName = localStorage.getItem('fullName');

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired, clear localStorage
          localStorage.clear();
          setAuthState({
            token: null,
            user: null,
            role: null,
            userId: null,
            companyId: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } else {
          setAuthState({
            token: storedToken,
            user: { ...decodedToken, fullName: storedFullName },
            role: storedUserRole,
            userId: storedUserId,
            companyId: storedCompanyId,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error decoding token from localStorage:", error);
        localStorage.clear();
        setAuthState({
          token: null,
          user: null,
          role: null,
          userId: null,
          companyId: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({ ...authState, isLoading: false });
    }
  }, []);

  const login = (token, role, userId, companyId = null, fullName = null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId);
    if (fullName) {
      localStorage.setItem('fullName', fullName);
    }
    if (companyId) {
      localStorage.setItem('companyId', companyId);
    } else {
      localStorage.removeItem('companyId'); // Ensure it's clear if not a company admin
    }

    const decodedToken = jwtDecode(token);
    setAuthState({
      token,
      user: { ...decodedToken, fullName },
      role,
      userId,
      companyId,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({
      token: null,
      user: null,
      role: null,
      userId: null,
      companyId: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateAuthUser = (updatedFields) => {
    setAuthState(prev => {
        const newUser = { ...prev.user, ...updatedFields };
        if (updatedFields.fullName) {
            localStorage.setItem('fullName', updatedFields.fullName);
        }
        if (updatedFields.phone) {
            localStorage.setItem('phone', updatedFields.phone); // Assuming 'phone' is the key in localStorage
        }
        return {
            ...prev,
            user: newUser
        };
    });
  };

  // The value that will be supplied to any descendants of this AuthProvider
  const authContextValue = {
    ...authState,
    login,
    logout,
    updateAuthUser,
  };

  if (authState.isLoading) {
    return <div><Loader /></div>; // Or a simple loading spinner
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
