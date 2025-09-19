import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Drawer from "./Drawer";
import { BlizbiIcon } from "./BlizbiIcon";
import { useTranslation } from "react-i18next";
import BetaBanner from "./BetaBanner";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems: NavItem[] = [
    {
      path: "/explore",
      label: t("explore"),
    },
    {
      path: "/bookmarked",
      label: t("bookmarked"),
    },
    {
      path: "/chat",
      label: t("chat"),
    },
  ];

  return (
    <>
      <BetaBanner />
      <div className="bg-blizbi-teal">
        <div className="h-16 flex items-center justify-between w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-20rem)] max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
            <button
              className="text-white/80 hover:text-blizbi-yellow"
              onClick={toggleDrawer}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/explore">

              <BlizbiIcon size={18} />

            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((navItem) => (
              <Link
                key={navItem.path}
                to={navItem.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive(navItem.path)
                    ? "text-blizbi-yellow hover:text-blizbi-yellow"
                    : "text-white/80 hover:text-blizbi-yellow"
                }`}
              >
                {navItem.icon}
                <span>{navItem.label}</span>
              </Link>
            ))}
          </nav>

          <Link to="/search" className="text-white/80 hover:text-blizbi-yellow">
            <Search className="w-6 h-6" />
          </Link>
        </div>
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

export default Header;
