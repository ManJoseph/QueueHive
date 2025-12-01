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
  const [company, setCompany] = useState(null); // To store company info like name
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
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // You might need an endpoint to get company details along with services
        // For now, we fetch services and assume we can get company name from another source if needed
        const serviceResponse = await companyService.getServicesForCompany(id);
        setServices(serviceResponse.data);
        // If you had a getCompanyById endpoint, you'd call it here
        // For now, we'll just show services.
      } catch (err) {
        setError('Failed to load services for this company.');
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
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
            companyName: "the Company", // This is a limitation of not having a getCompanyById
            tokenId: newToken.id,
            serviceId: service.id
        }});
    } catch (err) {
        setError('There was a problem creating your token.');
        console.error('Error creating token:', err);
    }
  };

  if (isLoading) {
    return <Loader text="Loading services..." />;
  }

  if (error) {
    return <EmptyState title="Error" message={error} />;
  }

  return (
    <main className={styles.mainContent}>
      {/* A proper implementation would get the company name from the API */}
      <h1 className={styles.companyName}>Services</h1>
      <hr className={styles.divider} />
      {services.length > 0 ? (
        <div className={styles.serviceList}>
          {services.map(service => (
            <div key={service.id} className={styles.serviceItem}>
              <div>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDescription}>{service.description || 'No description available.'}</p>
              </div>
              <button onClick={() => handleBookToken(service)} className={styles.bookButton}>
                Book Token
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No Services" message="This company has no services available at the moment." />
      )}
    </main>
  );
};

export default CompanyDetails;
