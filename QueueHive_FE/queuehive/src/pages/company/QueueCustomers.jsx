import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get serviceId from URL
import companyAdminService from '../../api/companyAdminService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import styles from './QueueCustomers.module.css'; // Create this CSS module

const QueueCustomers = () => {
  const { serviceId } = useParams(); // Get serviceId from URL
  const [activeTokens, setActiveTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId) {
      setError('Service ID not found in URL.');
      setIsLoading(false);
      return;
    }
    fetchActiveTokens();
  }, [serviceId]);

  const fetchActiveTokens = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await companyAdminService.getActiveQueueCustomers(serviceId);
      setActiveTokens(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch active queue customers.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTokenStatus = async (tokenId, status) => {
    if (!window.confirm(`Are you sure you want to set token ${tokenId} status to ${status}?`)) {
      return;
    }
    try {
      setIsLoading(true);
      await companyAdminService.updateCustomerTokenStatus(tokenId, status);
      await fetchActiveTokens(); // Refresh the list
      alert(`Token ${tokenId} status updated to ${status}!`);
    } catch (err) {
      setError(err.message || `Failed to update token ${tokenId} status.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.queueCustomersContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Queue for Service ID: {serviceId}</h1>
      </header>

      {activeTokens.length === 0 ? (
        <EmptyState message="No customers currently in this queue." />
      ) : (
        <div className={styles.customerList}>
          {activeTokens.map(token => (
            <div key={token.id} className={styles.customerItem}>
              <p><strong>Token:</strong> {token.tokenNumber}</p>
              <p><strong>User ID:</strong> {token.userId}</p> {/* Assuming userId is in TokenDto */}
              <p><strong>Status:</strong> {token.status}</p>
              <p><strong>Time:</strong> {new Date(token.createdAt).toLocaleTimeString()}</p>
              <div className={styles.actions}>
                <button 
                  className={styles.callButton}
                  onClick={() => handleUpdateTokenStatus(token.id, 'CALLING')}
                  disabled={token.status === 'CALLING'}
                >
                  Call Next
                </button>
                <button 
                  className={styles.serveButton}
                  onClick={() => handleUpdateTokenStatus(token.id, 'SERVED')}
                  disabled={token.status === 'SERVED'}
                >
                  Mark Served
                </button>
                <button 
                  className={styles.rejectButton}
                  onClick={() => handleUpdateTokenStatus(token.id, 'REJECTED')}
                  disabled={token.status === 'REJECTED'}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueueCustomers;
