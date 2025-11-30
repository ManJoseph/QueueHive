import React from 'react';
import styles from './ServiceModal.module.css';

const ServiceModal = ({ show, onClose, services, onSelectService }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Available Services for {services.length > 0 ? services[0].companyName : ''}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {services && services.length > 0 ? (
            <ul>
              {services.map(service => (
                <li key={service.id} className={styles.serviceItem}>
                  <span>{service.name} (Avg. {service.averageServiceTime} min)</span>
                  <button 
                    className={styles.selectButton}
                    onClick={() => onSelectService(service.id)}
                  >
                    Select
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No services available for this company.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
