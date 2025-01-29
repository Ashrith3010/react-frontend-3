
// Enhanced Select Components
export const Select = ({ value, onValueChange, children, className = '', disabled = false }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5
          bg-white border border-gray-200
          rounded-lg shadow-sm
          text-gray-900 text-sm
          appearance-none
          cursor-pointer
          transition-colors duration-200
          hover:border-gray-300
          focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {children}
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg 
          className="w-4 h-4 text-gray-400" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    </div>
  );
};

export const SelectItem = ({ value, children }) => {
  return (
    <option 
      value={value} 
      className="py-2 text-gray-900"
    >
      {children}
    </option>
  );
};

// SelectGroup component for organizing options
export const SelectGroup = ({ label, children }) => {
  return (
    <optgroup 
      label={label}
      className="font-semibold text-gray-900 bg-gray-50"
    >
      {children}
    </optgroup>
  );
};