import React, { useEffect } from 'react';
import './NotificationModal.css';

const NotificationModal = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto close after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification-modal-overlay">
      <div className={`notification-modal ${type}`}>
        <div className="notification-content">
          <span className="notification-icon">
            {type === 'success' ? '✓' : '⚠'}
          </span>
          <span className="notification-message">{message}</span>
          <button className="notification-close" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
