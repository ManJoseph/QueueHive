import React from 'react';
import Header from '../components/Header';
import styles from './CompanyDetails.module.css';

const CompanyDetails = () => {
  // This page will eventually fetch and display details for a specific company
  // based on a route parameter (e.g., /company/:id)

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <h1 className={styles.companyName}>Company Name</h1>
        <p className={styles.companyCategory}>Company Category</p>
        <hr className={styles.divider} />
        <h2>Services</h2>
        <div className={styles.serviceList}>
          {/* Service items will be listed here */}
          <div className={styles.serviceItem}>Placeholder Service 1</div>
          <div className={styles.serviceItem}>Placeholder Service 2</div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDetails;
