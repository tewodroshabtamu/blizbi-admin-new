import React from "react";
import { ChevronRight } from "lucide-react";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
  danger?: boolean;
  onClick?: () => void;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  href,
  danger,
  onClick,
}) => {
  const content = (
    <div
      className={`w-full flex items-center px-4 py-4 active:bg-neutral-100 transition group ${
        danger ? "" : ""
      }`}
      onClick={onClick}
    >
      <span
        className={`flex items-center justify-center w-9 h-9 rounded-full ${
          danger ? "bg-red-100" : "bg-blizbi-teal/10"
        } mr-4`}
      >
        {icon}
      </span>
      <span className="flex-1 text-left">
        <span
          className={`block text-base font-medium ${
            danger ? "text-red-600" : "text-neutral-900"
          }`}
        >
          {title}
        </span>
        {subtitle && (
          <span className="block text-xs text-neutral-500">{subtitle}</span>
        )}
      </span>
      {!danger && (
        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-blizbi-teal transition" />
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block w-full">
        {content}
      </a>
    );
  }

  return (
    <button type="button" className="block w-full text-left" onClick={onClick}>
      {content}
    </button>
  );
}; 