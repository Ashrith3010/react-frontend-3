// src/components/ui/Card.js

import React from 'react';
import './card.css';

const Card = ({ children, className = '' }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

const CardContent = ({ children, className = '' }) => {
  return <div className={`card-content ${className}`}>{children}</div>;
};

export { Card, CardContent };
