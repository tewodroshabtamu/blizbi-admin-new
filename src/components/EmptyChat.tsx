import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import blobSvg from "../assets/blizbi-blob.svg";
import { useTranslation } from "react-i18next";

interface ChatFirstScreenProps {
  onSend: (message: string) => void;
}

const EmptyChat: React.FC<ChatFirstScreenProps> = ({ onSend }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="mt-16 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
      <div className="flex flex-col items-center min-h-[calc(100vh-8rem)] justify-center">
        <div className="w-32 h-32 mb-2">
          <img src={blobSvg} alt="Blizbi Blob" className="w-full h-full" />
        </div>
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 mb-2 text-center drop-shadow-lg">
            {t("chat.welcome_title")}
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl text-neutral-600 font-light text-center mb-4">
            {t("chat.welcome_subtitle")}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl flex flex-col items-center"
          autoComplete="off"
        >
          <div className="w-full flex items-center bg-neutral-100 rounded-2xl shadow-lg pl-3 sm:pl-6 pr-2 sm:py-4 py-2 mb-2">
            <input
              type="text"
              className="flex-1 bg-transparent text-neutral-900 text-sm sm:text-lg placeholder-neutral-500 focus:outline-none"
              placeholder={t("chat.placeholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="ml-4 bg-blizbi-teal hover:bg-blizbi-purple-dark transition-all duration-200 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center focus:outline-none shadow-md hover:scale-110 hover:shadow-lg active:scale-95 active:shadow"
              aria-label="Send"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmptyChat;
