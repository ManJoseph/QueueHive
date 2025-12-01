import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import companyAdminService from '../../api/companyAdminService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import styles from './ManageServices.module.css'; // Create this CSS module

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    if (!companyId) {
      setError('Company ID not found. Please log in as a Company Admin.');
      setIsLoading(false);
      return;
    }

    fetchServices();
  }, [companyId]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await companyAdminService.getCompanyServices(companyId);
      setServices(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch services.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    try {
      setIsLoading(true);
      await companyAdminService.deleteService(serviceId);
      await fetchServices(); // Refresh the list
      alert('Service deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete service.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.manageServicesContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Manage Your Services</h1>
        <Link to="/company/add-service" className={styles.addServiceButton}>Add New Service</Link>
      </header>

      {services.length === 0 ? (
        <EmptyState message="No services added yet. Click 'Add New Service' to get started." />
      ) : (
        <div className={styles.serviceList}>
          {services.map(service => (
            <div key={service.id} className={styles.serviceItem}>
              <div className={styles.serviceDetails}>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceAvgTime}>Avg. Time: {service.averageServiceTime} min</p>
                <p className={styles.serviceId}>ID: {service.id}</p>
              </div>
              <div className={styles.actions}>
                <button 
                  className={styles.editButton}
                  onClick={() => navigate(`/company/edit-service/${service.id}`)}
                >
                  Edit
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDeleteService(service.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageServices;
