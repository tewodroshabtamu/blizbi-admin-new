import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../lib/supabase-client";
import { Database } from "../types/supabase";
import { EventFormData } from "./useEventForm";

type Provider = Database['public']['Tables']['providers']['Row'];

export const useEventSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitEvent = useCallback(async (
    formData: EventFormData,
    providers: Provider[],
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

      // Prepare the event data according to the database schema
      const eventData = {
        title: formData.name,
        provider_id: selectedProvider.id,
        event_type: 'event' as const,
        start_date: formData.startDate,
        end_date: formData.endDate || null,
        start_time: formData.startTime,
        end_time: formData.endTime || null,
        cover_url: formData.imageUrl || '',
        price_type: formData.priceType === 'ticket_required' ? 'paid' as const : 'free' as const,
        price_amount: formData.priceType === 'ticket_required' && formData.price ? parseFloat(formData.price) : null,
        details: {
          description: formData.description,
          location: formData.location,
          address: formData.address,
          category: formData.category,
          price: formData.price,
          capacity: formData.capacity,
          tags: formData.tags,
        }
      };

      if (isEditMode && editId) {
        // Update existing event
        const { error } = await supabase
          .from('event')
          .update({
            ...eventData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editId);

        if (error) throw error;

        toast.success('Event updated successfully!');
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('event')
          .insert([eventData])
          .select();

        if (error) throw error;

        toast.success('Event created successfully!');
      }

      // Trigger a refresh of providers data if needed
      window.dispatchEvent(new CustomEvent('refreshProviders'));

      navigate('/admin/events');
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} event: ` + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate]);

  return {
    isSubmitting,
    submitEvent,
  };
}; 