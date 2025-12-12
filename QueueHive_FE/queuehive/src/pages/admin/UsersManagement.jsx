import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaFilter } from 'react-icons/fa';
import { useConfirmModal } from '../../components/confirmModal/useConfirmModal';
import { useToast } from '../../components/toast/useToast';
import Loader from '../../components/Loader';
import styles from './AdminManagement.module.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const { confirm } = useConfirmModal();
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await adminService.getAllUsers();
      // setUsers(response.data);
      
      // Mock data for now
      const mockUsers = [
        { id: 1, fullName: 'John Doe', email: 'john@example.com', phone: '+1234567890', role: 'USER', createdAt: '2024-01-15' },
        { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', role: 'COMPANY_ADMIN', createdAt: '2024-02-20' },
        { id: 3, fullName: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', role: 'USER', createdAt: '2024-03-10' },
        { id: 4, fullName: 'Alice Williams', email: 'alice@example.com', phone: '+1234567893', role: 'SUPER_ADMIN', createdAt: '2024-01-05' },
      ];
      setUsers(mockUsers);
    } catch (error) {
      showToast('Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId, userName) => {
    const isConfirmed = await confirm(
      'Delete User',
      `Are you sure you want to delete "${userName}"? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      // TODO: Replace with actual API call
      // await adminService.deleteUser(userId);
      
      setUsers(users.filter(user => user.id !== userId));
      showToast(`User "${userName}" deleted successfully`, 'success');
    } catch (error) {
      showToast('Failed to delete user', 'error');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return styles.roleSuperAdmin;
      case 'COMPANY_ADMIN':
        return styles.roleCompanyAdmin;
      case 'USER':
      default:
        return styles.roleUser;
    }
  };

  if (isLoading) {
    return <Loader text="Loading users..." />;
  }

  return (
    <div className={styles.managementContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users Management</h1>
          <p className={styles.subtitle}>Manage all registered users</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{users.length}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="COMPANY_ADMIN">Company Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filteredUsers.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className={styles.nameCell}>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteUser(user.id, user.fullName)}
                      title="Delete user"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
