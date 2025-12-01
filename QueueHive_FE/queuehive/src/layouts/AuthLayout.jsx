import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css'; // Import the CSS module

const AuthLayout = () => {
  return (
    <main className={styles.authLayoutContainer}>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
