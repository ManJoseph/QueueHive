import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path
import styles from './NavBar.module.css'; // Create this CSS module

// Icons (example, will add more as needed)
import { FaHome, FaUser, FaBuilding, FaChartBar, FaCogs, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';

const NavBar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserNavLinks = () => (
    <>
      <li><Link to="/user/dashboard" className={styles.navLink}><MdOutlineDashboard className={styles.navIcon} /> <span>Dashboard</span></Link></li>
      <li><Link to="/user/profile" className={styles.navLink}><FaUser className={styles.navIcon} /> <span>Profile</span></Link></li>
    </>
  );

  const getCompanyAdminNavLinks = () => (
    <>
      <li><Link to="/company/dashboard" className={styles.navLink}><MdOutlineDashboard className={styles.navIcon} /> <span>Dashboard</span></Link></li>
      <li><Link to="/company/manage-services" className={styles.navLink}><FaCogs className={styles.navIcon} /> <span>Services</span></Link></li>
      <li><Link to="/company/analytics" className={styles.navLink}><FaChartBar className={styles.navIcon} /> <span>Analytics</span></Link></li>
      <li><Link to="/company/profile-settings" className={styles.navLink}><FaBuilding className={styles.navIcon} /> <span>Company Profile</span></Link></li>
      {/* Add queue management links, e.g., for specific services */}
    </>
  );

  const getPublicNavLinks = () => (
    <>
      <li><Link to="/" className={styles.navLink}><FaHome className={styles.navIcon} /> <span>Home</span></Link></li>
      <li><Link to="/login" className={styles.navLink}><FaSignInAlt className={styles.navIcon} /> <span>Login</span></Link></li>
      <li><Link to="/signup" className={styles.navLink}><FaUserPlus className={styles.navIcon} /> <span>Sign Up</span></Link></li>
      <li><Link to="/signup/company-admin" className={styles.navLink}><FaBuilding className={styles.navIcon} /> <span>Company Admin Sign Up</span></Link></li>
    </>
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to={isAuthenticated ? (role === 'USER' ? "/user/dashboard" : (role === 'COMPANY_ADMIN' ? "/company/dashboard" : (role === 'SUPER_ADMIN' ? "/admin/dashboard" : "/"))) : "/"}>QueueHive</Link>
      </div>
      <ul className={styles.navList}>
        {isAuthenticated ? (
          <>
            {role === 'USER' && getUserNavLinks()}
            {role === 'COMPANY_ADMIN' && getCompanyAdminNavLinks()}
            {role === 'SUPER_ADMIN' && <li><Link to="/admin/dashboard" className={styles.navLink}><MdOutlineDashboard className={styles.navIcon} /> <span>Admin Dashboard</span></Link></li>}
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <FaSignOutAlt className={styles.navIcon} /> <span>Logout</span>
              </button>
            </li>
          </>
        ) : (
          getPublicNavLinks()
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
