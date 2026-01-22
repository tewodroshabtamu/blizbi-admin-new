import { Building, Calendar1, HomeIcon, LogOut, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BlizbiIcon } from "./BlizbiIcon";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed = false,
  onToggleCollapse
}) => {
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
    <div
      className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50
        transition-all duration-300 ease-in-out shadow-lg
        ${collapsed ? 'w-16' : 'w-[20rem]'}
      `}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex gap-3 items-center flex-1">
              <BlizbiIcon className="w-8 h-8" />
              <span className="text-sm font-normal text-gray-500 transition-opacity duration-200">
                {t("admin.panel")}
              </span>
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="
                p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100
                transition-colors duration-200 flex-shrink-0
              "
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 py-4">
        {adminSidebarItems.map((item) => (
          <AdminSidebarItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-sm text-gray-500 transition-opacity duration-200">
              {t("version")} {import.meta.env.VITE_APP_VERSION}
            </span>
          )}

          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-2 text-blizbi-orange/80 hover:text-blizbi-orange
              transition-all duration-200 group relative
            `}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-md font-medium transition-opacity duration-200">
                {t("logout")}
              </span>
            )}

            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="
                absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-sm
                rounded-md opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg
                border border-gray-700
              ">
                {t("logout")}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-gray-700"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminSidebarItem = ({ item, collapsed }: { item: AdminSidebarItem; collapsed?: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <div className="px-2">
      <Link
        to={item.path}
        className={`
          flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'} ${collapsed ? 'px-3' : 'px-4'} py-3 rounded-lg transition-all duration-200
          group relative
          ${isActive
            ? "bg-blizbi-teal/10 text-blizbi-teal"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
        title={collapsed ? item.label : undefined}
      >
        <div className="flex-shrink-0">
          {item.icon}
        </div>

        {!collapsed && (
          <span className="font-medium text-sm transition-opacity duration-200">
            {item.label}
          </span>
        )}

        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="
            absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-sm
            rounded-md opacity-0 group-hover:opacity-100 pointer-events-none
            transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg
            border border-gray-700
          ">
            {item.label}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-gray-700"></div>
          </div>
        )}
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
