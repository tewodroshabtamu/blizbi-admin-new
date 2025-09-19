import { useUser } from "@clerk/clerk-react";

interface UserChatBubbleProps {
  message: string;
}

const UserChatBubble = ({ message }: UserChatBubbleProps) => {
  const { user } = useUser();
  
  return (
    <>
      <div className="max-w-xs px-4 h-auto break-words py-2 rounded-2xl shadow-md text-base bg-blizbi-teal text-white rounded-br-none">
        {message}
      </div>
      <div className="flex items-end ml-2">
        <div className="w-8 h-8 bg-blizbi-teal rounded-full flex items-center justify-center text-white font-bold">
          <img
            src={user?.imageUrl}
            alt="User"
            className="w-full h-full rounded-full bg-gray-300"
          />
        </div>
      </div>
    </>
  );
};

export default UserChatBubble;
