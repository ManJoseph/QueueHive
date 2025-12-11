import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import companyAdminService from '../../api/companyAdminService';
import Loader from '../../components/Loader';
import styles from './AddService.module.css'; // Create this CSS module
import { useToast } from '../../components/toast/useToast';

const AddService = () => {
  const { serviceId } = useParams(); // Get serviceId from URL for edit mode
  const isEditMode = !!serviceId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    averageServiceTime: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    if (isEditMode) {
      const fetchService = async () => {
        try {
          setIsLoading(true);
          const response = await companyAdminService.getServiceById(serviceId);
          setFormData({
            name: response.data.name || '',
            description: response.data.description || '',
            averageServiceTime: response.data.averageServiceTime || '',
          });
        } catch (err) {
          setError(err.message || 'Failed to fetch service details.');
          showToast('Failed to fetch service details.', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchService();
    }
  }, [serviceId, isEditMode, showToast]);

  const validateField = (name, value) => {
    let errorMessage = null;
    switch (name) {
      case 'name':
        if (!value) errorMessage = 'Service name is required.';
        break;
      case 'description':
        if (value && value.length > 400) errorMessage = 'Description cannot exceed 400 characters.';
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
      showToast('Please correct the form errors.', 'error');
      return;
    }

    if (!companyId) {
      setError('Company ID not found. Cannot add/update service.');
      showToast('Company ID not found. Please log in.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const serviceData = {
        companyId: parseInt(companyId),
        name: formData.name,
        description: formData.description,
        averageServiceTime: parseInt(formData.averageServiceTime),
      };

      if (isEditMode) {
        await companyAdminService.updateService(serviceId, serviceData);
        setSuccessMessage('Service updated successfully!');
        showToast('Service updated successfully!', 'success');
      } else {
        await companyAdminService.addService(serviceData);
        setSuccessMessage('Service added successfully!');
        showToast('Service added successfully!', 'success');
      }

      setTimeout(() => {
        navigate('/company/manage-services');
      }, 1500);

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/company/manage-services');
  };

  return (
    <div className={styles.addServiceContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>{isEditMode ? 'Edit Service' : 'Add New Service'}</h1>
        <button onClick={handleCancel} className={styles.backButton}>
          ← Back to Services
        </button>
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
          <label htmlFor="description">Description (Optional, max 400 characters)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            maxLength="400"
          ></textarea>
          {formErrors.description && <p className={styles.errorText}>{formErrors.description}</p>}
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
          {isLoading ? <Loader text="" size="small" /> : (isEditMode ? 'Update Service' : 'Add Service')}
        </button>
      </form>
    </div>
  );
};

export default AddService;
