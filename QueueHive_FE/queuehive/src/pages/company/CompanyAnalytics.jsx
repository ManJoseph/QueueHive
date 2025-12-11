import React, { useEffect, useState } from 'react';
import companyAdminService from '../../api/companyAdminService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/toast/useToast'; // Import useToast
import styles from './CompanyAnalytics.module.css';

const CompanyAnalytics = () => {
  const [dailyVisitors, setDailyVisitors] = useState(null);
  const [queueStats, setQueueStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    if (!companyId) {
      showToast('Company ID not found. Please log in as a Company Admin.', 'error');
      setIsLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const visitorsResponse = await companyAdminService.getDailyVisitors(companyId);
        setDailyVisitors(visitorsResponse.data);

        const statsResponse = await companyAdminService.getQueueStats(companyId);
        setQueueStats(statsResponse.data);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to fetch analytics data.';
        showToast(msg, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [companyId, showToast]);

  if (isLoading) {
    return <Loader />;
  }

  if (dailyVisitors === null && queueStats.length === 0) { // Check both to show EmptyState only if truly no data
    return <EmptyState message="No analytics data available for today." />;
  }

  return (
    <div className={styles.analyticsContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Company Analytics</h1>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Daily Visitors</h2>
        {dailyVisitors !== null ? (
          <div className={styles.metricCard}>
            <p className={styles.metricValue}>{dailyVisitors}</p>
            <p className={styles.metricLabel}>Visitors Today</p>
          </div>
        ) : (
          <EmptyState message="No daily visitor data available." />
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Queue Statistics</h2>
        {queueStats.length > 0 ? (
          <div className={styles.statsList}>
            {queueStats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                {stat}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No queue statistics available." />
        )}
      </section>
    </div>
  );
};

export default CompanyAnalytics;
