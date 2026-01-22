import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Calendar,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { ProviderMetrics } from "@/services/dashboard";

interface ProviderMetricsSectionProps {
  providers: ProviderMetrics[];
  expandedProvider: string | null;
  onToggleExpansion: (providerId: string) => void;
}

const DetailedMetricsSection = ({ provider }: { provider: ProviderMetrics }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 space-y-6">
      {/* Recent Events */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{t("admin.dashboard.provider_recent_events")}</h4>
        {provider.recentEvents.length > 0 ? (
          <div className="space-y-4">
            {provider.recentEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.start_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    {event.category && (
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">{t("admin.dashboard.no_recent_events")}</p>
        )}
      </div>
    </div>
  );
};

export const ProviderMetricsSection: React.FC<ProviderMetricsSectionProps> = ({
  providers,
  expandedProvider,
  onToggleExpansion,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{t("admin.dashboard.provider_metrics")}</h2>

      {providers.length > 0 ? (
        providers.map((provider) => (
          <div key={provider.id} className="space-y-4">
            <Card
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onToggleExpansion(provider.id)}
            >
              <div className="space-y-6">
                {/* Provider Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500">
                      {t("admin.dashboard.active_events_summary", {
                        activeEvents: provider.activeEvents,
                        totalEvents: provider.totalEvents
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {t("admin.dashboard.active")}
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{t("admin.dashboard.total_events")}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {provider.totalEvents}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <UserCheck className="w-4 h-4" />
                      <span className="text-sm">{t("admin.dashboard.active_events")}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {provider.activeEvents}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">{t("admin.dashboard.recent_events")}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {provider.recentEvents.length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {expandedProvider === provider.id && (
              <DetailedMetricsSection provider={provider} />
            )}
          </div>
        ))
      ) : (
        <Card className="p-6">
          <div className="text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t("admin.dashboard.no_providers_title")}</h3>
            <p className="text-gray-500">{t("admin.dashboard.no_providers_description")}</p>
          </div>
        </Card>
      )}
    </div>
  );
}; 