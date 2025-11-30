import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.spinner}></div>
      <p className={styles.loaderText}>{text}</p>
    </div>
  );
};

export default Loader;
