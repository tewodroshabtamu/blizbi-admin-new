import React from "react";
import { MapPin } from "lucide-react";
import { Card } from "../ui/card";
import { FormField } from "./FormField";
import { FormInput } from "./FormInput";
import { EventFormData } from "../../hooks/useEventForm";
import { useTranslation } from "react-i18next";

interface LocationSectionProps {
  formData: EventFormData;
  errors: Partial<EventFormData>;
  onInputChange: (field: keyof EventFormData, value: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blizbi-teal" />
        {t("admin.new_event.location")}
      </h3>
      <div className="space-y-4">
        <FormField label={t("admin.new_event.venue_name")} required error={errors.location}>
          <FormInput
            type="text"
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
            placeholder={t("admin.new_event.venue_placeholder")}
            error={!!errors.location}
          />
        </FormField>

        <FormField label={t("admin.new_event.address")}>
          <FormInput
            type="text"
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            placeholder={t("admin.new_event.address_placeholder")}
          />
        </FormField>
      </div>
    </Card>
  );
}; 