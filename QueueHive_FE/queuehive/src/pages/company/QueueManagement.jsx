import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../components/toast/useToast';
import { useConfirmModal } from '../../components/confirmModal/useConfirmModal';
import ConfirmModal from '../../components/confirmModal/ConfirmModal';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import companyAdminService from '../../api/companyAdminService';
import tokenManagementService from '../../api/tokenManagementService';
import { FaPhone, FaCheck, FaBan, FaForward } from 'react-icons/fa';
import styles from './QueueManagement.module.css';

const QueueManagement = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const { confirm, ConfirmModalProps } = useConfirmModal();

  const companyId = localStorage.getItem('companyId');

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch tokens when service is selected
  useEffect(() => {
    if (selectedService) {
      fetchTokens();
    }
  }, [selectedService]);

  const fetchServices = async () => {
    if (!companyId) {
      showToast('Company ID not found', 'error');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await companyAdminService.getCompanyServices(companyId);
      setServices(response.data);
      if (response.data.length > 0) {
        setSelectedService(response.data[0].id);
      }
    } catch (error) {
      showToast('Failed to load services', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTokens = async () => {
    if (!selectedService) return;

    try {
      const response = await tokenManagementService.getTokensByService(selectedService);
      setTokens(response.data);
    } catch (error) {
      showToast('Failed to load tokens', 'error');
    }
  };

  const handleCallNext = async () => {
    const isConfirmed = await confirm(
      'Call Next Token',
      'Are you sure you want to call the next token in queue?'
    );

    if (!isConfirmed) return;

    try {
      setIsProcessing(true);
      await tokenManagementService.callNextToken(selectedService);
      showToast('Next token called successfully!', 'success');
      await fetchTokens();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to call next token', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkServed = async (tokenId, tokenNumber) => {
    const isConfirmed = await confirm(
      'Mark as Served',
      `Mark token #${tokenNumber} as served?`
    );

    if (!isConfirmed) return;

    try {
      setIsProcessing(true);
      await tokenManagementService.markTokenServed(tokenId);
      showToast('Token marked as served!', 'success');
      await fetchTokens();
    } catch (error) {
      showToast('Failed to mark token as served', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = async (tokenId, tokenNumber) => {
    const isConfirmed = await confirm(
      'Skip Token',
      `Skip token #${tokenNumber}? It will be moved to the end of the queue.`
    );

    if (!isConfirmed) return;

    try {
      setIsProcessing(true);
      await tokenManagementService.skipToken(tokenId);
      showToast('Token skipped!', 'warning');
      await fetchTokens();
    } catch (error) {
      showToast('Failed to skip token', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async (tokenId, tokenNumber) => {
    const isConfirmed = await confirm(
      'Cancel Token',
      `Cancel token #${tokenNumber}? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      setIsProcessing(true);
      await tokenManagementService.cancelToken(tokenId);
      showToast('Token cancelled!', 'warning');
      await fetchTokens();
    } catch (error) {
      showToast('Failed to cancel token', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return styles.statusPending;
      case 'CALLING':
        return styles.statusCalling;
      case 'SERVED':
        return styles.statusServed;
      case 'SKIPPED':
        return styles.statusSkipped;
      case 'CANCELLED':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const pendingTokens = tokens.filter(t => t.status === 'PENDING');
  const callingTokens = tokens.filter(t => t.status === 'CALLING');
  const otherTokens = tokens.filter(t => !['PENDING', 'CALLING'].includes(t.status));

  if (isLoading) {
    return <Loader text="Loading queue..." />;
  }

  if (services.length === 0) {
    return <EmptyState message="No services available. Please add a service first." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Queue Management</h1>
        <p className={styles.subtitle}>Manage your service queue in real-time</p>
      </div>

      {/* Service Selector */}
      <div className={styles.serviceSelector}>
        <label htmlFor="service">Select Service:</label>
        <select
          id="service"
          value={selectedService || ''}
          onChange={(e) => setSelectedService(Number(e.target.value))}
          className={styles.select}
        >
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Call Next Button */}
      <div className={styles.actionBar}>
        <button
          onClick={handleCallNext}
          disabled={isProcessing || pendingTokens.length === 0}
          className={styles.callNextButton}
        >
          <FaPhone /> Call Next Token
        </button>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <strong>{pendingTokens.length}</strong> Pending
          </span>
          <span className={styles.statItem}>
            <strong>{callingTokens.length}</strong> Calling
          </span>
          <span className={styles.statItem}>
            <strong>{tokens.length}</strong> Total
          </span>
        </div>
      </div>

      {/* Currently Calling */}
      {callingTokens.length > 0 && (
        <div className={styles.callingSection}>
          <h2 className={styles.sectionTitle}>Currently Calling</h2>
          <div className={styles.callingTokens}>
            {callingTokens.map(token => (
              <div key={token.id} className={styles.callingCard}>
                <div className={styles.tokenInfo}>
                  <span className={styles.tokenNumber}>#{token.tokenNumber}</span>
                  <span className={styles.userId}>User ID: {token.userId}</span>
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() => handleMarkServed(token.id, token.tokenNumber)}
                    className={styles.serveButton}
                    disabled={isProcessing}
                  >
                    <FaCheck /> Serve
                  </button>
                  <button
                    onClick={() => handleSkip(token.id, token.tokenNumber)}
                    className={styles.skipButton}
                    disabled={isProcessing}
                  >
                    <FaForward /> Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className={styles.queueSection}>
        <h2 className={styles.sectionTitle}>Queue ({pendingTokens.length})</h2>
        {pendingTokens.length > 0 ? (
          <div className={styles.tokenList}>
            {pendingTokens.map((token, index) => (
              <div key={token.id} className={styles.tokenCard}>
                <div className={styles.tokenHeader}>
                  <span className={styles.position}>Position: {index + 1}</span>
                  <span className={styles.tokenNum}>#{token.tokenNumber}</span>
                </div>
                <div className={styles.tokenDetails}>
                  <span>User ID: {token.userId}</span>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(token.status)}`}>
                    {token.status}
                  </span>
                </div>
                <div className={styles.tokenActions}>
                  <button
                    onClick={() => handleCancel(token.id, token.tokenNumber)}
                    className={styles.cancelButton}
                    disabled={isProcessing}
                  >
                    <FaBan /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No tokens in queue" />
        )}
      </div>

      {/* History */}
      {otherTokens.length > 0 && (
        <div className={styles.historySection}>
          <h2 className={styles.sectionTitle}>Recent History</h2>
          <div className={styles.historyList}>
            {otherTokens.slice(0, 10).map(token => (
              <div key={token.id} className={styles.historyItem}>
                <span className={styles.tokenNum}>#{token.tokenNumber}</span>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(token.status)}`}>
                  {token.status}
                </span>
                <span className={styles.time}>
                  {new Date(token.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal {...ConfirmModalProps} />
    </div>
  );
};

export default QueueManagement;
