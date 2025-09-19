import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

const ChatLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <Outlet />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-blizbi-pink md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ChatLayout;
