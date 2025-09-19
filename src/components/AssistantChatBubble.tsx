import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../styles/chatReponse.module.css";
import AssistantChatProfile from "./AssistantChatProfile";
import ChatEventCarousel from "./ChatEventCarousel";

interface EventData {
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
}

const AssistantChatBubble = ({ message, events }: AssistantChatBubbleProps) => {
  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        <AssistantChatProfile />
      </div>
      <div className="flex flex-col gap-3 max-w-md">
        {/* Text Message */}
        <div
          className={`px-4 py-2 rounded-2xl text-base bg-blizbi-yellow text-blizbi-teal border-blizbi-teal border-[1px] rounded-bl-none ${styles["markdown-body"]}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
        </div>
        
        {/* Event Cards Carousel */}
        {events && events.length > 0 && (
          <ChatEventCarousel events={events} />
        )}
      </div>
    </div>
  );
};

interface AssistantChatBubbleProps {
  message: string;
  events?: EventData[];
}

export default AssistantChatBubble;
