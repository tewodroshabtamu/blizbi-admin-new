import {
  HelpCircle,
  Info,
  LogOut,
  Settings,
  Shield,
  User,
  X,
  Scale,
  Lock,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer = ({ isOpen, onClose }: DrawerProps) => {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  const items = [
    ...(isSignedIn ? [{
      label: t("profile.navigation"),
      icon: <User />,
      path: "/profile",
    }] : []),
    ...(isSignedIn ? [{
      label: t("consent.in_app_settings.menu_label"),
      icon: <Lock />,
      path: "/data-settings",
    }] : []),
    {
      label: t("settings.navigation"),
      icon: <Settings />,
      path: "/settings",
    },
    {
      label: t("privacy.navigation"),
      icon: <Shield />,
      path: "/privacy",
    },
    {
      label: t("terms.navigation"),
      icon: <Scale />,
      path: "/terms-of-use",
    },
    {
      label: t("support.navigation"),
      icon: <HelpCircle />,
      path: "/support",
    },
    {
      label: t("feedback.navigation"),
      icon: <MessageCircle />,
      path: "/feedback",
    },
    {
      label: t("about.navigation"),
      icon: <Info />,
      path: "/about",
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-[9998] ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[20rem] bg-blizbi-teal shadow-lg z-[9999] transform transition-transform duration-300 ease-in-out pb-[76px] sm:pb-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="p-4 flex justify-end">
              <button
                onClick={onClose}
                className="text-white/80 hover:text-blizbi-yellow"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-4">
              <nav className="space-y-6">
                {items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 text-white/80 hover:text-blizbi-yellow"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blizbi-yellow">
                {t("version")} {import.meta.env.VITE_APP_VERSION}
              </span>
              {isSignedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-blizbi-orange/80 hover:text-blizbi-orange"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-md font-medium">{t("logout")}</span>
                </button>
              ) : (
                <Link to="/signin" className="w-fit">
                  <button className="flex items-center gap-2 text-blizbi-teal/80 hover:text-blizbi-teal bg-blizbi-yellow rounded-full py-2 px-4 h-11">
                    <LogIn className="w-5 h-5" />
                    <span className="text-md font-medium">{t("signin")}</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
