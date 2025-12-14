import React from 'react';
import styles from './CompanyCard.module.css';

const CompanyCard = ({ company, onSelectCompany }) => {
  const { id, name, description, location, category } = company;

  return (
    <div className={styles.card} onClick={() => onSelectCompany(id)}> {/* Make card clickable */}
      <div className={styles.imagePlaceholder}><span>Company Logo</span></div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{name}</h3>
        {description && <p className={styles.cardDescription}>{description}</p>}
        {location && <p className={styles.cardLocation}>Location: {location}</p>}
        {category && <p className={styles.cardCategory}>Category: {category}</p>}
        <button className={styles.cardButton} onClick={() => onSelectCompany(id)}>View Services</button>
      </div>
    </div>
  );
};

export default CompanyCard;
