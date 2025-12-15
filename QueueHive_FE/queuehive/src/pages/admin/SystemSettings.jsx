import React, { useState, useEffect, useCallback } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave } from 'react-icons/fa';
import { useToast } from '../../components/toast/useToast';
import userService from '../../api/userService';
import Loader from '../../components/Loader';
import styles from './SystemSettings.module.css';

const SystemSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { showToast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      showToast('Failed to load profile', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    console.log('Updating profile with data:', { fullName: profile.fullName, phoneNumber: profile.phone });
    console.log('Current token:', localStorage.getItem('token'));
    
    try {
      setIsSaving(true);
      const response = await userService.updateProfile({
        fullName: profile.fullName,
        phoneNumber: profile.phone  // Changed from 'phone' to 'phoneNumber'
      });
      console.log('Profile update response:', response);
      showToast('Profile updated successfully', 'success');
      // Refetch profile to show updated data
      await fetchProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error response:', error.response);
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setIsSaving(true);
      // Assuming we need to get the user ID from the profile
      await userService.updatePassword(profile.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showToast('Password updated successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showToast(error.message || 'Failed to update password', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading profile..." />;
  }

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Profile Settings</h1>
        <p className={styles.subtitle}>Manage your account information and security</p>
      </div>

      <div className={styles.settingsGrid}>
        {/* Profile Information Card */}
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <FaUser className={styles.cardIcon} />
            <h3>Profile Information</h3>
          </div>
          <form onSubmit={handleUpdateProfile} className={styles.cardContent}>
            <div className={styles.settingItem}>
              <label>
                <FaUser className={styles.inputIcon} />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className={styles.settingItem}>
              <label>
                <FaEnvelope className={styles.inputIcon} />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={styles.disabledInput}
              />
              <small className={styles.helpText}>Email cannot be changed</small>
            </div>
            <div className={styles.settingItem}>
              <label>
                <FaPhone className={styles.inputIcon} />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className={styles.settingItem}>
              <label>Role</label>
              <input
                type="text"
                value={profile.role}
                disabled
                className={styles.disabledInput}
              />
            </div>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isSaving}
            >
              <FaSave /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <FaLock className={styles.cardIcon} />
            <h3>Change Password</h3>
          </div>
          <form onSubmit={handleUpdatePassword} className={styles.cardContent}>
            <div className={styles.settingItem}>
              <label>
                <FaLock className={styles.inputIcon} />
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className={styles.settingItem}>
              <label>
                <FaLock className={styles.inputIcon} />
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
              <small className={styles.helpText}>Minimum 6 characters</small>
            </div>
            <div className={styles.settingItem}>
              <label>
                <FaLock className={styles.inputIcon} />
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isSaving}
            >
              <FaLock /> {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
