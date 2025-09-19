import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { supabase } from "../../supabase-client";
import { toast } from "sonner";
import ImageUpload from "../../components/ImageUpload";
import { useEventForm } from "../../hooks/useEventForm";
import { useEventSubmission } from "../../hooks/useEventSubmission";
import { useProviders } from "../../hooks/useProviders";
import { BasicInfoSection } from "../../components/event-form/BasicInfoSection";
import { DateTimeSection } from "../../components/event-form/DateTimeSection";
import { LocationSection } from "../../components/event-form/LocationSection";
import { EventDetailsSection } from "../../components/event-form/EventDetailsSection";
import { useTranslation } from "react-i18next";

const NewEvent: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks
  const eventForm = useEventForm();
  const { isSubmitting, submitEvent } = useEventSubmission();
  const { providers, loading: loadingProviders } = useProviders();

  // Check if we're in edit mode
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  // Load existing event data if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      loadEventData(editId);
    }
  }, [isEditMode, editId]);

  const loadEventData = async (eventId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('event')
        .select(`
          id,
          title,
          provider_id,
          event_type,
          start_date,
          end_date,
          start_time,
          end_time,
          cover_url,
          price_type,
          details,
          providers!provider_id (
            id,
            name
          )
        `)
        .eq('id', eventId)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error(t("admin.new_event.event_not_found"));
      }

      eventForm.setFormDataFromEvent(data);

      if (data.cover_url) {
        setImagePreview(data.cover_url);
      }
    } catch (err) {
      console.error('Error loading event data:', err);
      const errorMessage = err instanceof Error ? err.message : t("admin.new_event.failed_to_load");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload image to storage - exactly like providers
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("event-covers")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("event-covers").getPublicUrl(fileName);

    return publicUrl;
  };

  // Handle image change - exactly like providers
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      eventForm.setFormData(prev => ({ 
        ...prev, 
        image: file // Store file for upload, like providers
      }));
    }
  };

  const handleSubmit = async () => {
    if (!eventForm.validateForm()) {
      return;
    }
    
    // Handle image upload like providers do
    let coverImage = eventForm.formData.imageUrl;
    const file = eventForm.formData.image;
    
    try {
      // If there's a new image, upload it
      if (file) {
        coverImage = await uploadImage(file);
      } else if (!isEditMode && !coverImage) {
        // Require image for new events (like providers)
        toast.error(t("admin.new_event.please_upload_image"));
        return;
      }

      // Update form data with the URL
      const updatedFormData = {
        ...eventForm.formData,
        imageUrl: coverImage || '' // Use uploaded URL or empty string
      };
      
      await submitEvent(updatedFormData, providers, isEditMode, editId || undefined);
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(t("admin.new_event.failed_to_upload_image"));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">{t("admin.new_event.loading_event_data")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/events"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("admin.new_event.back_to_events")}</span>
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? t("admin.new_event.edit_event") : t("admin.new_event.create_new_event")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? t("admin.new_event.update_event_info") : t("admin.new_event.add_new_event")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="!bg-blizbi-teal hover:!bg-blizbi-teal/90 !text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting 
              ? (isEditMode ? t("admin.new_event.updating") : t("admin.new_event.creating")) 
              : (isEditMode ? t("admin.new_event.update_event") : t("admin.new_event.create_event"))
            }
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">{t("admin.new_event.event_cover_image")}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t("admin.new_event.cover_image_description")}
                </p>
              </div>
              <ImageUpload
              imagePreview={imagePreview || eventForm.formData.imageUrl}
                onImageChange={handleImageChange}
              />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoSection
              formData={eventForm.formData}
              errors={eventForm.errors}
              providers={providers}
              loadingProviders={loadingProviders}
              onInputChange={eventForm.handleInputChange}
            />

            <DateTimeSection
              formData={eventForm.formData}
              errors={eventForm.errors}
              onInputChange={eventForm.handleInputChange}
            />

            <LocationSection
              formData={eventForm.formData}
              errors={eventForm.errors}
              onInputChange={eventForm.handleInputChange}
            />
          </div>

          <div className="space-y-6">
            <EventDetailsSection
              formData={eventForm.formData}
              errors={eventForm.errors}
              currentTag={eventForm.currentTag}
              onInputChange={eventForm.handleInputChange}
              onCurrentTagChange={eventForm.setCurrentTag}
              onAddTag={eventForm.addTag}
              onRemoveTag={eventForm.removeTag}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewEvent;
