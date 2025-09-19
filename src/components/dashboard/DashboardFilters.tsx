import React from "react";
import { Filter, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FilterOption {
  label: string;
  value: string;
}

interface DashboardFiltersProps {
  timePeriods: FilterOption[];
  selectedTimePeriod: string;
  onTimePeriodChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  timePeriods,
  selectedTimePeriod,
  onTimePeriodChange,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{t("admin.dashboard.filters")}:</span>
        </div>
        
        {/* Time Period Filter */}
        <div className="relative">
          <select
            value={selectedTimePeriod}
            onChange={(e) => onTimePeriodChange(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timePeriods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}; 