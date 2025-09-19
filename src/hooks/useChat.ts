import { chat, getChatHistoryByClerkId, deleteChatHistory, ChatResponse } from "@/api/chat";
import { Message } from "@/types/chat";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useUser();
  const [isGettingHistory, setIsGettingHistory] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
  const queryClient = useQueryClient();

  const sendMessage = async (message: string) => {
    setIsResponding(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: message, createdAt: new Date() },
    ]);
    
    try {
      const response: ChatResponse = await chat(
        message,
        user?.fullName ?? "",
        user?.id ?? "",
        messages
      );
      
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: response.answer, 
          createdAt: new Date(),
          events: response.events || undefined
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, I'm having trouble responding right now. Please try again later.", 
          createdAt: new Date()
        },
      ]);
    } finally {
      setIsResponding(false);
    }
  };

  const clearChatHistory = async () => {
    if (!user?.id) return;
    
    try {
      setIsDeletingHistory(true);
      await deleteChatHistory(user.id);
      setMessages([]);
      await queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
      toast.success("Chat history cleared successfully");
    } catch (error) {
      toast.error("Failed to clear chat history");
      console.error("Error clearing chat history:", error);
    } finally {
      setIsDeletingHistory(false);
    }
  };

  const { data, error } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      setIsGettingHistory(true);
      if (!user?.id) {
        throw new Error("User ID is required, to get chat history");
      }
      const chatHistory = await getChatHistoryByClerkId(user.id);
      const data = chatHistory[0].messages;
      setIsGettingHistory(false);
      return data;
    },
    enabled: !!user?.id,
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  return {
    sendMessage,
    chatHistory: messages,
    chatHistoryError: error,
    isGettingHistory,
    isResponding,
    clearChatHistory,
    isDeletingHistory,
  };
};

export default useChat;
