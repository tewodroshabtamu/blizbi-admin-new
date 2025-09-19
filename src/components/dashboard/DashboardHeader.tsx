import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onRetry?: () => void;
  error?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onRetry,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className={`mt-1 ${error ? "text-red-600" : "text-gray-600"}`}>
          {error ? `${t("admin.dashboard.error")}: ${error}` : subtitle}
        </p>
      </div>
      {onRetry && error && (
        <Button onClick={onRetry}>
          {t("admin.dashboard.retry")}
        </Button>
      )}
    </div>
  );
}; 