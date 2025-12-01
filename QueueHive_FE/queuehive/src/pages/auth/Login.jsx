import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../api/authService'; // Updated path
import styles from './Auth.module.css'; // Shared CSS module for auth pages
import Loader from '../../components/Loader';
// import { jwtDecode } from 'jwt-decode'; // No longer needed here as AuthProvider handles decoding
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({}); // For field-specific errors
  const [error, setError] = useState(null); // For server-side generic errors
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth(); // Rename login to avoid conflict with local var
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email cannot be blank.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password cannot be blank.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field in real-time
    const error = validateField(name, value);
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateFormOnSubmit = () => {
    let errors = {};
    let isValid = true;
    for (const key in formData) {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear server error on new submission attempt

    if (!validateFormOnSubmit()) {
      return;
    }

    setIsLoading(true);
    try {
      const { token, role, userId, companyId } = await authService.login(formData); // Receive full LoginResponse

      // Validate token
      if (!token || typeof token !== "string") {
        setError('Login successful, but received an invalid token format.');
        setIsLoading(false);
        return;
      }

      // Use AuthContext's login method to set global state and local storage
      authLogin(token, role, userId, companyId);

      // Redirect based on role
      switch (role) { // Use role directly from response
        case 'USER':
          navigate('/user/dashboard');
          break;
        case 'COMPANY_ADMIN':
          navigate('/company/dashboard');
          break;
        case 'SUPER_ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/'); // Fallback
      }
    } catch (err) {
      // 'err' now contains the standardized error object from http.js interceptor
      const errorMessage = err.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Please sign in to continue.</p>
        
        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            {formErrors.password && <p className={styles.errorText}>{formErrors.password}</p>}
          </div>
          <div className={styles.actions}>
            <Link to="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? <Loader text="" size="small" /> : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
