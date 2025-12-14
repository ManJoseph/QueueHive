import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import companyService from '../../api/companyService';
import CompanyCard from '../../components/CompanyCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { 
  FaSearch, 
  FaTicketAlt, 
  FaBell, 
  FaChartLine, 
  FaClock, 
  FaUsers,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import styles from './Home.module.css';

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
      (company.description && company.description.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredCompanies(results);
  }, [searchQuery, companies]);

  const handleSelectCompany = (companyId) => {
    navigate(`/user/company/${companyId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const scrollToCompanies = () => {
    document.getElementById('companies-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <FaTicketAlt />,
      title: 'Instant Tokens',
      description: 'Get your queue token instantly without physical waiting'
    },
    {
      icon: <FaBell />,
      title: 'Real-time Updates',
      description: 'Track your queue position with live notifications'
    },
    {
      icon: <FaChartLine />,
      title: 'Analytics Dashboard',
      description: 'Businesses get insights on queue performance'
    },
    {
      icon: <FaClock />,
      title: 'Save Time',
      description: 'No more standing in long physical queues'
    }
  ];

  const steps = [
    { number: '1', title: 'Browse Companies', description: 'Find services near you' },
    { number: '2', title: 'Select Service', description: 'Choose what you need' },
    { number: '3', title: 'Get Token', description: 'Receive your queue number' },
    { number: '4', title: 'Track Position', description: 'Monitor in real-time' },
    { number: '5', title: 'Get Notified', description: 'Know when it\'s your turn' }
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.homePage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>QueueHive</Link>
        </div>
        <nav className={styles.headerNav}>
          <button onClick={() => scrollToSection('features-section')} className={styles.navLink}>
            Features
          </button>
          <button onClick={() => scrollToSection('how-it-works-section')} className={styles.navLink}>
            How It Works
          </button>
          <button onClick={() => scrollToSection('companies-section')} className={styles.navLink}>
            Companies
          </button>
        </nav>
        <nav className={styles.navLinks}>
          <Link to="/auth/login" className={styles.navLink}>Log In</Link>
          <Link to="/auth/signup" className={styles.signupButton}>Sign Up</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Skip the Line, <br />
            <span className={styles.heroAccent}>Save Your Time</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Digital queue management made simple. Get your token, track your position, and never wait in line again.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/auth/signup" className={styles.primaryButton}>
              Get Started <FaArrowRight />
            </Link>
            <button onClick={scrollToCompanies} className={styles.secondaryButton}>
              Browse Companies
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <FaUsers className={styles.statIcon} />
              <div>
                <div className={styles.statValue}>{companies.length}+</div>
                <div className={styles.statLabel}>Companies</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <FaCheckCircle className={styles.statIcon} />
              <div>
                <div className={styles.statValue}>100%</div>
                <div className={styles.statLabel}>Digital</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>What We Offer</h2>
        <p className={styles.sectionSubtitle}>Everything you need for seamless queue management</p>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.sectionSubtitle}>Get started in 5 simple steps</p>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              {index < steps.length - 1 && <div className={styles.stepArrow}><FaArrowRight /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies-section" className={styles.companiesSection}>
        <h2 className={styles.sectionTitle}>Explore Available Companies</h2>
        <p className={styles.sectionSubtitle}>Browse and join queues at your favorite businesses</p>
        
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

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
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Skip the Line?</h2>
        <p className={styles.ctaSubtitle}>Join thousands of users who save time every day</p>
        <Link to="/auth/signup" className={styles.ctaButton}>
          Create Free Account <FaArrowRight />
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3>QueueHive</h3>
            <p>Digital queue management made simple</p>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/signup">Sign Up</Link>
            <Link to="/auth/signup/company-admin">For Businesses</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 QueueHive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
