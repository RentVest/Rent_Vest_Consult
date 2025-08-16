'use client';

import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">Loading consulting data...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;