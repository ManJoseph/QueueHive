import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaCheckCircle, FaTimesCircle, FaFilter } from 'react-icons/fa';
import { useConfirmModal } from '../../components/confirmModal/useConfirmModal';
import { useToast } from '../../components/toast/useToast';
import Loader from '../../components/Loader';
import styles from './AdminManagement.module.css';

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { confirm } = useConfirmModal();
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
      // TODO: Replace with actual API call
      // const response = await adminService.getAllCompanies();
      // setCompanies(response.data);
      
      // Mock data
      const mockCompanies = [
        { id: 1, name: 'Tech Solutions Inc', status: 'APPROVED', location: 'New York', category: 'Technology', adminEmail: 'admin@techsolutions.com', createdAt: '2024-01-10' },
        { id: 2, name: 'Health Care Plus', status: 'PENDING', location: 'Los Angeles', category: 'Healthcare', adminEmail: 'admin@healthcare.com', createdAt: '2024-02-15' },
        { id: 3, name: 'Food Delight', status: 'APPROVED', location: 'Chicago', category: 'Restaurant', adminEmail: 'admin@fooddelight.com', createdAt: '2024-01-20' },
        { id: 4, name: 'Auto Service Pro', status: 'REJECTED', location: 'Houston', category: 'Automotive', adminEmail: 'admin@autoservice.com', createdAt: '2024-03-01' },
      ];
      setCompanies(mockCompanies);
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
      filtered = filtered.filter(company => company.status === statusFilter);
    }

    setFilteredCompanies(filtered);
  };

  const handleApprove = async (companyId, companyName) => {
    const isConfirmed = await confirm(
      'Approve Company',
      `Are you sure you want to approve "${companyName}"?`
    );

    if (!isConfirmed) return;

    try {
      // TODO: Replace with actual API call
      // await adminService.approveCompany(companyId);
      
      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, status: 'APPROVED' } : c
      ));
      showToast(`Company "${companyName}" approved successfully`, 'success');
    } catch (error) {
      showToast('Failed to approve company', 'error');
    }
  };

  const handleReject = async (companyId, companyName) => {
    const isConfirmed = await confirm(
      'Reject Company',
      `Are you sure you want to reject "${companyName}"?`
    );

    if (!isConfirmed) return;

    try {
      // TODO: Replace with actual API call
      // await adminService.rejectCompany(companyId);
      
      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, status: 'REJECTED' } : c
      ));
      showToast(`Company "${companyName}" rejected`, 'warning');
    } catch (error) {
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
      // TODO: Replace with actual API call
      // await adminService.deleteCompany(companyId);
      
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
            <div className={styles.statValue}>{companies.filter(c => c.status === 'APPROVED').length}</div>
            <div className={styles.statLabel}>Approved</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{companies.filter(c => c.status === 'PENDING').length}</div>
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
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(company.status)}`}>
                      {company.status}
                    </span>
                  </td>
                  <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      {company.status === 'PENDING' && (
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
    </div>
  );
};

export default CompaniesManagement;
