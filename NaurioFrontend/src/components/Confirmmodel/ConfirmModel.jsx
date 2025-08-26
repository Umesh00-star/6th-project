import React, { useState } from "react";
import './ConfirmModel.css';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure you want to proceed?",
  title = "Confirm Action",
  confirmText = "Yes",
  cancelText = "Cancel",
  successMessage = null,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    if (successMessage) {
      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
        onClose();
      }, 2000);
    } else {
      onClose();
    }
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal modern">
        {!confirmed ? (
          <>
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="confirm-buttons">
              <button onClick={onClose} className="cancel-btn">
                {cancelText}
              </button>
              <button onClick={handleConfirm} className="confirm-btn">
                {confirmText}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="info-icon">✅</div>
            <h3>{successMessage}</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
