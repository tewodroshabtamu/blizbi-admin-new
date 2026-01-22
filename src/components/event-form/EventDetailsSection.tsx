import React from "react";
import { DollarSign, Users } from "lucide-react";
import { Card } from "../ui/card";
import { FormField } from "./FormField";
import { FormInput, FormSelect } from "./FormInput";
import { TagManager } from "./TagManager";
import { EventFormData } from "../../hooks/useEventForm";
import { useTranslation } from "react-i18next";

interface EventDetailsSectionProps {
  formData: EventFormData;
  errors: Partial<EventFormData>;
  currentTag: string;
  onInputChange: (field: keyof EventFormData, value: string) => void;
  onCurrentTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  formData,
  errors,
  currentTag,
  onInputChange,
  onCurrentTagChange,
  onAddTag,
  onRemoveTag,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("admin.new_event.event_details")}
        </h3>
        <div className="space-y-4">
          <FormField label={t("admin.new_event.price_type")} icon={<DollarSign className="w-4 h-4" />}>
            <FormSelect
              value={formData.priceType}
              onChange={(e) => onInputChange("priceType", e.target.value as 'free' | 'ticket_required')}
            >
              <option value="free">{t("admin.new_event.free")}</option>
              <option value="ticket_required">{t("admin.new_event.paid_ticket_required")}</option>
            </FormSelect>
          </FormField>

          <FormField label={t("admin.new_event.price")} icon={<DollarSign className="w-4 h-4" />}>
            <FormInput
              type="text"
              value={formData.price}
              onChange={(e) => onInputChange("price", e.target.value)}
              placeholder={formData.priceType === 'free' ? t("admin.new_event.free") : t("admin.new_event.price_placeholder")}
              disabled={formData.priceType === 'free'}
            />
          </FormField>

          <FormField label={t("admin.new_event.capacity")} icon={<Users className="w-4 h-4" />}>
            <FormInput
              type="number"
              value={formData.capacity}
              onChange={(e) => onInputChange("capacity", e.target.value)}
              placeholder={t("admin.new_event.capacity_placeholder")}
            />
          </FormField>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("admin.new_event.tags")}</h3>
        <TagManager
          tags={formData.tags}
          currentTag={currentTag}
          onCurrentTagChange={onCurrentTagChange}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      </Card>
    </div>
  );
}; 