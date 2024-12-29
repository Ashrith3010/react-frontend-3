// src/components/ui/Progress.js

import React from 'react';
import './progress.css';

const Progress = ({ value, max = 100, className = '' }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={`progress ${className}`}>
      <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export { Progress };
