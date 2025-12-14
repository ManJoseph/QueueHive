import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import companyAdminService from '../../api/companyAdminService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useConfirmModal } from '../../components/confirmModal/useConfirmModal';
import { useToast } from '../../components/toast/useToast';
import websocketService from '../../api/websocketService'; // Import websocketService
import styles from './QueueCustomers.module.css';

const QueueCustomers = () => {
  const { serviceId } = useParams();
  const [activeTokens, setActiveTokens] = useState([]);
  const [nowServing, setNowServing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { confirm } = useConfirmModal();
  const { showToast } = useToast();

  const fetchActiveTokens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await companyAdminService.getActiveQueueCustomers(serviceId);
      const tokens = response.data;
      setNowServing(tokens.find(t => t.status === 'CALLING' || t.status === 'SERVING'));
      setActiveTokens(tokens.filter(t => t.status === 'PENDING' || t.status === 'CALLING')); // Filter for PENDING or CALLING
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch active queue customers.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [serviceId, showToast]);

  useEffect(() => {
    if (!serviceId) {
      setError('Service ID not found in URL.');
      setIsLoading(false);
      return;
    }

    fetchActiveTokens();

    // WebSocket connection for real-time updates
    const stompClient = websocketService.connect(() => {
      stompClient.subscribe(`/topic/tokenUpdates/${serviceId}`, (message) => {
        const updatedToken = JSON.parse(message.body);
        // A more sophisticated update would integrate this into the existing state
        // For simplicity, re-fetching all active tokens
        fetchActiveTokens(); 
        showToast(`Token ${updatedToken.tokenNumber} updated!`, 'info', 2000);
      });
    });

    return () => {
      websocketService.disconnect(stompClient);
    };
  }, [serviceId, fetchActiveTokens, showToast]);

  const handleCallNext = async () => {
    const isConfirmed = await confirm(
      'Call Next Token',
      'Are you sure you want to call the next token in the queue?'
    );
    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      const response = await companyAdminService.callNextToken(serviceId);
      showToast(`Token ${response.data.tokenNumber} called!`, 'success');
      fetchActiveTokens();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to call next token.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkServed = async (tokenId, tokenNumber) => {
    const isConfirmed = await confirm(
      'Mark Token Served',
      `Are you sure you want to mark token ${tokenNumber} as served?`
    );
    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await companyAdminService.markTokenServed(tokenId);
      showToast(`Token ${tokenNumber} marked as served!`, 'success');
      fetchActiveTokens();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to mark token ${tokenNumber} as served.`;
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipToken = async (tokenId, tokenNumber) => {
    const isConfirmed = await confirm(
      'Skip Token',
      `Are you sure you want to skip token ${tokenNumber}? It will be moved to the end of the queue or marked as skipped.`
    );
    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await companyAdminService.skipToken(tokenId);
      showToast(`Token ${tokenNumber} skipped!`, 'warning');
      fetchActiveTokens();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to skip token ${tokenNumber}.`;
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelToken = async (tokenId, tokenNumber) => {
    const isConfirmed = await confirm(
      'Cancel Token',
      `Are you sure you want to cancel token ${tokenNumber}?`
    );
    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await companyAdminService.cancelToken(tokenId);
      showToast(`Token ${tokenNumber} cancelled!`, 'error');
      fetchActiveTokens();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to cancel token ${tokenNumber}.`;
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  return (
    <div className={styles.queueCustomersContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Service Queue: {nowServing?.serviceType.name || serviceId}</h1>
        <div className={styles.queueActions}>
          <button onClick={handleCallNext} className={styles.callNextButton} disabled={isLoading}>
            Call Next Token
          </button>
        </div>
      </header>

      {nowServing && (
        <div className={styles.nowServingCard}>
          <h2>Now Serving</h2>
          <div className={styles.customerItem}>
            <p><strong>Token:</strong> {nowServing.tokenNumber}</p>
            <p><strong>User:</strong> {nowServing.serviceType.description}</p> {/* Placeholder, ideally user details */}
            <p><strong>Status:</strong> {nowServing.status}</p>
            <p><strong>Time:</strong> {new Date(nowServing.createdAt).toLocaleTimeString()}</p>
            <div className={styles.actions}>
              <button 
                className={styles.serveButton}
                onClick={() => handleMarkServed(nowServing.id, nowServing.tokenNumber)}
                disabled={isLoading || nowServing.status === 'SERVED'}
              >
                Mark Served
              </button>
              <button 
                className={styles.skipButton}
                onClick={() => handleSkipToken(nowServing.id, nowServing.tokenNumber)}
                disabled={isLoading || nowServing.status === 'SKIPPED'}
              >
                Skip
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => handleCancelToken(nowServing.id, nowServing.tokenNumber)}
                disabled={isLoading || nowServing.status === 'CANCELLED'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h3>Waiting Queue ({activeTokens.length})</h3>
      {activeTokens.length === 0 ? (
        <EmptyState message="No customers currently in the waiting queue." />
      ) : (
        <div className={styles.customerList}>
          {activeTokens.map(token => (
            <div key={token.id} className={styles.customerItem}>
              <p><strong>Token:</strong> {token.tokenNumber}</p>
              <p><strong>User ID:</strong> {token.userId}</p>
              <p><strong>Status:</strong> {token.status}</p>
              <p><strong>Time:</strong> {new Date(token.createdAt).toLocaleTimeString()}</p>
              <div className={styles.actions}>
                {/* These buttons could be hidden if token is 'CALLING' or if it's 'nowServing' to prevent duplicate actions */}
                <button 
                  className={styles.skipButton}
                  onClick={() => handleSkipToken(token.id, token.tokenNumber)}
                  disabled={isLoading || token.status === 'SKIPPED'}
                >
                  Skip
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => handleCancelToken(token.id, token.tokenNumber)}
                  disabled={isLoading || token.status === 'CANCELLED'}
                >
                  Cancel
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
