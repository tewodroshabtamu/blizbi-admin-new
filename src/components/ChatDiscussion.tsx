import { useState, useRef, useEffect } from "react";
import UserChatBubble from "./UserChatBubble";
import AssistantChatBubble from "./AssistantChatBubble";
import { ArrowUp, Trash2 } from "lucide-react";
import { Message } from "@/types/chat";
import BlizbiAssistantResponding from "./BlizbiAssistantResponding";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useTranslation } from "react-i18next";

const ChatDiscussion = ({
  messages = [],
  sendMessage,
  isResponding,
  clearChatHistory,
  isDeletingHistory,
}: ChatDiscussionProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleDelete = async () => {
    await clearChatHistory();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="h-[calc(100vh-9rem)] md:h-[calc(100vh-4rem)] overflow-hidden flex flex-col mt-[4rem]">
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 mt-8 scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100 custom-scrollbar">
        <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <AssistantChatBubble 
                  message={msg.content} 
                  events={msg.events}
                />
              )}

              {msg.role === "user" && <UserChatBubble message={msg.content} />}
            </div>
          ))}
          {isResponding && <BlizbiAssistantResponding />}
        </div>
      </div>
      <div className="pt-4 pb-2 sm:p-4 border-t border-gray-200 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
        <div className="flex gap-2 items-center">
          <form onSubmit={handleSubmit} className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="pr-12 resize-none min-h-[44px] max-h-[150px] bg-white overflow-y-auto"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:scale-110 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <ArrowUp size={25} className="text-white bg-blizbi-teal hover:bg-blizbi-teal/90 rounded-full p-1 transition-colors" />
            </button>
          </form>
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeletingHistory}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="w-[calc(100%-2rem)] md:w-[500px] p-6 rounded-md">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-xl">
              {t("chat.clear_history")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {t("chat.clear_history_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">
              {t("chat.clear_history_cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeletingHistory}
              className="w-full sm:w-auto"
            >
              {isDeletingHistory
                ? t("chat.clear_history_loading")
                : t("chat.clear_history_confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface ChatDiscussionProps {
  messages: Message[];
  sendMessage: (message: string) => void;
  isResponding: boolean;
  clearChatHistory: () => Promise<void>;
  isDeletingHistory: boolean;
}

export default ChatDiscussion;
