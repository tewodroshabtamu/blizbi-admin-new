import { supabase } from "@/supabase-client";
import i18n from "@/i18n";

export interface ChatResponse {
  answer: string;
  events?: Array<{
    id: string;
    title: string;
    location: string;
    date: string;
    time: string;
    provider: string;
    imageUrl?: string;
    price: {
      type: "free" | "paid";
      amount?: number;
    };
  }>;
}

export const chat = async (
  message: string,
  userName: string,
  clerkId: string,
  chatHistory: any[]
): Promise<ChatResponse> => {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const language = i18n.language === "no" ? "Norwegian" : "English";
  const response = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      userName,
      clerkId,
      chatHistory,
      userLanguage: language,
    }),
  });
  return response.json();
};

export const getChatHistoryByClerkId = async (clerk_id: string) => {
  const { data, error } = await supabase
    .from("chat_history")
    .select("*, profiles!inner(id, clerk_id)")
    .eq("profiles.clerk_id", clerk_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteChatHistory = async (clerk_id: string) => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", clerk_id)
    .single();

  if (!profile) {
    throw new Error("Profile not found");
  }

  const { error } = await supabase
    .from("chat_history")
    .update({ messages: [] })
    .eq("profile_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }
};
