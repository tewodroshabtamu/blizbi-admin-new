import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { getProviderById, createProvider, updateProvider, ProviderData } from "../../services/providers";
import { getLocations, LocationData } from "../../services/locations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import ImageUpload from "../../components/ImageUpload";
import { useTranslation } from "react-i18next";

// Base schema - provider_id and location_id are optional for edit mode
const providerSchema = z.object({
  provider_id: z.string().max(255, "Provider ID must be 255 characters or less").optional(),
  name: z.string().min(1, "Provider name is required").max(255, "Name must be 255 characters or less"),
  website_url: z.string().url("Website must be a valid URL").max(255, "Website must be 255 characters or less"),
  location_id: z.number().optional(),
  short_description: z.string().max(255, "Short description must be 255 characters or less").optional(),
  description: z.string().optional(),
  cover_url: z.string().url("Cover URL must be a valid URL").max(255, "Cover URL must be 255 characters or less").optional().or(z.literal("")),
  address: z.string().max(255, "Address must be 255 characters or less").optional(),
  municipality_id: z.number().optional(),
  image: z.instanceof(File).optional(),
  is_featured: z.boolean(),
});

type ProviderFormData = z.infer<typeof providerSchema>;

interface InputType {
  label: string;
  name: "name" | "short_description" | "description" | "website_url" | "cover_url" | "address" | "provider_id" | "location_id";
  type: "text" | "textarea" | "url" | "select";
  placeholder: string;
}

interface ProviderFormFieldsProps {
  form: ReturnType<typeof useForm<ProviderFormData>>;
  isEditMode?: boolean;
  inputs: InputType[];
}

const ProviderFormFields: React.FC<ProviderFormFieldsProps> = ({
  form,
  inputs,
}) => (
  <>
    {inputs.map((input) => (
      <FormField
        key={input.name}
        control={form.control}
        name={input.name as keyof ProviderFormData}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{input.label}</FormLabel>
            <FormControl>
              {input.type === "textarea" ? (
                <Textarea
                  placeholder={input.placeholder}
                  {...field}
                  value={typeof field.value === "string" ? field.value : ""}
                />
              ) : (
                <Input
                  placeholder={input.placeholder}
                  {...field}
                  value={typeof field.value === "string" ? field.value : ""}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ))}
  </>
);

const InfoTab: React.FC<ProviderFormFieldsProps> = ({
  form,
  isEditMode = false,
  inputs,
}) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set initial image preview from form data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      const existingCoverUrl = form.getValues("cover_url");
      if (existingCoverUrl) {
        setImagePreview(existingCoverUrl);
      }
    }
  }, [isEditMode, form]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    }
  };

  return (
    <CardContent className="space-y-4 p-0">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">
            {t("admin.new_provider.provider_cover_image")}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {t("admin.new_provider.cover_image_description")}
          </p>
        </div>
        <ImageUpload
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
        />
      </div>
      <ProviderFormFields form={form} inputs={inputs} />
      <FormField
        control={form.control}
        name="is_featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                {t("admin.new_provider.featured_provider")}
              </FormLabel>
              <FormDescription>
                {t("admin.new_provider.featured_provider_description")}
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </CardContent>
  );
};

// Upload image to storage
// TODO: Replace with backend API endpoint for image uploads
// For now, this is a placeholder - image uploads should be handled via the backend API
const uploadImage = async (file: File): Promise<string> => {
  // TODO: Implement image upload via backend API
  // Example: const formData = new FormData(); formData.append('file', file);
  // const response = await apiClient.post('/providers/upload-image/', formData);
  // return response.image_url;
  
  // Temporary: Return a data URL for preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

const NewProvider: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Check if we're in edit mode
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  // Get the return path from location state, default to providers list
  const returnPath =
    location.state?.from === "provider_details"
      ? `/admin/providers/${editId}`
      : "/admin/providers";

  const inputs: InputType[] = [
    {
      label: t("name"),
      name: "name",
      type: "text",
      placeholder: t("admin.new_provider.placeholders.name"),
    },
    {
      label: t("website_url"),
      name: "website_url",
      type: "url",
      placeholder: t("admin.new_provider.placeholders.website_url"),
    },
    {
      label: t("address"),
      name: "address",
      type: "text",
      placeholder: t("admin.new_provider.placeholders.address"),
    },
    {
      label: t("short_description"),
      name: "short_description",
      type: "textarea",
      placeholder: t("admin.new_provider.placeholders.short_description"),
    },
    {
      label: t("description"),
      name: "description",
      type: "textarea",
      placeholder: t("admin.new_provider.placeholders.description"),
    },
  ];

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      provider_id: "",
      name: "",
      short_description: "",
      description: "",
      website_url: "",
      cover_url: "",
      address: "",
      location_id: undefined,
      municipality_id: undefined,
      is_featured: false,
    },
  });

  // Load locations for the dropdown
  // Locations endpoint is public, so no authentication required
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        setError(null);
        const locationsData = await getLocations();
        // Ensure locationsData is always an array
        setLocations(Array.isArray(locationsData) ? locationsData : []);
      } catch (err: any) {
        console.error('Error fetching locations:', err);
        const errorMessage = err?.message || 'Failed to load locations';
        toast.error(errorMessage);
        // Set error state so user knows locations couldn't be loaded
        setError(errorMessage);
        // Keep locations as empty array on error
        setLocations([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    if (!isEditMode) {
      fetchLocations();
    }
  }, [isEditMode]);

  // Load existing provider data if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      loadProviderData(editId);
    }
  }, [isEditMode, editId]);

  const loadProviderData = async (providerId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getProviderById(providerId);

      // Reset form with existing data
      form.reset({
        provider_id: data.provider_id || "",
        name: data.name || "",
        short_description: data.short_description || "",
        description: data.description || "",
        website_url: data.website || "",
        cover_url: data.cover_url || data.logo_url || "",
        address: data.address || "",
        location_id: data.location_id,
        municipality_id: data.municipality_id,
        is_featured: data.is_featured || false,
      });
    } catch (err: any) {
      console.error("Error loading provider data:", err);
      const errorMessage = err?.message || t("admin.new_provider.failed_to_load");
      setError(errorMessage);
      toast.error(errorMessage);
      navigate("/admin/providers");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProviderFormData) => {
    setIsSubmitting(true);
    const file = data.image;

    try {
      // Validate required fields for new providers
      if (!isEditMode) {
        if (!data.provider_id || data.provider_id.trim() === "") {
          form.setError("provider_id", { message: "Provider ID is required" });
          setIsSubmitting(false);
          return;
        }
        if (!data.location_id) {
          form.setError("location_id", { message: "Location is required" });
          setIsSubmitting(false);
          return;
        }
      }

      let cover_url = data.cover_url;

      if (file) {
        cover_url = await uploadImage(file);
      }

      const submitData = {
        ...data,
        cover_url,
      };
      delete submitData.image;

      if (isEditMode && editId) {
        // Update existing provider
        await updateProvider(editId, {
          name: submitData.name,
          description: submitData.description,
          website: submitData.website_url,
          logo_url: submitData.cover_url,
        });

        toast.success(t("admin.new_provider.provider_updated"));
      } else {
        // Create new provider
        // Required fields: provider_id, name, website, location_id
        const providerPayload: Partial<ProviderData> = {
          provider_id: submitData.provider_id,
          name: submitData.name,
          website: submitData.website_url,
          location_id: submitData.location_id,
        };
        
        // Add optional fields
        if (submitData.short_description) {
          providerPayload.short_description = submitData.short_description;
        }
        if (submitData.description) {
          providerPayload.description = submitData.description;
        }
        if (submitData.cover_url) {
          providerPayload.cover_url = submitData.cover_url;
        }
        if (submitData.address) {
          providerPayload.address = submitData.address;
        }
        if (submitData.municipality_id) {
          providerPayload.municipality_id = submitData.municipality_id;
        }
        if (submitData.is_featured !== undefined) {
          providerPayload.is_featured = submitData.is_featured;
        }
        
        await createProvider(providerPayload);

        toast.success(t("admin.new_provider.provider_created"));
      }

      navigate(returnPath);
    } catch (error: any) {
      console.error('Provider save error:', error);
      // Extract error message from various error formats
      let errorMessage = 'Unknown error';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data) {
        // Handle Django REST Framework validation errors
        if (typeof error.data === 'object') {
          const errorFields = Object.entries(error.data)
            .map(([field, messages]: [string, any]) => {
              const msg = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${field}: ${msg}`;
            })
            .join('; ');
          errorMessage = errorFields;
        } else {
          errorMessage = String(error.data);
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(
        t("admin.new_provider.failed_to_save", {
          action: isEditMode
            ? t("admin.new_provider.update")
            : t("admin.new_provider.create"),
          message: errorMessage,
        }) || `Failed to ${isEditMode ? 'update' : 'create'} provider: ${errorMessage}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">
            {t("admin.new_provider.loading_provider_data")}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">
            {t("admin.new_provider.error")}: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={returnPath}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>
              {t("admin.new_provider.back_to")}{" "}
              {location.state?.from === "provider_details"
                ? t("admin.new_provider.provider_details")
                : t("admin.new_provider.providers")}
            </span>
          </Link>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-4 sm:p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-semibold">
                {isEditMode
                  ? t("admin.new_provider.edit_provider")
                  : t("admin.new_provider.create_new_provider")}
              </CardTitle>
              <CardDescription className="text-gray-500">
                {isEditMode
                  ? t("admin.new_provider.update_provider_info")
                  : t("admin.new_provider.add_new_provider")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-0">
              {/* Required fields for new providers */}
              {!isEditMode && (
                <>
                  <FormField
                    control={form.control}
                    name="provider_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider ID *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., provider-123 (unique identifier)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this provider (max 255 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            disabled={loadingLocations}
                          >
                            <option value="">{loadingLocations ? "Loading locations..." : "Select a location"}</option>
                            {Array.isArray(locations) && locations.map((loc) => (
                              <option key={loc.id} value={loc.id}>
                                {loc.name} {loc.address ? `- ${loc.address}` : ""}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>
                          Select the location for this provider. If no locations are available, create one first.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <InfoTab form={form} isEditMode={isEditMode} inputs={inputs} />
            </CardContent>

            <CardFooter className="flex justify-end p-0 py-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="!bg-blizbi-teal hover:!bg-blizbi-teal/90 !text-white px-6 py-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEditMode ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmitting
                  ? isEditMode
                    ? t("admin.new_provider.updating")
                    : t("admin.new_provider.creating")
                  : isEditMode
                    ? t("admin.new_provider.update_provider")
                    : t("admin.new_provider.add_provider")}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export type { ProviderFormData };
export default NewProvider;
