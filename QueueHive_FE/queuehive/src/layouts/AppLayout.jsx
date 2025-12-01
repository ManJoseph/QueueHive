import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar'; // Import NavBar
import styles from './AppLayout.module.css'; // Import the CSS module

const AppLayout = () => {
  return (
    <div className={styles.appLayoutContainer}>
      <NavBar />
      <main className={styles.appContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
