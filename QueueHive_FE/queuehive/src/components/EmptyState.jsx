import React from 'react';
import styles from './EmptyState.module.css';
import { FaRegSadTear } from 'react-icons/fa'; // Import an icon

const EmptyState = ({ message }) => {
  return (
    <div className={styles.emptyStateContainer}>
      <FaRegSadTear className={styles.emptyStateIcon} /> {/* Add the icon */}
      <p className={styles.emptyStateMessage}>{message}</p>
    </div>
  );
};

export default EmptyState;
