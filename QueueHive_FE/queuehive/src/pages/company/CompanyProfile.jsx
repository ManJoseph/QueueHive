import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import companyAdminService from '../../api/companyAdminService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import styles from './CompanyProfile.module.css';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    if (!companyId) {
      setError('Company ID not found. Please log in.');
      setIsLoading(false);
      return;
    }

    const fetchCompanyProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await companyAdminService.getCompanyProfile(companyId);
        setCompany(response.data);
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          location: response.data.location || '',
          category: response.data.category || ''
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch company profile.');
        // Removed logout() call, AuthProvider handles redirects on 401/403
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [companyId, navigate, logout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      setIsLoading(true);
      await companyAdminService.updateCompanyProfile(companyId, formData);
      setSuccessMessage('Company profile updated successfully!');
      setIsEditing(false);
      
      // Refresh company data
      const response = await companyAdminService.getCompanyProfile(companyId);
      setCompany(response.data);
    } catch (err) {
      setError(err.message || 'Failed to update company profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: company?.name || '',
      description: company?.description || '',
      location: company?.location || '',
      category: company?.category || ''
    });
    setError(null);
  };

  if (isLoading) { // Show loader if any loading is happening
    return <Loader />;
  }

  if (error && !company) { // Show error if no company data could be fetched initially
    return <EmptyState message={error} />;
  }

  if (!company) { // Show empty state if company is null after loading
    return <EmptyState message="No company profile data available." />;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Company Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <div className={styles.successBanner}>{successMessage}</div>
      )}

      {error && (
        <div className={styles.errorBanner}>{error}</div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Company Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Hospital">Hospital</option>
              <option value="Bank">Bank</option>
              <option value="Government Office">Government Office</option>
              <option value="School">School</option>
              <option value="Telecom">Telecom</option>
              <option value="NGO">NGO</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Company Name:</span>
            <span className={styles.value}>{company?.name}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Description:</span>
            <span className={styles.value}>{company?.description}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Location:</span>
            <span className={styles.value}>{company?.location}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Category:</span>
            <span className={styles.value}>{company?.category}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Status:</span>
            <span className={`${styles.value} ${company?.approved ? styles.approved : styles.pending}`}>
              {company?.approved ? '✓ Approved' : '⏳ Pending Approval'}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Created:</span>
            <span className={styles.value}>
              {company?.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
