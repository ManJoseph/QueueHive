import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState = ({ message }) => {
  return (
    <div className={styles.emptyStateContainer}>
      <p className={styles.emptyStateMessage}>{message}</p>
    </div>
  );
};

export default EmptyState;
