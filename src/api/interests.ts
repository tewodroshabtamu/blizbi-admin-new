import { supabase } from "@/supabase-client";

export const fetchInterests = async () => {
  const { data, error } = await supabase.from("interests").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};