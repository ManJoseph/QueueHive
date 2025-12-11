import React, { useEffect, useState } from 'react';
import superAdminService from '../../api/superAdminService'; // To be created
import Loader from '../../components/Loader';
import { useToast } from '../../components/toast/useToast';
import styles from './AdminDashboard.module.css'; // Reusing styles for consistency

const DashboardOverview = () => {
    const [overview, setOverview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                setIsLoading(true);
                const response = await superAdminService.getDashboardOverview();
                setOverview(response.data);
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Failed to fetch dashboard overview.';
                showToast(msg, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverview();
    }, [showToast]);

    if (isLoading) {
        return <Loader text="Loading Dashboard Overview..." />;
    }

    if (!overview) {
        return <div className={styles.errorBanner}>Could not load dashboard data.</div>;
    }

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Dashboard Overview</h2>
            <div className={styles.overviewGrid}>
                <div className={styles.overviewCard}>
                    <h3>Total Companies</h3>
                    <p>{overview.totalCompanies}</p>
                </div>
                <div className={styles.overviewCard}>
                    <h3>Approved Companies</h3>
                    <p>{overview.approvedCompanies}</p>
                </div>
                <div className={styles.overviewCard}>
                    <h3>Pending Companies</h3>
                    <p>{overview.pendingCompanies}</p>
                </div>
                <div className={styles.overviewCard}>
                    <h3>Total Users</h3>
                    <p>{overview.totalUsers}</p>
                </div>
                <div className={styles.overviewCard}>
                    <h3>Tokens Issued Today</h3>
                    <p>{overview.totalTokensToday}</p>
                </div>
                <div className={styles.overviewCard}>
                    <h3>Active Queues</h3>
                    <p>{overview.activeQueues}</p>
                </div>
                <div className={styles.overviewCard}>
                    <h3>System Health</h3>
                    <p className={styles.healthStatus}>{overview.systemHealth}</p>
                </div>
            </div>
        </section>
    );
};

export default DashboardOverview;
