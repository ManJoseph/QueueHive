import React, { useEffect, useState } from 'react';
import tokenService from '../api/tokenService'; // Corrected path
import Loader from './Loader'; // Adjust path as needed
import styles from './MyQueues.module.css'; // Create this CSS module

const MyQueues = () => {
  const [activeTokens, setActiveTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  useEffect(() => {
    if (!userId) {
      setError('User not logged in or userId not found.');
      setIsLoading(false);
      return;
    }

    const fetchActiveTokens = async () => {
      try {
        setIsLoading(true);
        const response = await tokenService.getTokensByUserId(userId);
        setActiveTokens(response.data); // Assuming response.data is an array of tokens
      } catch (err) {
        setError(err.message || 'Failed to fetch active queues.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveTokens();
  }, [userId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (activeTokens.length === 0) {
    return <div className={styles.emptyState}>You have no active queues.</div>;
  }

  return (
    <div className={styles.myQueuesContainer}>
      <h2 className={styles.title}>My Active Queues</h2>
      {activeTokens.map((token) => (
        <div key={token.id} className={styles.queueItem}>
          <p className={styles.companyName}>Company ID: {token.serviceType.company.id}</p> {/* Assuming serviceType has company object */}
          <p className={styles.serviceName}>Service: {token.serviceType.name}</p>
          <p className={styles.tokenNumber}>Your Token Number: {token.tokenNumber}</p>
          <p className={styles.status}>Status: {token.status}</p>
          {/* Add more token details as needed */}
        </div>
      ))}
    </div>
  );
};

export default MyQueues;
