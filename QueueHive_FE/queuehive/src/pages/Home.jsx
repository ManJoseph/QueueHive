import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CompanyCard from '../components/CompanyCard';
import ServiceModal from '../components/ServiceModal';
import styles from './Home.module.css';
import companyApi from '../api/companyApi';
import tokenApi from '../api/tokenApi';

const Home = ({ goToBookToken }) => {
  const [companies, setCompanies] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyApi.getApprovedCompanies();
        setCompanies(response.data);
      } catch (err) {
        setError("Failed to fetch companies.");
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleCardClick = async (companyId) => {
    try {
      setLoading(true);
      const response = await companyApi.getServicesForCompany(companyId);
      setServices(response.data);
      setSelectedCompany(companies.find(c => c.id === companyId));
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch services for company.");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setServices([]);
    setSelectedCompany(null);
  };

  const handleSelectService = async (serviceId) => {
    // For now, assume a userId of 1. In a real app, this would come from auth context.
    const userId = 1; 
    try {
      setLoading(true);
      const createTokenResponse = await tokenApi.createToken(userId, serviceId);
      const newToken = createTokenResponse.data;

      // Fetch queue position after token creation
      const positionResponse = await tokenApi.getQueuePosition(newToken.id);
      const queuePosition = positionResponse.data.position;

      handleCloseModal();
      goToBookToken({ 
        tokenNumber: newToken.tokenNumber, 
        serviceName: services.find(s => s.id === serviceId)?.name,
        companyName: selectedCompany?.name,
        queuePosition: queuePosition,
        serviceId: serviceId
      });
    } catch (err) {
      setError("Failed to create token or get queue position.");
      console.error("Error creating token:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !companies.length) return <p>Loading companies...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.home}>
      <Header />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Select a Company</h1>
        <div className={styles.companyGrid}>
          {companies.map(company => (
            <div key={company.id} onClick={() => handleCardClick(company.id)}>
                <CompanyCard company={company} />
            </div>
          ))}
        </div>
      </main>
      <ServiceModal 
        show={showModal} 
        onClose={handleCloseModal}
        services={services}
        onSelectService={handleSelectService}
      />
    </div>
  );
};

export default Home;
