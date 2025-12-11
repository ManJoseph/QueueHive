import React, { useState, useEffect, useCallback } from 'react';
import companyService from '../../api/companyService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useConfirmModal } from '../../components/confirmModal/useConfirmModal';
import { useToast } from '../../components/toast/useToast';
import DashboardOverview from './DashboardOverview'; // Import DashboardOverview
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
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Super Admin Dashboard</h1>
      </header>

      <DashboardOverview />

      <hr className={styles.divider} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Companies Awaiting Approval</h2>
        {pendingCompanies.length > 0 ? (
          <ul className={styles.companyList}>
            {pendingCompanies.map(company => (
              <li key={company.id} className={styles.companyItem}>
                <h3>{company.name}</h3>
                <p>{company.description || 'No description provided.'}</p>
                <p><strong>Location:</strong> {company.location || 'N/A'}</p>
                <p><strong>Category:</strong> {company.category || 'N/A'}</p>
                <div className={styles.actions}>
                  <button onClick={() => handleApprove(company.id, company.name)} className={styles.approveButton}>Approve</button>
                  <button onClick={() => handleReject(company.id, company.name)} className={styles.rejectButton}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No companies are awaiting approval at the moment." />
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
