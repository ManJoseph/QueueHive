import React from 'react';
import Header from '../components/Header';
import styles from './BookToken.module.css';

const BookToken = ({ tokenData, goToHome }) => {
  if (!tokenData) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <p>No token data available. Please go back to select a service.</p>
            <button className={styles.confirmButton} onClick={goToHome}>Go to Home</button>
          </div>
        </main>
      </div>
    );
  }

  const { tokenNumber, serviceName, companyName, queuePosition } = tokenData;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Your Token</h1>
          <div className={styles.tokenDisplay}>
            <span className={styles.tokenNumber}>{tokenNumber}</span>
          </div>
          <p className={styles.serviceInfo}>For "{serviceName}" at "{companyName}"</p>
          <p className={styles.queuePosition}>You are number {queuePosition} in the queue.</p>
          <button className={styles.confirmButton} onClick={goToHome}>Done</button>
        </div>
      </main>
    </div>
  );
};

export default BookToken;
