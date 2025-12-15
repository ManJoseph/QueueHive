import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/toast/useToast';
import tokenService from '../../api/tokenService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { FaBell, FaCheckCircle, FaBan, FaClock, FaPhone, FaForward, FaSync } from 'react-icons/fa';
import styles from './Notifications.module.css';

const Notifications = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const getUserIdFromToken = () => {
    // Get userId from localStorage (stored during login)
    const userId = localStorage.getItem('userId');
    return userId || null;
  };

  useEffect(() => {
    fetchTokens();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchTokens, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTokens = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      showToast('Please log in to view notifications', 'error');
      setIsLoading(false);
      return;
    }

    try {
      if (!isLoading) setIsSyncing(true); // Show sync indicator for background updates
      const response = await tokenService.getAllTokensByUserId(userId);
      // Sort by createdAt descending (newest first)
      const sortedTokens = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTokens(sortedTokens);
      setLastSync(new Date());
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CALLING':
        return <FaPhone className={styles.iconCalling} />;
      case 'SERVED':
        return <FaCheckCircle className={styles.iconServed} />;
      case 'CANCELLED':
        return <FaBan className={styles.iconCancelled} />;
      case 'SKIPPED':
        return <FaForward className={styles.iconSkipped} />;
      case 'PENDING':
        return <FaClock className={styles.iconPending} />;
      default:
        return <FaBell />;
    }
  };

  const getStatusMessage = (token) => {
    switch (token.status) {
      case 'CALLING':
        return `Your token #${token.tokenNumber} is being called! Please proceed to the service counter.`;
      case 'SERVED':
        return `Token #${token.tokenNumber} has been served.`;
      case 'CANCELLED':
        return `Token #${token.tokenNumber} has been cancelled.`;
      case 'PENDING':
        return `Token #${token.tokenNumber} is waiting in queue.`;
      case 'SKIPPED':
        return `Token #${token.tokenNumber} was skipped.`;
      default:
        return `Token #${token.tokenNumber} status: ${token.status}`;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'CALLING':
        return styles.notificationCalling;
      case 'SERVED':
        return styles.notificationServed;
      case 'CANCELLED':
        return styles.notificationCancelled;
      case 'PENDING':
        return styles.notificationPending;
      case 'SKIPPED':
        return styles.notificationSkipped;
      default:
        return '';
    }
  };

  const activeTokens = tokens.filter(t => ['CALLING', 'PENDING'].includes(t.status));
  const importantNotifications = tokens.filter(t => ['CALLING', 'CANCELLED', 'SKIPPED'].includes(t.status));
  const allTokens = tokens;

  if (isLoading) {
    return <Loader text="Loading notifications..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <FaBell className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Notifications</h1>
            <p className={styles.subtitle}>
              Stay updated on your token status
              {lastSync && (
                <span className={styles.syncInfo}>
                  {isSyncing && <FaSync className={styles.syncIcon} />}
                  {!isSyncing && ` • Last synced: ${lastSync.toLocaleTimeString()}`}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Important Notifications - CALLING, CANCELLED, SKIPPED */}
      {importantNotifications.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>⚠️ Important Notifications</h2>
          <div className={styles.notificationList}>
            {importantNotifications.map(token => (
              <div 
                key={token.id} 
                className={`${styles.notification} ${getStatusClass(token.status)}`}
              >
                <div className={styles.notificationIcon}>
                  {getStatusIcon(token.status)}
                </div>
                <div className={styles.notificationContent}>
                  <h3 className={styles.notificationTitle}>
                    {token.serviceType?.name || 'Service'}
                  </h3>
                  <p className={styles.notificationMessage}>
                    {getStatusMessage(token)}
                  </p>
                  <div className={styles.notificationMeta}>
                    <span className={styles.company}>
                      {token.serviceType?.companyName || 'Company'}
                    </span>
                    <span className={styles.time}>
                      {new Date(token.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className={styles.notificationBadge}>
                  {token.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Tokens History */}
      {allTokens.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>All Tokens</h2>
          <div className={styles.notificationList}>
            {allTokens.slice(0, 20).map(token => (
              <div 
                key={token.id} 
                className={`${styles.notification} ${getStatusClass(token.status)}`}
              >
                <div className={styles.notificationIcon}>
                  {getStatusIcon(token.status)}
                </div>
                <div className={styles.notificationContent}>
                  <h3 className={styles.notificationTitle}>
                    {token.serviceType?.name || 'Service'}
                  </h3>
                  <p className={styles.notificationMessage}>
                    {getStatusMessage(token)}
                  </p>
                  <div className={styles.notificationMeta}>
                    <span className={styles.company}>
                      {token.serviceType?.companyName || 'Company'}
                    </span>
                    <span className={styles.time}>
                      {new Date(token.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className={styles.notificationBadge}>
                  {token.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tokens.length === 0 && (
        <EmptyState message="No notifications yet. Book a token to get started!" />
      )}
    </div>
  );
};

export default Notifications;
