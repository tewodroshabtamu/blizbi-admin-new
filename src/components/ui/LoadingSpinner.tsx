import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8"
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  text, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};

interface LoadingPageProps {
  message?: string;
  minHeight?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = "Loading...", 
  minHeight = "min-h-[400px]" 
}) => {
  return (
    <div className={`flex items-center justify-center ${minHeight}`}>
      <LoadingSpinner size="lg" text={message} />
    </div>
  );
}; 