// src/components/ui/Alert.js

import React from 'react';
import './alert.css';

const Alert = ({ children, variant = 'info', className = '' }) => {
  return (
    <div className={`alert alert-${variant} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => {
  return <p className="alert-description">{children}</p>;
};

export { Alert, AlertDescription };
