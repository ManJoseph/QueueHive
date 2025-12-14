import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import websocketService from '../../api/websocketService';
import tokenService from '../../api/tokenService';
import styles from './BookToken.module.css';
import EmptyState from '../../components/EmptyState';

const BookToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Data passed from the Dashboard page
  const tokenData = location.state; 

  const [currentPosition, setCurrentPosition] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');

  // Effect to establish WebSocket connection
  useEffect(() => {
    if (!tokenData) return;

    const client = websocketService.createStompClient();
    
    client.onConnect = () => {
      console.log('WebSocket Connected!');
      setStompClient(client);
      // Subscribe to updates for the specific service queue
      websocketService.subscribeToTopic(client, `/topic/queue-updates/${tokenData.serviceId}`, (message) => {
        console.log('Queue update received:', message);
        // The message could contain the new current token, or total people in queue, etc.
        // For this example, let's just show a notification.
        if (message.tokenNumber !== tokenData.tokenNumber) {
            setLastUpdate(`Token #${message.tokenNumber} was just called.`);
        }
      });
    };

    client.activate();

    // Cleanup on component unmount
    return () => {
      if (client && client.connected) {
        client.deactivate();
        console.log('WebSocket Disconnected');
      }
    };
  }, [tokenData]);

  // Effect to periodically fetch the queue position
  useEffect(() => {
    if (!tokenData?.tokenId) return;

    const fetchPosition = async () => {
        try {
            const response = await tokenService.getQueuePosition(tokenData.tokenId);
            setCurrentPosition(response.data.position);
        } catch (error) {
            console.error("Failed to fetch queue position:", error);
        }
    };

    fetchPosition(); // Fetch immediately on load
    const interval = setInterval(fetchPosition, 10000); // And then every 10 seconds

    return () => clearInterval(interval); // Cleanup interval
  }, [tokenData?.tokenId]);


  if (!tokenData) {
    return (
      <main className={styles.mainContent}>
        <EmptyState message="You haven't booked a token yet." />
      </main>
    );
  }

  const { tokenNumber, serviceName, companyName } = tokenData;

  return (
    <main className={styles.mainContent}>
      <div className={styles.container}>
        {lastUpdate && <p className={styles.notification}>{lastUpdate}</p>}
        <h1 className={styles.title}>Your Token is Ready</h1>
        <div className={styles.tokenDisplay}>
          <span className={styles.tokenNumber}>{tokenNumber}</span>
        </div>
        <p className={styles.serviceInfo}>For <strong>{serviceName}</strong> at <strong>{companyName}</strong></p>
        
        {currentPosition !== null ? (
            <p className={styles.queuePosition}>
                Your position in the queue: <strong>{currentPosition}</strong>
            </p>
        ) : (
            <p className={styles.queuePosition}>Loading your position...</p>
        )}
        
        <button className={styles.confirmButton} onClick={() => navigate('/user/dashboard')}>
          Done
        </button>
      </div>
    </main>
  );
};

export default BookToken;

