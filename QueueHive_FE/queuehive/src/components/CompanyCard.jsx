import React from 'react';
import styles from './CompanyCard.module.css';

const CompanyCard = ({ company }) => {
  const { name, category } = company;

  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}></div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardCategory}>{category}</p>
        <button className={styles.cardButton}>View Services</button>
      </div>
    </div>
  );
};

export default CompanyCard;
