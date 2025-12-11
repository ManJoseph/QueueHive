import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../api/authService';
import styles from './Signup.module.css';
import Loader from '../../components/Loader';
import { useToast } from '../../components/toast/useToast'; // Import useToast

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER', // Default role
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateField = (name, value, currentFormData) => {
    let error = null;
    switch (name) {
      case 'fullName':
        if (!value) {
          error = 'Full name cannot be blank.';
        }
        break;
      case 'email':
        if (!value) {
          error = 'Email cannot be blank.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Phone number cannot be blank.';
        }
        // Basic phone number validation, can be enhanced
        break;
      case 'password':
        if (!value) {
          error = 'Password cannot be blank.';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Confirm password cannot be blank.';
        } else if (value !== currentFormData.password) {
          error = 'Passwords do not match.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value }; // Create updated form data

    setFormData(updatedFormData); // Set form data first

    // Validate field in real-time, passing the correctly updated form data for cross-field validation
    const error = validateField(name, value, updatedFormData);
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // This function will validate all fields for form submission
  const validateFormOnSubmit = () => {
    let errors = {};
    let isValid = true;
    for (const key in formData) {
      if (key !== 'role') { // Exclude role from validation here if it has a default
        const error = validateField(key, formData[key], formData);
        if (error) {
          errors[key] = error;
          isValid = false;
        }
      }
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFormOnSubmit()) {
      showToast('Please correct the form errors.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { fullName, email, phone, password, role } = formData;
      
      if (role === 'COMPANY_ADMIN') {
        navigate('/signup/company-admin', { state: { fullName, email, phone, password } });
      } else {
        await authService.register({ fullName, email, phone, password, role });
        showToast('Registration successful! Please log in.', 'success');
        navigate('/login?registered=true');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Create an Account</h2>
        <p className={styles.subtitle}>Join QueueHive today!</p>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
            />
            {formErrors.fullName && <p className={styles.errorText}>{formErrors.fullName}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            {formErrors.email && <p className={styles.errorText}>{formErrors.email}</p>}
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
              autoComplete="tel"
            />
            {formErrors.phone && <p className={styles.errorText}>{formErrors.phone}</p>}
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
              autoComplete="new-password"
            />
            {formErrors.password && <p className={styles.errorText}>{formErrors.password}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            {formErrors.confirmPassword && <p className={styles.errorText}>{formErrors.confirmPassword}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="role">I am a...</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="USER">User</option>
                <option value="COMPANY_ADMIN">Company Admin</option>
              </select>
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? <Loader text="" size="small" /> : 'Create Account'}
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

export default Signup;
