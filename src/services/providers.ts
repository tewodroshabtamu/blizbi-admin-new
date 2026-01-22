import { supabase } from "@/lib/supabase-client";

export const getFeaturedProviders = async () => {
  const { data, error } = await supabase
    .from("providers")
    .select("id, name, short_description, cover_url")
    .eq("is_featured", true);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((p: any) => ({
    id: p.id,
    imageUrl: p.cover_url,
    title: p.name,
    description: p.short_description,
  }));
};
