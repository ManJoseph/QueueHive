import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css'; // I will create this file next

const Home = () => {
  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <h1 className={styles.logo}>QueueHive</h1>
        <nav>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/signup" className={`${styles.navLink} ${styles.signupButton}`}>Create Account</Link>
        </nav>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>Rethink Waiting.</h2>
          <p className={styles.heroSubtitle}>
            QueueHive is a smart, simple, and seamless way to manage queues.
            Book your spot from anywhere and get notified when it's your turn.
          </p>
          <div className={styles.heroActions}>
            <Link to="/signup" className={styles.ctaButton}>Get Started for Free</Link>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2025 QueueHive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
