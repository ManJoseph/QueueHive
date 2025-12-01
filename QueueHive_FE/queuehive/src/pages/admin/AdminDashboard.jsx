import React, { useState, useEffect } from 'react';
import companyService from '../../api/companyService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
// import styles from './AdminDashboard.module.css'; // Will create this if needed

const AdminDashboard = () => {
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchPendingCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await companyService.getPendingCompanies();
      setPendingCompanies(response.data);
    } catch (err) {
      setError('Failed to load pending companies.');
      console.error('Error fetching pending companies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const handleApprove = async (companyId) => {
    setError(null);
    setSuccessMessage(null);
    try {
      await companyService.approveCompany(companyId);
      setSuccessMessage(`Company ${companyId} approved successfully!`);
      fetchPendingCompanies(); // Refresh the list
    } catch (err) {
      setError(`Failed to approve company ${companyId}.`);
      console.error('Error approving company:', err);
    }
  };

  const handleReject = async (companyId) => {
    setError(null);
    setSuccessMessage(null);
    try {
      await companyService.rejectCompany(companyId);
      setSuccessMessage(`Company ${companyId} rejected successfully!`);
      fetchPendingCompanies(); // Refresh the list
    } catch (err) {
      setError(`Failed to reject company ${companyId}.`);
      console.error('Error rejecting company:', err);
    }
  };

  if (isLoading) {
    return <Loader text="Loading pending companies..." />;
  }

  return (
    <div /* className={styles.dashboardContainer} */>
      <h1>Super Admin Dashboard</h1>

      {error && <EmptyState title="Error" message={error} />}
      {successMessage && <p style={{ color: 'green', marginBottom: '1rem' }}>{successMessage}</p>}

      <hr />

      <h2>Companies Awaiting Approval</h2>
      {pendingCompanies.length > 0 ? (
        <ul>
          {pendingCompanies.map(company => (
            <li key={company.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>{company.name}</h3>
              <p>{company.description}</p>
              <p>Owner ID: {company.ownerId}</p>
              <button onClick={() => handleApprove(company.id)} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Approve</button>
              <button onClick={() => handleReject(company.id)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reject</button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No Pending Companies" message="No companies are awaiting approval at the moment." />
      )}

      <hr />

      <h2>System-Wide Statistics</h2>
      {/* TODO: Add components for system-wide stats */}
      <p>Overview of system performance and usage.</p>
    </div>
  );
};

export default AdminDashboard;
