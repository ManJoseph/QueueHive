import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendar } from 'react-icons/fa';
import { useToast } from '../../components/toast/useToast';
import Loader from '../../components/Loader';
import styles from './AdminManagement.module.css';
import adminService from '../../api/adminService';

const TokensManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    served: 0
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    filterTokens();
    calculateStats();
  }, [searchQuery, statusFilter, dateFilter, tokens]);

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllTokens();
      setTokens(response.data);
    } catch (error) {
      showToast('Failed to load tokens', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTokens = () => {
    let filtered = tokens;

    if (searchQuery) {
      filtered = filtered.filter(token =>
        token.serviceType?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.tokenNumber.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(token => token.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(token => 
        token.createdAt?.startsWith(dateFilter)
      );
    }

    setFilteredTokens(filtered);
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    setStats({
      total: tokens.length,
      today: tokens.filter(t => t.createdAt?.startsWith(today)).length,
      pending: tokens.filter(t => t.status === 'PENDING').length,
      served: tokens.filter(t => t.status === 'SERVED').length
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SERVED':
        return styles.statusServed;
      case 'CALLING':
        return styles.statusCalling;
      case 'PENDING':
        return styles.statusPending;
      case 'CANCELLED':
        return styles.statusCancelled;
      case 'SKIPPED':
        return styles.statusSkipped;
      default:
        return '';
    }
  };

  if (isLoading) {
    return <Loader text="Loading tokens..." />;
  }

  return (
    <div className={styles.managementContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tokens Management</h1>
          <p className={styles.subtitle}>View and monitor all queue tokens</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Tokens</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.today}</div>
            <div className={styles.statLabel}>Today</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.pending}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.served}</div>
            <div className={styles.statLabel}>Served</div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by user, company, or token number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <FaCalendar className={styles.filterIcon} />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={styles.dateInput}
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
            <option value="PENDING">Pending</option>
            <option value="CALLING">Calling</option>
            <option value="SERVED">Served</option>
            <option value="SKIPPED">Skipped</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filteredTokens.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Token #</th>
                <th>User ID</th>
                <th>Company</th>
                <th>Service</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token) => (
                <tr key={token.id}>
                  <td className={styles.tokenNumber}>{token.tokenNumber}</td>
                  <td>{token.userId}</td>
                  <td>{token.serviceType?.companyName || 'N/A'}</td>
                  <td>{token.serviceType?.name || 'N/A'}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(token.status)}`}>
                      {token.status}
                    </span>
                  </td>
                  <td>{new Date(token.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>No tokens found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokensManagement;
