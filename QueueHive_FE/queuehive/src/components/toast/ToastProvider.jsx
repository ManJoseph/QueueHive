import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast'; // Import the Toast component
import './Toast.css'; // We'll create this CSS file next

export const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration + 300); // Add a small buffer for exit animation
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {ReactDOM.createPortal(
        <div className="toast-container">
          {toasts.map(({ id, message, type, duration }) => (
            <Toast key={id} id={id} message={message} type={type} duration={duration} onRemove={() => removeToast(id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
