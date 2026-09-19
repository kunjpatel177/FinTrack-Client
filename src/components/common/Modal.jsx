import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  let modalWidth = '540px';
  if (size === 'sm') modalWidth = '400px';
  if (size === 'lg') modalWidth = '750px';
  if (size === 'xl') modalWidth = '960px';

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 1060,
      }}
      onClick={onClose}
    >
      <div
        className="card-fintrack bg-white w-100 overflow-hidden"
        style={{
          maxWidth: modalWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header-clean py-3 px-4 d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-semibold">{title}</h5>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle p-2 d-flex align-items-center justify-content-center text-muted"
            style={{ width: '32px', height: '32px' }}
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto" style={{ flex: 1 }}>
          {children}
        </div>

        {footer && (
          <div className="p-3 px-4 bg-light border-top d-flex justify-content-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
