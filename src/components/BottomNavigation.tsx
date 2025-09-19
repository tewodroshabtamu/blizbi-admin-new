import { Bookmark, House, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React from "react";

const navItems = [
  {
    path: "/explore",
    icon: <House className="w-6 h-6" />,
  },
  {
    path: "/bookmarked",
    icon: <Bookmark className="w-6 h-6" />,
  },
  {
    path: "/chat",
    icon: <MessageCircle className="w-6 h-6" />,
  },
];

const BottomNavigation = () => {
  return (
    <div className="bg-blizbi-teal flex items-center justify-center h-16 m-2 rounded-2xl shadow-sm">
      {navItems.map((navItem) => (
        <NavItem key={navItem.path} navItem={navItem} />
      ))}
    </div>
  );
};

const NavItem = ({ navItem }: { navItem: NavItem }) => {
  const location = useLocation();
  const isActive = location.pathname === navItem.path;

  return (
    <div className="mx-8">
      <Link 
        to={navItem.path}
        className={`transition-colors duration-200 ${
          isActive 
            ? "text-blizbi-yellow" 
            : "text-white/80 hover:text-blizbi-yellow"
        }`}
      >
        {navItem.icon}
      </Link>
    </div>
  );
};

interface NavItem {
  path: string;
  icon: React.ReactNode;
}

export default BottomNavigation;
