import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import companyService from '../../api/companyService'; // Corrected path
import styles from '../auth/Auth.module.css'; // Reusing auth styles for consistency
import Loader from '../../components/Loader'; // Corrected path

const CompanyRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({}); // For field-specific errors
  const [error, setError] = useState(null); // For server-side generic errors
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  // If there's no userId, the user should not be here.
  // This redirect is needed if someone tries to access this page directly
  // It's also possible to show an error message instead.
  useEffect(() => {
    if (!userId) {
      navigate('/signup'); // Redirect to signup if userId is missing
    }
  }, [userId, navigate]);


  const validateField = (name, value) => {
    let errorMessage = null;
    switch (name) {
      case 'name':
        if (!value) {
          errorMessage = 'Company name is required.';
        }
        break;
      case 'description':
        // No specific validation for description, as it's optional
        break;
      default:
        break;
    }
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field in real-time
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

  const handleSubmit = async (e) => { // Added async here
    e.preventDefault();
    setError(null);

    if (!validateFormOnSubmit()) {
      return;
    }

    if (!userId) { // Additional check before proceeding
      setError('User ID is missing. Please go through the registration process again.');
      return;
    }

    setIsLoading(true);
    try {
      const companyData = {
        ...formData,
        ownerId: userId, // Assuming the backend expects ownerId
      };
      await companyService.registerCompany(companyData);
      // After successful company registration, redirect to the login page
      navigate('/login?companyRegistered=true');
    } catch (err) {
      // 'err' now contains the standardized error object from http.js interceptor
      const errorMessage = err.message || 'Company registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
