import React from 'react';
import { FaInbox } from 'react-icons/fa';

const EmptyState = ({
  icon: Icon = FaInbox,
  title = 'No data found',
  description = 'There are currently no records to display.',
  actionText,
  onAction,
}) => {
  return (
    <div className="card-fintrack p-5 text-center my-4">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 mx-auto"
        style={{ width: '64px', height: '64px', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '1.75rem' }}
      >
        <Icon />
      </div>
      <h5 className="fw-semibold mb-2">{title}</h5>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '420px', fontSize: '0.925rem' }}>
        {description}
      </p>
      {actionText && onAction && (
        <div>
          <button onClick={onAction} className="btn btn-primary-custom px-4">
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
