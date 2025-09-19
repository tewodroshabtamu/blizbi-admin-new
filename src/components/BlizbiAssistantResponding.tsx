import AssistantChatProfile from "./AssistantChatProfile";

const BlizbiAssistantResponding = () => {
  return (
    <div className="flex justify-start items-end">
      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2">
        <AssistantChatProfile />
      </div>
      <div className="max-w-xs px-4 max-h-10 rounded-2xl text-base bg-blizbi-yellow text-blizbi-teal border-blizbi-teal border rounded-bl-none animate-pulse">
        <div className="flex items-center h-10">
          <span className="inline-block w-1.5 h-1.5 bg-blizbi-teal rounded-full mx-1 animate-bounce delay-[0ms]" />
          <span className="inline-block w-1.5 h-1.5 bg-blizbi-teal rounded-full mx-1 animate-bounce delay-150" />
          <span className="inline-block w-1.5 h-1.5 bg-blizbi-teal rounded-full mx-1 animate-bounce delay-300" />
        </div>
      </div>
    </div>
  );
};

export default BlizbiAssistantResponding;
