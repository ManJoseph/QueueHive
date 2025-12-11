import { useState, useCallback } from 'react';

export const useConfirmModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const confirm = useCallback((title, message) => {
    return new Promise((resolve, reject) => {
      setModalState({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          setModalState((prevState) => ({ ...prevState, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState((prevState) => ({ ...prevState, isOpen: false }));
          resolve(false); // Resolve with false if cancelled
        },
      });
    });
  }, []);

  return {
    confirm,
    ConfirmModalProps: {
      isOpen: modalState.isOpen,
      title: modalState.title,
      message: modalState.message,
      onConfirm: modalState.onConfirm,
      onCancel: modalState.onCancel,
    },
  };
};
