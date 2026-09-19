import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaArrowLeft } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4 bg-app">
      <div
        className="rounded-circle bg-primary-subtle text-primary p-4 d-inline-flex mb-3"
        style={{ fontSize: '2.5rem' }}
      >
        <FaCompass />
      </div>
      <h1 className="display-5 fw-bold text-dark mb-2">404 - Page Not Found</h1>
      <p className="text-muted lead mb-4" style={{ maxWidth: '460px' }}>
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link to="/dashboard" className="btn btn-primary-custom px-4 py-2 d-inline-flex align-items-center gap-2">
        <FaArrowLeft size={14} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
