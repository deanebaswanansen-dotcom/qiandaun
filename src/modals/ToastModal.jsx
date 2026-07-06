import React from 'react';

export default function ToastModal({ show, onClose }) {
  return (
    <div className={`toast-modal ${show ? 'show' : ''}`} id="toastModal">
      <div className="toast-content">
        <span className="toast-icon">👑</span>
        <div className="toast-text">
          <h4>契约已达成！</h4>
          <p>您的公测资格与预约奖励已预留，我们在白垩之都等您！</p>
        </div>
        <button className="toast-close" id="closeToast" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}
