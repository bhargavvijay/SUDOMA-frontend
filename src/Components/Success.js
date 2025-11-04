import React from 'react';
import './SuccessPage.css';

const SuccessPage = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className="success-title">ART Bank Added</h1>
        <p className="success-message">
          Your new ART Bank has been successfully created. 
          You'll be redirected to the Manage ART Banks page momentarily.
        </p>
        <div className="success-redirect">
          Redirecting...
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;