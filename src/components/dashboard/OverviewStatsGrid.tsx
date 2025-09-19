import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OverviewStat {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  color: string;
}

interface OverviewStatsGridProps {
  stats: OverviewStat[];
}

export const OverviewStatsGrid: React.FC<OverviewStatsGridProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
              {stat.trend && stat.change && (
                <div className="flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    {t("admin.dashboard.vs_last_month")}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 