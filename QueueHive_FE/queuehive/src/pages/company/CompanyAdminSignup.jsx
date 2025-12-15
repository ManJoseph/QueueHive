import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../api/authService'; // Updated path
import styles from '../Auth.module.css';
import Loader from '../../components/Loader';

const CompanyAdminSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    companyDescription: '',
    companyLocation: '',
    companyCategory: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null); // For server-side errors
  const [successMessage, setSuccessMessage] = useState(null); // For success messages
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value, currentFormData) => {
    let errorMessage = null;
    switch (name) {
      case 'fullName':
        if (!value) errorMessage = 'Full name is required.';
        break;
      case 'email':
        if (!value) errorMessage = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMessage = 'Invalid email format.';
        break;
      case 'password':
        if (!value) errorMessage = 'Password is required.';
        else if (value.length < 8) errorMessage = 'Password must be at least 8 characters long.';
        break;
      case 'phone':
        if (!value) errorMessage = 'Phone number is required.';
        break;
      case 'companyName':
        if (!value) errorMessage = 'Company name is required.';
        break;
      case 'companyLocation':
        if (!value) errorMessage = 'Company location is required.';
        break;
      case 'companyCategory':
        if (!value) errorMessage = 'Company category is required.';
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

    const errorMessage = validateField(name, value, updatedFormData);
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const validateFormOnSubmit = () => {
    let errors = {};
    let isValid = true;
    // Validate all fields
    for (const key in formData) {
      const errorMessage = validateField(key, formData[key], formData);
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

    setIsLoading(true);
    try {
      const { fullName, email, password, phone, companyName, companyDescription, companyLocation, companyCategory } = formData;
      const response = await authService.registerCompany({
        fullName, email, password, phone, companyName, companyDescription, companyLocation, companyCategory
      });
      
      // Show success message and redirect to login
      setSuccessMessage('Company registration successful! Please wait for admin approval before you can log in.');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/auth/login', { 
          state: { 
            message: 'Your company registration is pending approval. You will be notified once approved.' 
          } 
        });
      }, 3000);

    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Register as Company Admin</h2>
        <p className={styles.subtitle}>Create your company's administration account.</p>
        
        {error && <div className={styles.errorBanner}>{error}</div>}
        {successMessage && <div className={styles.successBanner}>{successMessage}</div>} {/* Use the correct successBanner class */}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Your Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {formErrors.fullName && <p className={styles.errorText}>{formErrors.fullName}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && <p className={styles.errorText}>{formErrors.email}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formErrors.password && <p className={styles.errorText}>{formErrors.password}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {formErrors.phone && <p className={styles.errorText}>{formErrors.phone}</p>}
          </div>
          <hr className={styles.formSeparator} /> {/* Separator for company details */}
          <div className={styles.inputGroup}>
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            {formErrors.companyName && <p className={styles.errorText}>{formErrors.companyName}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="companyDescription">Company Description (Optional)</label>
            <textarea
              id="companyDescription"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              rows="3"
            />
            {formErrors.companyDescription && <p className={styles.errorText}>{formErrors.companyDescription}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="companyLocation">Company Location</label>
            <input
              type="text"
              id="companyLocation"
              name="companyLocation"
              value={formData.companyLocation}
              onChange={handleChange}
              required
            />
            {formErrors.companyLocation && <p className={styles.errorText}>{formErrors.companyLocation}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="companyCategory">Company Category</label>
            <input
              type="text"
              id="companyCategory"
              name="companyCategory"
              value={formData.companyCategory}
              onChange={handleChange}
              required
            />
            {formErrors.companyCategory && <p className={styles.errorText}>{formErrors.companyCategory}</p>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? <Loader text="" size="small" /> : 'Register Company'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminSignup;
