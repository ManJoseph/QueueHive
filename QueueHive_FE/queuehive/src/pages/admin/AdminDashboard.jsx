import React, { useState, useEffect, useCallback } from 'react';
import companyService from '../../api/companyService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useConfirmModal } from '../../components/confirmModal/useConfirmModal';
import { useToast } from '../../components/toast/useToast';
import { FaMapMarkerAlt, FaTag, FaInfoCircle } from 'react-icons/fa';
import DashboardOverview from './DashboardOverview';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { confirm } = useConfirmModal();
  const { showToast } = useToast();

  const fetchPendingCompanies = useCallback(async () => {
    try {
      const response = await companyService.getPendingCompanies();
      setPendingCompanies(response.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load pending companies.';
      showToast(msg, 'error');
    }
  }, [showToast]);

  useEffect(() => {
    setIsLoading(true);
    fetchPendingCompanies().finally(() => setIsLoading(false));
  }, [fetchPendingCompanies]);

  const handleApprove = async (companyId, companyName) => {
    const isConfirmed = await confirm(
      'Approve Company',
      `Are you sure you want to approve "${companyName}"?`
    );
    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await companyService.approveCompany(companyId);
      showToast(`Company "${companyName}" approved successfully!`, 'success');
      fetchPendingCompanies();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to approve company "${companyName}".`;
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (companyId, companyName) => {
    const isConfirmed = await confirm(
      'Reject Company',
      `Are you sure you want to reject "${companyName}"? This action cannot be undone.`
    );
    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await companyService.rejectCompany(companyId); 
      showToast(`Company "${companyName}" rejected.`, 'warning');
      fetchPendingCompanies();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to reject company "${companyName}".`;
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading Admin Dashboard..." />;
  }

  return (
    <div className={styles.dashboardContainer}>
      <DashboardOverview />

      <hr className={styles.divider} />

      <section className={styles.pendingSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Companies Awaiting Approval
            {pendingCompanies.length > 0 && (
              <span className={styles.badge}>{pendingCompanies.length}</span>
            )}
          </h2>
        </div>
        
        {pendingCompanies.length > 0 ? (
          <div className={styles.companyGrid}>
            {pendingCompanies.map(company => (
              <div key={company.id} className={styles.companyCard}>
                <div className={styles.companyHeader}>
                  <h3 className={styles.companyName}>{company.name}</h3>
                  <span className={styles.pendingBadge}>Pending</span>
                </div>
                
                <div className={styles.companyDetails}>
                  {company.description && (
                    <div className={styles.companyDescription}>
                      <FaInfoCircle className={styles.detailIcon} />
                      <span>{company.description}</span>
                    </div>
                  )}
                  
                  <div className={styles.companyMeta}>
                    {company.location && (
                      <div className={styles.metaItem}>
                        <FaMapMarkerAlt className={styles.metaIcon} />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.category && (
                      <div className={styles.metaItem}>
                        <FaTag className={styles.metaIcon} />
                        <span>{company.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.companyActions}>
                  <button 
                    onClick={() => handleApprove(company.id, company.name)} 
                    className={styles.approveButton}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(company.id, company.name)} 
                    className={styles.rejectButton}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No companies are awaiting approval at the moment." />
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
