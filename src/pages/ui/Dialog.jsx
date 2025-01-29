import React from 'react';

// Dialog Components
export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog Content Wrapper */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 relative ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  return (
    <div className="mb-6 pb-4 border-b border-gray-100">
      {children}
    </div>
  );
};

export const DialogTitle = ({ children, className = '' }) => {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

// Enhanced Input Component
export const Input = ({ className = '', error, ...props }) => {
  return (
    <input
      className={`
        w-full px-4 py-2.5 
        bg-white border border-gray-200 
        rounded-lg shadow-sm
        text-gray-900 text-sm
        placeholder:text-gray-400
        transition-colors duration-200
        hover:border-gray-300
        focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10
        disabled:bg-gray-50 disabled:cursor-not-allowed
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
        ${className}
      `}
      {...props}
    />
  );
};