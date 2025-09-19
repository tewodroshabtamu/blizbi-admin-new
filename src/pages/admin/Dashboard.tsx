import React, { useState } from "react";
import { Loader2, Users, Calendar, Eye, Building } from "lucide-react";
import {
  DashboardHeader,
  DashboardFilters,
  OverviewStatsGrid,
  ProviderMetricsSection,
  RecentEventsSection,
} from "@/components/dashboard";
import { useDashboard } from "@/hooks/useDashboard";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("30d");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  const {
    dashboardStats,
    providerMetrics,
    recentEvents,
    loading,
    error,
    refetch,
  } = useDashboard(selectedTimePeriod);

  // Filter handlers
  const handleTimePeriodChange = (period: string) => {
    setSelectedTimePeriod(period);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Drill-down handlers
  const toggleProviderExpansion = (providerId: string) => {
    setExpandedProvider(expandedProvider === providerId ? null : providerId);
  };

  // Add time period options
  const timePeriods = [
    { label: t("admin.dashboard.periods.last_7_days"), value: "7d" },
    { label: t("admin.dashboard.periods.last_30_days"), value: "30d" },
    { label: t("admin.dashboard.periods.last_3_months"), value: "3m" },
    { label: t("admin.dashboard.periods.last_6_months"), value: "6m" },
    { label: t("admin.dashboard.periods.last_year"), value: "1y" },
  ];

  // Add category options for filtering
  const categoryOptions = [
    t("admin.dashboard.categories.all"),
    "Music",
    "Festival",
    "Outdoor",
    "Technology",
    "Workshop",
    "Conference",
  ];

  // Create overview stats from real data
  const overviewStats = dashboardStats ? [
    {
      title: t("admin.dashboard.stats.total_users"),
      value: dashboardStats.totalUsers.toLocaleString(),
      change: dashboardStats.userChange,
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: t("admin.dashboard.stats.total_events"),
      value: dashboardStats.totalEvents.toLocaleString(),
      change: dashboardStats.eventChange,
      trend: "up" as const,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: t("admin.dashboard.stats.providers"),
      value: dashboardStats.totalProviders.toLocaleString(),
      icon: Building,
      color: "text-purple-600",
    },
    {
      title: t("admin.dashboard.stats.monthly_views"),
      value: dashboardStats.monthlyViews.toLocaleString(),
      change: dashboardStats.viewChange,
      trend: "down" as const,
      icon: Eye,
      color: "text-orange-600",
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{t("admin.dashboard.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={t("admin.dashboard.title")}
        subtitle={t("admin.dashboard.subtitle")}
        error={error || undefined}
        onRetry={error ? refetch : undefined}
      />

      <DashboardFilters
        timePeriods={timePeriods}
        selectedTimePeriod={selectedTimePeriod}
        onTimePeriodChange={handleTimePeriodChange}
        categories={categoryOptions}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <OverviewStatsGrid stats={overviewStats} />

      <ProviderMetricsSection
        providers={providerMetrics}
        expandedProvider={expandedProvider}
        onToggleExpansion={toggleProviderExpansion}
      />

      <RecentEventsSection events={recentEvents} />
    </div>
  );
};

export default Dashboard;
