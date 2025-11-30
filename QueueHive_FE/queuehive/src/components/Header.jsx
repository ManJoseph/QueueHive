import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        QueueHive
      </div>
      <nav className={styles.nav}>
        <a href="/" className={styles.navLink}>Home</a>
        <a href="/profile" className={styles.navLink}>Profile</a>
      </nav>
    </header>
  );
};

export default Header;
