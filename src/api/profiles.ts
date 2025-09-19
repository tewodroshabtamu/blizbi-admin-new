import { supabase } from "@/supabase-client";

export const getProfileByClerkId = async (clerkId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", clerkId);

  if (error) {
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
};

export const createProfile = async (clerk_id: string) => {
  const { data, error } = await supabase.from("profiles").insert({
    clerk_id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProfileInterests = async (clerk_id: string, interestIds: string[]) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ interest_ids: interestIds })
    .eq('clerk_id', clerk_id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
  