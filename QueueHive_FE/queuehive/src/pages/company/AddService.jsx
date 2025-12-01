import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import companyAdminService from '../../api/companyAdminService';
import Loader from '../../components/Loader';
import styles from './AddService.module.css'; // Create this CSS module

const AddService = () => {
  const [formData, setFormData] = useState({
    name: '',
    averageServiceTime: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const companyId = localStorage.getItem('companyId');

  const validateField = (name, value) => {
    let errorMessage = null;
    switch (name) {
      case 'name':
        if (!value) errorMessage = 'Service name is required.';
        break;
      case 'averageServiceTime':
        if (!value) errorMessage = 'Average service time is required.';
        else if (isNaN(value) || parseInt(value) <= 0) errorMessage = 'Must be a positive number.';
        break;
      default:
        break;
    }
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    const errorMessage = validateField(name, value);
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const validateFormOnSubmit = () => {
    let errors = {};
    let isValid = true;
    for (const key in formData) {
      const errorMessage = validateField(key, formData[key]);
      if (errorMessage) {
        errors[key] = errorMessage;
        isValid = false;
      }
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateFormOnSubmit()) {
      return;
    }

    if (!companyId) {
      setError('Company ID not found. Cannot add service.');
      return;
    }

    setIsLoading(true);
    try {
      const serviceData = {
        companyId: parseInt(companyId), // Ensure companyId is number
        name: formData.name,
        averageServiceTime: parseInt(formData.averageServiceTime),
      };
      await companyAdminService.addService(serviceData);
      setSuccessMessage('Service added successfully! Redirecting...');
      setTimeout(() => {
        navigate('/company/manage-services');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to add service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.addServiceContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Add New Service</h1>
      </header>
      
      {error && <div className={styles.errorBanner}>{error}</div>}
      {successMessage && <div className={`${styles.errorBanner} ${styles.successBanner}`}>{successMessage}</div>}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Service Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {formErrors.name && <p className={styles.errorText}>{formErrors.name}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="averageServiceTime">Average Service Time (minutes)</label>
          <input
            type="number"
            id="averageServiceTime"
            name="averageServiceTime"
            value={formData.averageServiceTime}
            onChange={handleChange}
            required
          />
          {formErrors.averageServiceTime && <p className={styles.errorText}>{formErrors.averageServiceTime}</p>}
        </div>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? <Loader text="" size="small" /> : 'Add Service'}
        </button>
      </form>
    </div>
  );
};

export default AddService;
