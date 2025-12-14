import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyService from '../../api/companyService';
import tokenService from '../../api/tokenService';
import { useAuth } from '../../context/AuthContext';
import CompanyCard from '../../components/CompanyCard';
import ServiceModal from '../../components/ServiceModal';
import MyQueues from '../../components/MyQueues';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/toast/useToast'; // Import useToast
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyServices, setCompanyServices] = useState([]);

  const { userId, user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await companyService.getApprovedCompanies();
        setCompanies(response.data);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to fetch companies.';
        showToast(msg, 'error');
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate, logout, showToast]);

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
      const msg = err.response?.data?.message || err.message || `Failed to fetch services for company ID: ${companyId}.`;
      showToast(msg, 'error');
    }
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setSelectedCompany(null);
    setCompanyServices([]);
  };

  const handleJoinQueue = async (serviceId) => {
    if (!userId) {
      showToast('User ID not found. Please log in again.', 'error');
      return;
    }
    try {
      const response = await tokenService.createToken(parseInt(userId), serviceId);
      showToast(`Successfully joined queue! Your token number is ${response.data.tokenNumber}.`, 'success', 5000);
      handleCloseServiceModal();
      // Optionally, you might want to refresh MyQueues here or pass the new token to it
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to join queue.';
      showToast(msg, 'error');
    }
  };


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.mainTitle}>Welcome back, {user?.fullName || 'User'}! 👋</h1>
          <p className={styles.subtitle}>Find services and join queues instantly</p>
        </div>
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