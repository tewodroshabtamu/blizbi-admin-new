import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="flex-1 pt-24 pb-4 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
        <Outlet />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-blizbi-pink md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default MainLayout;
