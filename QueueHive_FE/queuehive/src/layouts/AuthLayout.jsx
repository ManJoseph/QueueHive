import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './AuthLayout.module.css'; // Import the CSS module

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';

  return (
    <div className={styles.authLayoutWrapper}>
      <header className={styles.authHeader}>
        <div className={styles.headerContent}>
          {(!isHomePage && !isLoginPage && !isSignupPage) && (
            <button onClick={handleBack} className={styles.backButton}>← Back</button>
          )}
          <h1 className={styles.appName}>QueueHive</h1>
        </div>
      </header>
      <main className={styles.authLayoutContainer}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
