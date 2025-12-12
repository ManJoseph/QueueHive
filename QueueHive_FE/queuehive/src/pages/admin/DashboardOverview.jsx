import React, { useEffect, useState } from 'react';
import superAdminService from '../../api/superAdminService';
import Loader from '../../components/Loader';
import { useToast } from '../../components/toast/useToast';
import {
    FaBuilding,
    FaCheckCircle,
    FaClock,
    FaUsers,
    FaTicketAlt,
    FaListAlt,
    FaHeartbeat
} from 'react-icons/fa';
import styles from './AdminDashboard.module.css';

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

    const stats = [
        {
            title: 'Total Companies',
            value: overview.totalCompanies,
            icon: <FaBuilding />,
            color: 'primary',
            trend: null
        },
        {
            title: 'Approved Companies',
            value: overview.approvedCompanies,
            icon: <FaCheckCircle />,
            color: 'success',
            trend: null
        },
        {
            title: 'Pending Approval',
            value: overview.pendingCompanies,
            icon: <FaClock />,
            color: 'warning',
            trend: null
        },
        {
            title: 'Total Users',
            value: overview.totalUsers,
            icon: <FaUsers />,
            color: 'info',
            trend: null
        },
        {
            title: 'Tokens Today',
            value: overview.totalTokensToday,
            icon: <FaTicketAlt />,
            color: 'accent',
            trend: null
        },
        {
            title: 'Active Queues',
            value: overview.activeQueues,
            icon: <FaListAlt />,
            color: 'secondary',
            trend: null
        }
    ];

    return (
        <div className={styles.overviewSection}>
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} className={`${styles.statCard} ${styles[`stat-${stat.color}`]}`}>
                        <div className={styles.statIcon}>
                            {stat.icon}
                        </div>
                        <div className={styles.statContent}>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statTitle}>{stat.title}</div>
                        </div>
                    </div>
                ))}

                {/* System Health Card - Special Design */}
                <div className={`${styles.statCard} ${styles.healthCard}`}>
                    <div className={styles.statIcon}>
                        <FaHeartbeat />
                    </div>
                    <div className={styles.statContent}>
                        <div className={`${styles.healthStatus} ${styles[`health-${overview.systemHealth?.toLowerCase()}`]}`}>
                            {overview.systemHealth || 'Healthy'}
                        </div>
                        <div className={styles.statTitle}>System Health</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
