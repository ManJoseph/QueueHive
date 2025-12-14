import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';
import Loader from '../../components/Loader';
import { useToast } from '../../components/toast/useToast'; // Import useToast

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    setIsLoading(true);
    // In a real app, you would call an API service here.
    // e.g., await authService.forgotPassword({ email });
    console.log(`Password reset requested for: ${email}`);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showToast('If an account with that email exists, a password reset link has been sent.', 'success');
    }, 1500);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email and we'll send you a link to reset your password.
        </p>
        
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
