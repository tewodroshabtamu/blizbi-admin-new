import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createEvent, updateEvent } from "../services/events";
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

      // Prepare the event data according to the backend API specification
      // Required fields: type, title, description, provider_id, location_id
      const eventData: any = {
        type: 'one_time', // Default to one_time as per API docs
        title: String(formData.name || ''), // Plain string
        description: String(formData.description), // Plain string
        provider_id: selectedProvider.id,
        location_id: formData.location_id,
        // Optional fields
        language: 'en',
        start_date: formData.startDate ? `${formData.startDate}T${formData.startTime || '00:00'}:00Z` : null,
        end_date: formData.endDate ? `${formData.endDate}T${formData.endTime || '23:59'}:00Z` : null,
        start_time: formData.startTime,
        end_time: formData.endTime,
        // Only include cover_url if it has a valid value (omit if null/empty)
        ...(formData.imageUrl && !formData.imageUrl.startsWith('data:') && formData.imageUrl.trim() !== ''
          ? { cover_url: formData.imageUrl }
          : {}),
        is_free: formData.priceType === 'free',
        price: formData.priceType === 'ticket_required' && formData.price ? parseFloat(formData.price) : null,
        currency_id: formData.priceType === 'ticket_required' ? 1 : null, // TODO: Add currency selection
        details: {
          address: formData.address,
          organizer: '', // TODO: Add organizer field
          link: '', // TODO: Add link field
          category: formData.category,
          capacity: formData.capacity,
          tags: formData.tags
        }
      };

      // Debug logging (optional - can be removed in production)
      console.log('Event data being sent:', JSON.stringify(eventData, null, 2));

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