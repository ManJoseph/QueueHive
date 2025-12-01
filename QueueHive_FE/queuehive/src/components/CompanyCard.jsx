import React from 'react';
import styles from './CompanyCard.module.css';

const CompanyCard = ({ company, onSelectCompany }) => {
  const { id, name, description } = company; // Updated to description

  return (
    <div className={styles.card} onClick={() => onSelectCompany(id)}> {/* Make card clickable */}
      <div className={styles.imagePlaceholder}></div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardCategory}>{description}</p> {/* Changed to description */}
        <button className={styles.cardButton} onClick={() => onSelectCompany(id)}>View Services</button>
      </div>
    </div>
  );
};

export default CompanyCard;
