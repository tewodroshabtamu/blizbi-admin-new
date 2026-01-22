import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { RecentEvent } from "@/services/dashboard";

interface RecentEventsSectionProps {
  events: RecentEvent[];
}

export const RecentEventsSection: React.FC<RecentEventsSectionProps> = ({ events }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{t("admin.dashboard.recent_events_section")}</h2>

      {events.length > 0 ? (
        <Card className="p-6">
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">
                    {event.provider_name} • {format(new Date(event.start_date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {event.category && (
                    <Badge variant="secondary">{event.category}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t("admin.dashboard.no_events_title")}</h3>
            <p className="text-gray-500">{t("admin.dashboard.no_events_description")}</p>
          </div>
        </Card>
      )}
    </div>
  );
}; 