import React, { useEffect, useState } from 'react';
import companyAdminService from '../../api/companyAdminService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import styles from './CompanyAnalytics.module.css'; // Create this CSS module

const CompanyAnalytics = () => {
  const [dailyVisitors, setDailyVisitors] = useState(null);
  const [queueStats, setQueueStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    if (!companyId) {
      setError('Company ID not found. Please log in as a Company Admin.');
      setIsLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const visitorsResponse = await companyAdminService.getDailyVisitors(companyId);
        setDailyVisitors(visitorsResponse.data);

        const statsResponse = await companyAdminService.getQueueStats(companyId);
        setQueueStats(statsResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [companyId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
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
