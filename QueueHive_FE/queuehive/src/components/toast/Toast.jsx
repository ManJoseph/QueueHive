import React, { useState, useCallback, useEffect } from 'react';
import './Toast.css';

const Toast = ({ id, message, type, onRemove, duration }) => {
  const [animationClass, setAnimationClass] = useState('toast-enter');

  const handleClose = useCallback(() => {
    setAnimationClass('toast-exit');
    setTimeout(() => onRemove(id), 300); // Give time for exit animation
  }, [id, onRemove]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);


  return (
    <div className={`toast toast-${type} ${animationClass}`}>
      <span>{message}</span>
      <button onClick={handleClose} className="toast-close-button">
        &times;
      </button>
    </div>
  );
};

export default Toast;
