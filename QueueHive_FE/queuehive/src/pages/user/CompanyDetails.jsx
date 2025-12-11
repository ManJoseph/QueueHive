import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import companyService from '../../api/companyService';
import tokenService from '../../api/tokenService';
import styles from './CompanyDetails.module.css';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { jwtDecode } from 'jwt-decode';

const CompanyDetails = () => {
  const { id } = useParams(); // Get company ID from URL
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [company, setCompany] = useState(null); // To store company info like name, description, category
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            return jwtDecode(token).sub; // Assuming 'sub' is the user ID
        } catch { return null; }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const companyResponse = await companyService.getCompanyById(id);
        setCompany(companyResponse.data);

        const serviceResponse = await companyService.getServicesForCompany(id);
        setServices(serviceResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to load company details or services.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBookToken = async (service) => {
    const userId = getUserIdFromToken();
    if (!userId) {
        setError("You must be logged in to book a token.");
        return;
    }

    try {
        const createTokenResponse = await tokenService.createToken(userId, service.id);
        const newToken = createTokenResponse.data;

        navigate('/user/book-token', { state: {
            tokenNumber: newToken.tokenNumber,
            serviceName: service.name,
            companyName: company?.name || 'Selected Company', // Use fetched company name
            tokenId: newToken.id,
            serviceId: service.id
        }});
    } catch (err) {
        setError(err.message || 'There was a problem creating your token.');
        console.error('Error creating token:', err);
    }
  };

  if (isLoading) {
    return <Loader text="Loading company details..." />;
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  if (!company) {
    return <EmptyState message="Company not found." />;
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.headerContainer}>
        <h1 className={styles.companyName}>{company.name}</h1>
        {company.description && <p className={styles.companyDescription}>{company.description}</p>}
        {company.category && <p className={styles.companyDescription}>Category: {company.category}</p>}
        {company.location && <p className={styles.companyDescription}>Location: {company.location}</p>}
      </div>

      <h2 className={styles.sectionTitle}>Available Services</h2>
      <hr className={styles.divider} />
      
      {services.length > 0 ? (
        <div className={styles.serviceList}>
          {services.map(service => (
            <div key={service.id} className={styles.serviceItem}>
              <div className={styles.serviceDetails}>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDescription}>{service.description || 'No description available.'}</p>
                {service.averageServiceTime && <p className={styles.serviceTime}>Avg. {service.averageServiceTime} min</p>}
              </div>
              <button onClick={() => handleBookToken(service)} className={styles.bookButton}>
                Book Token
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="This company has no services available at the moment." />
      )}
    </main>
  );
};

export default CompanyDetails;
