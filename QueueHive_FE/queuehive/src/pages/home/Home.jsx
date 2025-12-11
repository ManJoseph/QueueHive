import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import companyService from '../../api/companyService';
import CompanyCard from '../../components/CompanyCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import styles from './Home.module.css'; // I will create/update this file next
import { FaSearch } from 'react-icons/fa'; // Import search icon

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await companyService.getApprovedCompanies();
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch companies.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = companies.filter(company =>
      company.name.toLowerCase().includes(lowerCaseQuery) ||
      company.description.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredCompanies(results);
  }, [searchQuery, companies]);

  const handleSelectCompany = (companyId) => {
    navigate(`/user/company/${companyId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>QueueHive</Link>
        </div>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <nav className={styles.navLinks}>
          <Link to="/login" className={styles.navLink}>Log In</Link>
          <Link to="/signup" className={styles.signupButton}>Sign Up</Link>
        </nav>
      </header>

      <main className={styles.mainContent}>
        {isLoading ? (
          <Loader text="Loading companies..." />
        ) : error ? (
          <div className={styles.errorText}>{error}</div>
        ) : filteredCompanies.length > 0 ? (
          <div className={styles.companyGrid}>
            {filteredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} onSelectCompany={handleSelectCompany} />
            ))}
          </div>
        ) : (
          <EmptyState message="No companies found matching your search." />
        )}
      </main>
    </div>
  );
};

export default Home;
