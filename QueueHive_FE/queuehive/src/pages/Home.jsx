import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CompanyCard from '../components/CompanyCard';
import ServiceModal from '../components/ServiceModal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import styles from './Home.module.css';
import companyApi from '../api/companyApi';
import tokenApi from '../api/tokenApi';

const Home = ({ goToBookToken }) => {
  const [companies, setCompanies] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await companyApi.getApprovedCompanies();
        setCompanies(response.data);
      } catch (err) {
        setError("We couldn't load the available companies. Please try again later.");
        console.error("Error fetching companies:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleCardClick = async (company) => {
    setError(null);
    try {
      const response = await companyApi.getServicesForCompany(company.id);
      setServices(response.data);
      setSelectedCompany(company);
      setShowModal(true);
    } catch (err) {
      setError(`Failed to fetch services for ${company.name}.`);
      console.error("Error fetching services:", err);
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
    setError(null);
    try {
      const createTokenResponse = await tokenApi.createToken(userId, serviceId);
      const newToken = createTokenResponse.data;

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
      setError("There was a problem creating your token. Please try again.");
      console.error("Error creating token:", err);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader text="Loading Companies..." />;
    }
    if (companies.length === 0) {
      return <EmptyState message="No companies are available at the moment." />;
    }
    return (
      <div className={styles.companyGrid}>
        {companies.map(company => (
          <div key={company.id} onClick={() => handleCardClick(company)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleCardClick(company)}>
              <CompanyCard company={company} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.home}>
      <Header />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Select a Company</h1>
        {error && <p className={styles.error}>{error}</p>}
        {renderContent()}
      </main>
      {selectedCompany && (
        <ServiceModal 
          show={showModal} 
          onClose={handleCloseModal}
          services={services}
          companyName={selectedCompany.name}
          onSelectService={handleSelectService}
        />
      )}
    </div>
  );
};

export default Home;
