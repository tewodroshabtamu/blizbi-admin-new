import React from "react";
import FeatureComingSoon from "@/components/FeatureComingSoon";

const Chat: React.FC = () => {
  // const { t } = useTranslation();
  // const { isSignedIn } = useAuth();
  // const {
  //   chatHistory,
  //   sendMessage,
  //   isGettingHistory,
  //   isResponding,
  //   clearChatHistory,
  //   isDeletingHistory,
  // } = useChat();

  // const handleSendMessage = async (message: string) => {
  //   await sendMessage(message);
  // };

  // if (!isSignedIn) {
  //   return (
  //     <div className="mt-16 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
  //       <MustSignIn />
  //     </div>
  //   );
  // }

  // if (isGettingHistory) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <span className="text-gray-500">{t("loading")}</span>
  //     </div>
  //   );
  // }

  // if (chatHistory?.length === 0) {
  //   return <EmptyChat onSend={handleSendMessage} />;
  // }

  // return (
  //   <ChatDiscussion
  //     messages={chatHistory}
  //     sendMessage={handleSendMessage}
  //     isResponding={isResponding}
  //     clearChatHistory={clearChatHistory}
  //     isDeletingHistory={isDeletingHistory}
  //   />
  // );

  return <FeatureComingSoon />;
};

export default Chat;
