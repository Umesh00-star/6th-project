import React, { useEffect } from "react";
import './InfoModel.css';

const InfoModal = ({
  isOpen,
  message,
  onClose,
  type = 'success',
  duration = 3000
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{iconMap[type]}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default InfoModal;
