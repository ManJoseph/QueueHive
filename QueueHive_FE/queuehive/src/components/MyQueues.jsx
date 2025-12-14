import React, { useEffect, useState, useCallback } from 'react';
import tokenService from '../api/tokenService';
import Loader from './Loader';
import EmptyState from './EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from './toast/useToast'; // Import useToast
import websocketService from '../api/websocketService'; // Import websocketService
import styles from './MyQueues.module.css';

const MyQueues = () => {
  const [activeTokens, setActiveTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchActiveTokens = useCallback(async () => {
    if (!user || !user.userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await tokenService.getTokensByUserId(user.userId);
      
      const tokensWithPositions = await Promise.all(
        response.data.map(async (token) => {
          try {
            const positionResponse = await tokenService.getQueuePosition(token.id);
            return { ...token, queuePosition: positionResponse.data.position };
          } catch (posErr) {
            console.error(`Failed to get queue position for token ${token.id}:`, posErr);
            return { ...token, queuePosition: 'N/A' };
          }
        })
      );
      setActiveTokens(tokensWithPositions);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch active queues.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchActiveTokens();

    // WebSocket connection for real-time updates
    if (user && user.userId) {
      const stompClient = websocketService.connect(() => {
        // Subscribe to a general user-specific topic, or all relevant service topics
        // For simplicity, we'll just re-fetch all active tokens on any update for now
        stompClient.subscribe('/topic/tokenUpdates/*', (message) => { // Wildcard for all service updates
            showToast('Queue status updated!', 'info', 2000);
            fetchActiveTokens();
        });
      });

      return () => {
        websocketService.disconnect(stompClient);
      };
    }
  }, [user, fetchActiveTokens, showToast]);

  if (isLoading) {
    return <Loader />;
  }

  if (activeTokens.length === 0) {
    return <EmptyState message="You have no active queues." />;
  }

  return (
    <div className={styles.myQueuesContainer}>
      <h2 className={styles.title}>My Active Queues</h2>
      {activeTokens.map((token) => (
        <div key={token.id} className={styles.queueItem}>
          <p className={styles.companyName}><strong>Company:</strong> {token.serviceType?.company?.name || 'N/A'}</p> 
          <p className={styles.serviceName}><strong>Service:</strong> {token.serviceType?.name || 'Unknown Service'}</p>
          <p className={styles.tokenNumber}><strong>Token:</strong> #{token.tokenNumber}</p>
          <p className={styles.status}><strong>Status:</strong> <span className={styles[token.status.toLowerCase()]}>{token.status}</span></p>
          <p className={styles.position}><strong>Your Position:</strong> {token.queuePosition}</p>
          <p className={styles.time}><strong>Joined:</strong> {new Date(token.createdAt).toLocaleTimeString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MyQueues;
