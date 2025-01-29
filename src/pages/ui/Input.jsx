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