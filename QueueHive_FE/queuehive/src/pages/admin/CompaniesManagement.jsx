import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaCheckCircle, FaTimesCircle, FaFilter } from 'react-icons/fa';
import { useConfirmModal } from '../../components/confirmModal/useConfirmModal';
import ConfirmModal from '../../components/confirmModal/ConfirmModal';
import { useToast } from '../../components/toast/useToast';
import Loader from '../../components/Loader';
import styles from './AdminManagement.module.css';
import companyService from '../../api/companyService';

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const { confirm, ConfirmModalProps } = useConfirmModal();
  const { showToast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchQuery, statusFilter, companies]);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      // Fetch ALL companies, not just pending
      const response = await companyService.getAllCompanies();
      setCompanies(response.data);
    } catch (error) {
      showToast('Failed to load companies', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      // Filter by approved status
      if (statusFilter === 'APPROVED') {
        filtered = filtered.filter(company => company.approved === true);
      } else if (statusFilter === 'PENDING') {
        filtered = filtered.filter(company => company.approved === false);
      }
    }

    setFilteredCompanies(filtered);
  };

  const handleApprove = async (companyId, companyName) => {
    console.log('Approve button clicked for:', companyId, companyName);
    const isConfirmed = await confirm(
      'Approve Company',
      `Are you sure you want to approve "${companyName}"?`
    );

    console.log('Confirmation result:', isConfirmed);
    if (!isConfirmed) return;

    try {
      console.log('Calling approveCompany API...');
      await companyService.approveCompany(companyId);
      console.log('Company approved successfully, refetching...');
      // Refetch companies to get updated data
      await fetchCompanies();
      showToast(`Company "${companyName}" approved successfully`, 'success');
    } catch (error) {
      console.error('Error approving company:', error);
      showToast('Failed to approve company', 'error');
    }
  };

  const handleReject = async (companyId, companyName) => {
    console.log('Reject button clicked for:', companyId, companyName);
    const isConfirmed = await confirm(
      'Reject Company',
      `Are you sure you want to reject "${companyName}"?`
    );

    console.log('Confirmation result:', isConfirmed);
    if (!isConfirmed) return;

    try {
      console.log('Calling rejectCompany API...');
      await companyService.rejectCompany(companyId);
      console.log('Company rejected successfully, refetching...');
      // Refetch companies to get updated data
      await fetchCompanies();
      showToast(`Company "${companyName}" rejected`, 'warning');
    } catch (error) {
      console.error('Error rejecting company:', error);
      showToast('Failed to reject company', 'error');
    }
  };

  const handleDelete = async (companyId, companyName) => {
    const isConfirmed = await confirm(
      'Delete Company',
      `Are you sure you want to delete "${companyName}"? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      await companyService.deleteCompany(companyId);
      setCompanies(companies.filter(c => c.id !== companyId));
      showToast(`Company "${companyName}" deleted successfully`, 'success');
    } catch (error) {
      showToast('Failed to delete company', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return styles.statusApproved;
      case 'PENDING':
        return styles.statusPending;
      case 'REJECTED':
        return styles.statusRejected;
      default:
        return '';
    }
  };

  if (isLoading) {
    return <Loader text="Loading companies..." />;
  }

  return (
    <div className={styles.managementContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Companies Management</h1>
          <p className={styles.subtitle}>Manage all registered companies</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{companies.filter(c => c.approved).length}</div>
            <div className={styles.statLabel}>Approved</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{companies.filter(c => !c.approved).length}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, location, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filteredCompanies.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Company Name</th>
                <th>Location</th>
                <th>Category</th>
                <th>Admin Email</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td className={styles.nameCell}>{company.name}</td>
                  <td>{company.location}</td>
                  <td>{company.category}</td>
                  <td>{company.adminEmail}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(company.approved ? 'APPROVED' : 'PENDING')}`}>
                      {company.approved ? 'APPROVED' : 'PENDING'}
                    </span>
                  </td>
                  <td>{new Date(company.createdAt).toLocaleString()}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      {!company.approved && (
                        <>
                          <button
                            className={styles.approveButton}
                            onClick={() => handleApprove(company.id, company.name)}
                            title="Approve company"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={() => handleReject(company.id, company.name)}
                            title="Reject company"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(company.id, company.name)}
                        title="Delete company"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>No companies found matching your criteria</p>
          </div>
        )}
      </div>
      <ConfirmModal {...ConfirmModalProps} />
    </div>
  );
};

export default CompaniesManagement;
