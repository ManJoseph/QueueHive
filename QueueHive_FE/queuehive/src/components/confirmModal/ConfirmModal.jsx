import React from 'react';
import ReactDOM from 'react-dom';
import './ConfirmModal.css'; // We'll create this CSS file next

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-button confirm-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-modal-button confirm-modal-confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
