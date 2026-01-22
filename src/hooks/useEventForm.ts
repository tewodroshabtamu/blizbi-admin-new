import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

export interface EventFormData {
  name: string;
  description: string;
  provider: string;
  provider_id?: number;
  location_id?: number; // For backend API
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string; // Location name/address for display
  address: string;
  category: string;
  priceType: 'free' | 'ticket_required';
  price: string;
  capacity: string;
  imageUrl: string;
  image?: File;
  tags: string[];
  status: "draft" | "pending" | "published";
}

const initialFormData: EventFormData = {
  name: "",
  description: "",
  provider: "",
  provider_id: undefined,
  location_id: undefined,
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  location: "",
  address: "",
  category: "",
  priceType: "free",
  price: "",
  capacity: "",
  imageUrl: "",
  tags: [],
  status: "draft",
};

export const useEventForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [currentTag, setCurrentTag] = useState("");

  const handleInputChange = useCallback((field: keyof EventFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const addTag = useCallback(() => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  }, [currentTag, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = t("admin.new_event.validation.event_name_required");
    if (!formData.description.trim()) newErrors.description = t("admin.new_event.validation.description_required");
    if (!formData.provider) newErrors.provider = t("admin.new_event.validation.provider_required");
    if (!formData.location_id) newErrors.location_id = "Location is required";
    if (!formData.startDate) newErrors.startDate = t("admin.new_event.validation.start_date_required");
    if (!formData.startTime) newErrors.startTime = t("admin.new_event.validation.start_time_required");
    if (!formData.category) newErrors.category = t("admin.new_event.validation.category_required");

    // Validate end date is after start date if both are provided
    if (formData.startDate && formData.endDate) {
      const start = new Date(`${formData.startDate} ${formData.startTime || '00:00'}`);
      const end = new Date(`${formData.endDate} ${formData.endTime || '23:59'}`);
      if (end < start) {
        newErrors.endDate = t("admin.new_event.validation.end_date_after_start");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const setFormDataFromEvent = useCallback((eventData: any) => {
    // Handle both Supabase format (with details) and API format
    const details = eventData.details as any || {};
    
    setFormData({
      name: eventData.title || "",
      description: eventData.description || details.description || "",
      provider: "", // Will be set after providers load
      provider_id: eventData.provider_id || eventData.provider,
      location_id: typeof eventData.location === 'number' ? eventData.location : (typeof eventData.location_id === 'number' ? eventData.location_id : undefined),
      startDate: eventData.start_date ? eventData.start_date.split('T')[0] : "",
      endDate: eventData.end_date ? eventData.end_date.split('T')[0] : "",
      startTime: eventData.start_time || (eventData.start_date ? eventData.start_date.split('T')[1]?.substring(0, 5) : ""),
      endTime: eventData.end_time || (eventData.end_date ? eventData.end_date.split('T')[1]?.substring(0, 5) : ""),
      location: details.location || "",
      address: details.address || "",
      category: details.category || "",
      priceType: eventData.is_free === false ? "ticket_required" : "free",
      price: eventData.price || details.price || "",
      capacity: details.capacity || "",
      imageUrl: eventData.cover_url || eventData.image_url || "",
      tags: details.tags || [],
      status: eventData.type === 'one_time' ? 'published' : 'draft',
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setCurrentTag("");
  }, []);

  return {
    formData,
    errors,
    currentTag,
    setCurrentTag,
    handleInputChange,
    addTag,
    removeTag,
    validateForm,
    setFormDataFromEvent,
    resetForm,
    setFormData,
  };
}; 