import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../api/userService';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import MyQueues from '../../components/MyQueues';
import Loader from '../../components/Loader';
import styles from './Profile.module.css'; // Create this CSS module

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await userService.getUserProfile();
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          phoneNumber: response.data.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch user profile.');
        // Optionally redirect to login if unauthorized
        if (err.statusCode === 401 || err.statusCode === 403) {
          authService.logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const validateField = (name, value, currentFormData) => {
    let errorMessage = null;
    switch (name) {
      case 'fullName':
        if (value && value.length < 3) errorMessage = 'Full name must be at least 3 characters.';
        break;
      case 'phoneNumber':
        if (value && !/^\+?[0-9\s-()]{7,20}$/.test(value)) errorMessage = 'Invalid phone number format.';
        break;
      case 'currentPassword':
        if (currentFormData.newPassword && !value) errorMessage = 'Current password is required to change password.';
        break;
      case 'newPassword':
        if (value && value.length < 8) errorMessage = 'New password must be at least 8 characters long.';
        else if (value && currentFormData.currentPassword && value === currentFormData.currentPassword) errorMessage = 'New password cannot be the same as current password.';
        break;
      case 'confirmNewPassword':
        if (currentFormData.newPassword && !value) errorMessage = 'Please confirm new password.';
        else if (value !== currentFormData.newPassword) errorMessage = 'New passwords do not match.';
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
    for (const key in formData) {
      if (['fullName', 'phoneNumber'].includes(key) && !formData[key]) continue; // Allow these to be blank if not changed
      const errorMessage = validateField(key, formData[key], formData);
      if (errorMessage) {
        errors[key] = errorMessage;
        isValid = false;
      }
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Only validate relevant fields for profile update, not password fields
    let profileErrors = {};
    let profileIsValid = true;
    if (validateField('fullName', formData.fullName, formData)) {
      profileErrors.fullName = validateField('fullName', formData.fullName, formData);
      profileIsValid = false;
    }
    if (validateField('phoneNumber', formData.phoneNumber, formData)) {
      profileErrors.phoneNumber = validateField('phoneNumber', formData.phoneNumber, formData);
      profileIsValid = false;
    }

    // Only allow profile update if no password change is attempted
    if (formData.currentPassword || formData.newPassword || formData.confirmNewPassword) {
        profileIsValid = false; // Prevent profile update if password fields are touched, force password update
        profileErrors.general = "Please use the 'Change Password' button for password modifications.";
    }

    if (!profileIsValid) {
        setFormErrors(profileErrors);
        return;
    }

    setIsLoading(true);
    try {
      const updatePayload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      };
      const response = await userService.updateUserProfile(updatePayload);
      setUser(response.data); // Update local user state
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    let passwordErrors = {};
    let passwordIsValid = true;

    if (validateField('currentPassword', formData.currentPassword, formData)) {
        passwordErrors.currentPassword = validateField('currentPassword', formData.currentPassword, formData);
        passwordIsValid = false;
    }
    if (validateField('newPassword', formData.newPassword, formData)) {
        passwordErrors.newPassword = validateField('newPassword', formData.newPassword, formData);
        passwordIsValid = false;
    }
    if (validateField('confirmNewPassword', formData.confirmNewPassword, formData)) {
        passwordErrors.confirmNewPassword = validateField('confirmNewPassword', formData.confirmNewPassword, formData);
        passwordIsValid = false;
    }
    
    // Ensure new password is provided and different if current is provided
    if (formData.currentPassword && !formData.newPassword) {
        passwordErrors.newPassword = 'New password is required.';
        passwordIsValid = false;
    }
    // Ensure new password is provided if current is provided and current is not blank
    if (formData.currentPassword && formData.currentPassword.length > 0 && !formData.newPassword) {
        passwordErrors.newPassword = 'New password is required to change password.';
        passwordIsValid = false;
    }


    if (!passwordIsValid) {
        setFormErrors(passwordErrors);
        return;
    }
    // If password fields are all blank, don't attempt to change password
    if (!formData.currentPassword && !formData.newPassword && !formData.confirmNewPassword) {
        setError("No password change requested.");
        return;
    }


    setIsLoading(true);
    try {
      const updatePayload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      const response = await userService.updateUserProfile(updatePayload);
      setUser(response.data); // Update local user state
      setSuccessMessage('Password updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' })); // Clear password fields
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = () => {
    logout(); // Use AuthContext's logout
    navigate('/login');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error && !user) { // Only show global error if user data couldn't be fetched
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) { // Fallback if no user data but no error
    return <div className={styles.emptyState}>No user data available.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>My Profile</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}
      {successMessage && <div className={`${styles.successBanner}`}>{successMessage}</div>}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>User Information</h2>
        <div className={styles.userInfo}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <form onSubmit={handleSubmitProfileUpdate} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            {formErrors.fullName && <p className={styles.errorText}>{formErrors.fullName}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {formErrors.phoneNumber && <p className={styles.errorText}>{formErrors.phoneNumber}</p>}
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? <Loader text="" size="small" /> : 'Update Profile'}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Change Password</h2>
        <form onSubmit={handleSubmitPasswordChange} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            {formErrors.currentPassword && <p className={styles.errorText}>{formErrors.currentPassword}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {formErrors.newPassword && <p className={styles.errorText}>{formErrors.newPassword}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
            {formErrors.confirmNewPassword && <p className className={styles.errorText}>{formErrors.confirmNewPassword}</p>}
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? <Loader text="" size="small" /> : 'Change Password'}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <MyQueues />
      </section>
    </div>
  );
};

export default Profile;
