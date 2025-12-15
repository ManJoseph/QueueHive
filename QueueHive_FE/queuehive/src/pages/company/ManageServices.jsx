import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import companyAdminService from '../../api/companyAdminService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/confirmModal/ConfirmModal';
import { useConfirmModal } from '../../components/confirmModal/useConfirmModal';
import { useToast } from '../../components/toast/useToast';
import styles from './ManageServices.module.css';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { confirm, ConfirmModalProps } = useConfirmModal();
  const { showToast } = useToast();

  const companyId = localStorage.getItem('companyId');

  const fetchServices = useCallback(async () => {
    if (!companyId) {
        showToast('Company ID not found. Please log in as a Company Admin.', 'error');
        setIsLoading(false);
        return;
    }

    try {
      setIsLoading(true);
      const response = await companyAdminService.getCompanyServices(companyId);
      setServices(response.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch services.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]); // Removed showToast from dependencies

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDeleteService = async (serviceId) => {
    const isConfirmed = await confirm(
      'Confirm Deletion',
      'Are you sure you want to delete this service? This action cannot be undone.'
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsLoading(true);
      await companyAdminService.deleteService(serviceId);
      showToast('Service deleted successfully!', 'success');
      await fetchServices(); // Refresh the list
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete service.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
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
                {service.description && <p className={styles.serviceDescription}>{service.description}</p>}
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
      
      <ConfirmModal {...ConfirmModalProps} />
    </div>
  );
};

export default ManageServices;
