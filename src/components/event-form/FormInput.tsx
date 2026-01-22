import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ error, className, ...props }) => {
  const baseClasses = "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blizbi-teal focus:border-transparent";
  const errorClasses = error ? "border-red-500" : "border-gray-300";
  
  return (
    <input
      {...props}
      className={`${baseClasses} ${errorClasses} ${className || ""}`}
    />
  );
};

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({ error, className, ...props }) => {
  const baseClasses = "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blizbi-teal focus:border-transparent";
  const errorClasses = error ? "border-red-500" : "border-gray-300";
  
  return (
    <textarea
      {...props}
      className={`${baseClasses} ${errorClasses} ${className || ""}`}
    />
  );
};

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

export const FormSelect: React.FC<FormSelectProps> = ({ error, className, children, ...props }) => {
  const baseClasses = "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blizbi-teal focus:border-transparent";
  const errorClasses = error ? "border-red-500" : "border-gray-300";
  
  return (
    <select
      {...props}
      className={`${baseClasses} ${errorClasses} ${className || ""}`}
    >
      {children}
    </select>
  );
}; 