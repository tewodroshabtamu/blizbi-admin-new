import { Building, Calendar1, HomeIcon, LogOut, Settings } from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BlizbiIcon } from "./BlizbiIcon";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const AdminSidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const adminSidebarItems = [
    {
      label: t("dashboard"),
      icon: <HomeIcon className="w-4 h-4" />,
      path: "/admin/dashboard",
    },
    {
      label: t("events"),
      icon: <Calendar1 className="w-4 h-4" />,
      path: "/admin/events",
    },
    {
      label: t("providers"),
      icon: <Building className="w-4 h-4" />,
      path: "/admin/providers",
    },
    {
      label: t("settings"),
      icon: <Settings className="w-4 h-4" />,
      path: "/admin/settings",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[20rem] bg-white border-r border-gray-200 flex flex-col z-50">
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-3 items-center">
          <BlizbiIcon className="w-8 h-8" />
          <span className="text-sm font-normal text-gray-500">
            {t("admin.panel")}
          </span>
        </div>
      </div>
      <div className="flex-1 py-4">
        {adminSidebarItems.map((item) => (
          <AdminSidebarItem key={item.path} item={item} />
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {t("version")} {import.meta.env.VITE_APP_VERSION}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-blizbi-orange/80 hover:text-blizbi-orange"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-md font-medium">{t("logout")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminSidebarItem = ({ item }: { item: AdminSidebarItem }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <div className="px-4">
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
          ? "bg-blizbi-teal/10 text-blizbi-teal"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
      >
        {item.icon}
        <span className="font-medium text-sm">{item.label}</span>
      </Link>
    </div>
  );
};

interface AdminSidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export default AdminSidebar;
