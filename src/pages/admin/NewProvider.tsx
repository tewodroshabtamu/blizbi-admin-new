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
import { supabase } from "../../supabase-client";
import { toast } from "sonner";
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

const providerSchema = z.object({
  name: z.string().min(1, "Provider name is required"),
  short_description: z.string().max(255, "Short description must be 255 characters or less").optional(),
  description: z.string().optional(),
  website_url: z.string().url("Website must be a valid URL"),
  cover_url: z.string().optional(),
  address: z.string().optional(),
  image: z.instanceof(File).optional(),
  is_featured: z.boolean(),
});

type ProviderFormData = z.infer<typeof providerSchema>;

interface InputType {
  label: string;
  name: "name" | "short_description" | "description" | "website_url" | "cover_url" | "address";
  type: "text" | "textarea" | "url";
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

const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("provider-covers")
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("provider-covers").getPublicUrl(fileName);

  return publicUrl;
};

const NewProvider: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      name: "",
      short_description: "",
      description: "",
      website_url: "",
      cover_url: "",
      address: "",
      is_featured: false,
    },
  });

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

      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("id", providerId)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error(t("admin.new_provider.provider_not_found"));
      }

      // Reset form with existing data
      form.reset({
        name: data.name || "",
        short_description: data.short_description || "",
        description: data.description || "",
        website_url: data.website_url || "",
        cover_url: data.cover_url || "",
        address: data.address || "",
        is_featured: data.is_featured || false,
      });
    } catch (err) {
      console.error("Error loading provider data:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("admin.new_provider.failed_to_load");
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
        const { error } = await supabase
          .from("providers")
          .update({
            ...submitData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editId);

        if (error) throw error;

        toast.success(t("admin.new_provider.provider_updated"));
      } else {
        // Create new provider
        const { error } = await supabase.from("providers").insert([submitData]);

        if (error) throw error;

        toast.success(t("admin.new_provider.provider_created"));
      }

      navigate(returnPath);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          t("admin.new_provider.failed_to_save", {
            action: isEditMode
              ? t("admin.new_provider.update")
              : t("admin.new_provider.create"),
            message: error.message,
          })
        );
      }
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

            <InfoTab form={form} isEditMode={isEditMode} inputs={inputs} />

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
