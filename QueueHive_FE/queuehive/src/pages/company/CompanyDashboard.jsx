import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import companyAdminService from '../../api/companyAdminService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/toast/useToast'; // Import useToast
import styles from './CompanyDashboard.module.css';

const CompanyDashboard = () => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const { showToast } = useToast();

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    if (!companyId || role !== 'COMPANY_ADMIN') {
      const msg = 'Company ID not found or unauthorized. Please log in as a Company Admin.';
      showToast(msg, 'error');
      setIsLoading(false);
      if (role !== 'COMPANY_ADMIN') {
          logout();
          navigate('/login');
      }
      return;
    }

    const fetchCompanyProfile = async () => {
      try {
        setIsLoading(true);
        const response = await companyAdminService.getCompanyProfile(companyId);
        setCompanyProfile(response.data);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to fetch company profile.';
        showToast(msg, 'error');
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [companyId, navigate, logout, role, showToast]);


  if (isLoading) {
    return <Loader />;
  }

  if (!companyProfile) {
    return <EmptyState message="No company profile data available." />;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Welcome, {companyProfile.name} Admin!</h1>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Company Overview</h2>
        <div className={styles.overviewCard}>
          <p><strong>Company Name:</strong> {companyProfile.name}</p>
          <p><strong>Description:</strong> {companyProfile.description || 'N/A'}</p>
          <p><strong>Owner ID:</strong> {companyProfile.ownerId}</p>
          <p><strong>Status:</strong> {companyProfile.approved ? 'Approved' : 'Pending Approval'}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Admin Actions</h2>
        <nav className={styles.adminNav}>
          <Link to="/company/manage-services" className={styles.navLink}>Manage Services</Link>
          <Link to="/company/analytics" className={styles.navLink}>View Analytics</Link>
          <Link to="/company/profile-settings" className={styles.navLink}>Edit Company Profile</Link>
          {/* Link to queue management (e.g., for a specific service or all services) */}
          {/* <Link to="/company/queue-management" className={styles.navLink}>Manage Queues</Link> */}
        </nav>
      </section>

      {/* Placeholder for quick analytics or queue overview if desired */}
      {/* <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Stats</h2>
        <div className={styles.statsGrid}>
           Display quick stats here 
        </div>
      </section> */}

    </div>
  );
};

export default CompanyDashboard;