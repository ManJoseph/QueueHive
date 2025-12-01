import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './auth/Auth.module.css';
import Loader from '../../components/Loader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    // In a real app, you would call an API service here.
    // e.g., await authService.forgotPassword({ email });
    console.log(`Password reset requested for: ${email}`);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage('If an account with that email exists, a password reset link has been sent.');
    }, 1500);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email and we'll send you a link to reset your password.
        </p>
        
        {error && <div className={styles.errorBanner}>{error}</div>}
        {message && <div className={`${styles.errorBanner} ${styles.successBanner}`}>{message}</div>}

        {!message && (
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? <Loader text="" size="small" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <p>
            Remembered your password? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
