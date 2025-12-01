import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import companyAdminService from '../../api/companyAdminService';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import Loader from '../../components/Loader';
import styles from './CompanyDashboard.module.css';

const CompanyDashboard = () => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, role } = useAuth(); // Get logout and role from AuthContext

  const companyId = localStorage.getItem('companyId'); // Assuming companyId is stored on login for company admin
  // const userId = localStorage.getItem('userId'); // No longer directly used here, rely on AuthContext for role

  useEffect(() => {
    if (!companyId || role !== 'COMPANY_ADMIN') { // Ensure companyId and role are correct
      setError('Company ID not found or unauthorized. Please log in as a Company Admin.');
      setIsLoading(false);
      if (role !== 'COMPANY_ADMIN') {
          logout(); // Log out if role is incorrect
          navigate('/login');
      }
      return;
    }

    const fetchCompanyProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await companyAdminService.getCompanyProfile(companyId);
        setCompanyProfile(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch company profile.');
        if (err.statusCode === 401 || err.statusCode === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [companyId, navigate, logout, role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!companyProfile) {
    return <div className={styles.emptyState}>No company profile data available.</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Welcome, {companyProfile.name} Admin!</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
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