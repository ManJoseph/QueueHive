import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyService from '../../api/companyService';
import tokenService from '../../api/tokenService';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import CompanyCard from '../../components/CompanyCard';
import ServiceModal from '../../components/ServiceModal';
import MyQueues from '../../components/MyQueues';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyServices, setCompanyServices] = useState([]);

  const { userId, logout } = useAuth(); // Get userId and logout from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await companyService.getApprovedCompanies();
        setCompanies(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch companies.');
        if (err.statusCode === 401 || err.statusCode === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate, logout]);

  const handleSelectCompany = async (companyId) => {
    try {
      const company = companies.find(c => c.id === companyId);
      if (company) {
        setSelectedCompany(company);
        const response = await companyService.getServicesForCompany(companyId);
        setCompanyServices(response.data);
        setShowServiceModal(true);
      }
    } catch (err) {
      setError(err.message || `Failed to fetch services for company ID: ${companyId}.`);
    }
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setSelectedCompany(null);
    setCompanyServices([]);
  };

  const handleJoinQueue = async (serviceId) => {
    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }
    try {
      const response = await tokenService.createToken(parseInt(userId), serviceId);
      console.log('Joined queue:', response.data);
      handleCloseServiceModal();
    } catch (err) {
      setError(err.message || 'Failed to join queue.');
    }
  };

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

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>User Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Available Companies</h2>
        <div className={styles.companyList}>
          {companies.length > 0 ? (
            companies.map((company) => (
              <CompanyCard 
                key={company.id} 
                company={company} 
                onSelectCompany={handleSelectCompany} 
              />
            ))
          ) : (
            <EmptyState message="No approved companies available." />
          )}
        </div>
      </section>

      <section className={styles.section}>
        <MyQueues /> {/* My Active Queues component */}
      </section>

      <ServiceModal
        show={showServiceModal}
        onClose={handleCloseServiceModal}
        companyName={selectedCompany?.name || ''}
        services={companyServices}
        onSelectService={handleJoinQueue}
      />
    </div>
  );
};

export default UserDashboard;