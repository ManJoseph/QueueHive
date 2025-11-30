import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import styles from './BookToken.module.css';

const EmptyTokenState = ({ goToHome }) => (
  <main className={styles.mainContent}>
    <div className={styles.container}>
      <p>No token data available.</p>
      <p>Please go back to select a service.</p>
      <button className={styles.confirmButton} onClick={goToHome}>Go to Home</button>
    </div>
  </main>
);

const BookToken = ({ tokenData, goToHome, lastMessage }) => {
  const [updateNotification, setUpdateNotification] = useState('');

  useEffect(() => {
    // Check if the message is relevant to the current service and is not about our own token
    if (lastMessage && tokenData && lastMessage.serviceId === tokenData.serviceId && lastMessage.tokenNumber !== tokenData.tokenNumber) {
      setUpdateNotification(`Queue updated: Token #${lastMessage.tokenNumber} was just issued.`);
      const timer = setTimeout(() => setUpdateNotification(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastMessage, tokenData]);

  if (!tokenData) {
    return (
      <div className={styles.page}>
        <Header />
        <EmptyTokenState goToHome={goToHome} />
      </div>
    );
  }

  const { tokenNumber, serviceName, companyName, queuePosition } = tokenData;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {updateNotification && <p className={styles.notification}>{updateNotification}</p>}
          <h1 className={styles.title}>Your Token is Ready</h1>
          <div className={styles.tokenDisplay}>
            <span className={styles.tokenNumber}>{tokenNumber}</span>
          </div>
          <p className={styles.serviceInfo}>For <strong>{serviceName}</strong> at <strong>{companyName}</strong></p>
          <p className={styles.queuePosition}>
            Your position in the queue: <strong>{queuePosition + 1}</strong>
          </p>
          <button className={styles.confirmButton} onClick={goToHome}>Done</button>
        </div>
      </main>
    </div>
  );
};

export default BookToken;

