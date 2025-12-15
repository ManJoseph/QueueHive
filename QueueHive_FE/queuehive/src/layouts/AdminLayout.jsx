import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUsers, 
  FaBuilding, 
  FaTicketAlt, 
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/companies', icon: <FaBuilding />, label: 'Companies' },
    { path: '/admin/tokens', icon: <FaTicketAlt />, label: 'Tokens' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`${styles.navItem} ${styles.logoutButton}`}
          >
            <span className={styles.navIcon}><FaSignOutAlt /></span>
            {sidebarOpen && <span className={styles.navLabel}>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <button 
          className={styles.mobileToggle} 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        
        {/* Header */}
        <header className={styles.pageHeader}>
          <div className={styles.brandSection}>
            <h1 className={styles.brandName}>QueueHive</h1>
            <p className={styles.greeting}>
              Hi, <span className={styles.adminName}>{user?.fullName || 'Admin'}</span>
            </p>
          </div>
        </header>
        
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;
