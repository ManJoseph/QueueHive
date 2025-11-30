import React from 'react';
import styles from './ServiceModal.module.css';
import EmptyState from './EmptyState';

const ServiceModal = ({ show, onClose, services, companyName, onSelectService }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Services at {companyName}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">&times;</button>
        </div>
        <div className={styles.modalBody}>
          {services && services.length > 0 ? (
            <ul className={styles.serviceList}>
              {services.map(service => (
                <li key={service.id} className={styles.serviceItem}>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceTime}>Avg. {service.averageServiceTime} min</span>
                  </div>
                  <button 
                    className={styles.selectButton}
                    onClick={() => onSelectService(service.id)}
                    aria-label={`Select service ${service.name}`}
                  >
                    Select
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No services are currently available for this company." />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
