import React from "react";
import { Card } from "../ui/card";
import { FormField } from "./FormField";
import { FormInput, FormTextArea, FormSelect } from "./FormInput";
import { EventFormData } from "../../hooks/useEventForm";
import { Database } from "../../types/supabase";
import { useTranslation } from "react-i18next";

type Provider = Database['public']['Tables']['providers']['Row'];

interface BasicInfoSectionProps {
  formData: EventFormData;
  errors: Partial<EventFormData>;
  providers: Provider[];
  loadingProviders: boolean;
  onInputChange: (field: keyof EventFormData, value: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  providers,
  loadingProviders,
  onInputChange,
}) => {
  const { t } = useTranslation();

  const categories = [
    t("admin.new_event.categories.outdoor_activities"),
    t("admin.new_event.categories.cultural_events"),
    t("admin.new_event.categories.food_dining"),
    t("admin.new_event.categories.sports_fitness"),
    t("admin.new_event.categories.arts_crafts"),
    t("admin.new_event.categories.technology"),
    t("admin.new_event.categories.music_entertainment"),
  ];

  const categoryValues = [
    "Outdoor Activities",
    "Cultural Events", 
    "Food & Dining",
    "Sports & Fitness",
    "Arts & Crafts",
    "Technology",
    "Music & Entertainment",
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("admin.new_event.basic_information")}
      </h3>
      <div className="space-y-4">
        <FormField label={t("admin.new_event.event_name")} required error={errors.name}>
          <FormInput
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder={t("admin.new_event.enter_event_name")}
            error={!!errors.name}
          />
        </FormField>

        <FormField label={t("admin.new_event.description")} required error={errors.description}>
          <FormTextArea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            rows={4}
            placeholder={t("admin.new_event.describe_event")}
            error={!!errors.description}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("admin.new_event.provider")} required error={errors.provider}>
            <FormSelect
              value={formData.provider}
              onChange={(e) => onInputChange("provider", e.target.value)}
              error={!!errors.provider}
              disabled={loadingProviders}
            >
              <option value="">
                {loadingProviders ? t("admin.new_event.loading_providers") : t("admin.new_event.select_provider")}
              </option>
              {!loadingProviders && providers.map((provider) => (
                <option key={provider.id} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label={t("admin.new_event.category")} required error={errors.category}>
            <FormSelect
              value={formData.category}
              onChange={(e) => onInputChange("category", e.target.value)}
              error={!!errors.category}
            >
              <option value="">{t("admin.new_event.select_category")}</option>
              {categories.map((category, index) => (
                <option key={categoryValues[index]} value={categoryValues[index]}>
                  {category}
                </option>
              ))}
            </FormSelect>
          </FormField>
        </div>
      </div>
    </Card>
  );
}; 