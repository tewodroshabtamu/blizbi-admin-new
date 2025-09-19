import React from "react";
import { Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { FormField } from "./FormField";
import { FormInput } from "./FormInput";
import { EventFormData } from "../../hooks/useEventForm";
import { useTranslation } from "react-i18next";

interface DateTimeSectionProps {
  formData: EventFormData;
  errors: Partial<EventFormData>;
  onInputChange: (field: keyof EventFormData, value: string) => void;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const { t, i18n } = useTranslation();

  // Get the appropriate locale for native inputs
  const getLocale = () => {
    switch (i18n.language) {
      case "no":
        return "nb-NO"; // Norwegian Bokmål
      default:
        return "en-US"; // English (default)
    }
  };

  // Additional locale attributes for better browser support
  const getLocaleAttributes = () => {
    const locale = getLocale();
    return {
      lang: locale,
      'data-locale': locale,
      dir: 'ltr' // left-to-right for both Norwegian and English
    };
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blizbi-teal" />
        {t("admin.new_event.date_time")}
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("admin.new_event.start_date")} required error={errors.startDate}>
            <FormInput
              type="date"
              value={formData.startDate}
              onChange={(e) => onInputChange("startDate", e.target.value)}
              error={!!errors.startDate}
              {...getLocaleAttributes()}
            />
          </FormField>

          <FormField label={t("admin.new_event.start_time")} required error={errors.startTime}>
            <FormInput
              type="time"
              value={formData.startTime}
              onChange={(e) => onInputChange("startTime", e.target.value)}
              error={!!errors.startTime}
              {...getLocaleAttributes()}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("admin.new_event.end_date")} error={errors.endDate}>
            <FormInput
              type="date"
              value={formData.endDate}
              onChange={(e) => onInputChange("endDate", e.target.value)}
              min={formData.startDate}
              error={!!errors.endDate}
              {...getLocaleAttributes()}
            />
          </FormField>

          <FormField label={t("admin.new_event.end_time")} error={errors.endTime}>
            <FormInput
              type="time"
              value={formData.endTime}
              onChange={(e) => onInputChange("endTime", e.target.value)}
              error={!!errors.endTime}
              {...getLocaleAttributes()}
            />
          </FormField>
        </div>
      </div>
    </Card>
  );
}; 