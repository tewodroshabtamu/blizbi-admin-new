import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  required = false, 
  icon, 
  children 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {icon && <span className="flex items-center gap-2">{icon}</span>}
        {!icon && (
          <>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </>
        )}
        {icon && (
          <>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </>
        )}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}; 