import React, { useEffect, useState } from 'react';
import EmptyState from '../../components/EmptyState.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { useToast } from '../../components/toast/useToast'; // Import useToast
import userService from '../../api/userService'; // Import userService
import styles from './Profile.module.css';

const Profile = () => {
  const { user, userId, logout, updateAuthUser } = useAuth(); // Also get updateAuthUser
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            fullName: user.fullName || '',
            email: user.email || '',
            phoneNumber: user.phone || '', // Assuming 'phone' is the field name in user object
        }));
    } else {
        // Redirect to login if no user is authenticated
        showToast('You need to be logged in to view your profile.', 'error');
        navigate('/login');
    }
  }, [user, navigate, showToast]);

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

  const handleSubmitProfileUpdate = async (e) => {
    e.preventDefault();

    let profileErrors = {};
    let profileIsValid = true;
    
    // Validate only profile fields. Password fields are handled by separate form.
    const fieldsToValidate = ['fullName', 'phoneNumber'];
    fieldsToValidate.forEach(field => {
      const errorMessage = validateField(field, formData[field], formData);
      if (errorMessage) {
        profileErrors[field] = errorMessage;
        profileIsValid = false;
      }
    });

    if (!profileIsValid) {
        setFormErrors(profileErrors);
        showToast('Please correct the form errors.', 'error');
        return;
    }

    setIsLoading(true);
    try {
      await userService.updateProfile({
        fullName: formData.fullName,
        phone: formData.phoneNumber
      });
      updateAuthUser({ fullName: formData.fullName, phone: formData.phoneNumber }); // Update AuthContext
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();

    let passwordErrors = {};
    let passwordIsValid = true;

    // Validate password fields
    const passwordFields = ['currentPassword', 'newPassword', 'confirmNewPassword'];
    passwordFields.forEach(field => {
      const errorMessage = validateField(field, formData[field], formData);
      if (errorMessage) {
        passwordErrors[field] = errorMessage;
        passwordIsValid = false;
      }
    });

    // Ensure new password is provided if current is provided and current is not blank
    if (formData.currentPassword && formData.currentPassword.length > 0 && !formData.newPassword) {
        passwordErrors.newPassword = 'New password is required to change password.';
        passwordIsValid = false;
    }
    
    if (!passwordIsValid) {
        setFormErrors(passwordErrors);
        showToast('Please correct the password errors.', 'error');
        return;
    }
    // If password fields are all blank, don't attempt to change password
    if (!formData.currentPassword && !formData.newPassword && !formData.confirmNewPassword) {
        showToast("No password change requested.", 'info');
        return;
    }


    setIsLoading(true);
    try {
      await userService.updatePassword(userId, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      showToast('Password changed successfully! Please log in again with your new password.', 'success');
      logout(); // Force re-login after password change for security
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to change password.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return <Loader />;
  }

  if (!user) { // Fallback if no user data but no error
    return <EmptyState message="No user data available." />;
  }

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>My Profile</h1>
      </header>

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
            {formErrors.confirmNewPassword && <p className={styles.errorText}>{formErrors.confirmNewPassword}</p>}
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? <Loader text="" size="small" /> : 'Change Password'}
          </button>
        </form>
      </section>


    </div>
  );
};

export default Profile;
