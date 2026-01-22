import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createEvent, updateEvent, EventData } from "../services/events";
import { ProviderData } from "../services/providers";
import { EventFormData } from "./useEventForm";

export const useEventSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitEvent = useCallback(async (
    formData: EventFormData,
    providers: ProviderData[],
    isEditMode: boolean,
    editId?: string
  ) => {
    setIsSubmitting(true);

    try {
      // Find the provider ID from the selected provider name
      const selectedProvider = providers.find(p => p.name === formData.provider);

      if (!selectedProvider) {
        toast.error('Please select a valid provider');
        return;
      }

      // Prepare the event data according to the API schema
      const eventData: Partial<EventData> = {
        title: formData.name,
        provider_id: selectedProvider.id,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate || null,
        image_url: formData.imageUrl || undefined,
        // Note: API might have different field names - adjust based on actual API
        // location_id, price_type, etc. may need to be mapped differently
      };

      if (isEditMode && editId) {
        // Update existing event
        await updateEvent(editId, eventData);
        toast.success('Event updated successfully!');
      } else {
        // Create new event
        await createEvent(eventData);
        toast.success('Event created successfully!');
      }

      // Trigger a refresh of providers data if needed
      window.dispatchEvent(new CustomEvent('refreshProviders'));

      navigate('/admin/events');
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} event: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate]);

  return {
    isSubmitting,
    submitEvent,
  };
}; 