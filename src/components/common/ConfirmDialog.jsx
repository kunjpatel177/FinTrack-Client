import React from 'react';
import Modal from './Modal';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            className="btn btn-light px-3 fw-medium"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-${confirmVariant} px-3 fw-medium`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="d-flex align-items-start gap-3">
        <div
          className="rounded-circle p-3 d-flex align-items-center justify-content-center text-danger bg-danger-subtle flex-shrink-0"
          style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}
        >
          <FaExclamationTriangle />
        </div>
        <div>
          <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
