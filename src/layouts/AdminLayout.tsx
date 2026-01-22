import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { useState } from "react";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div>
      <AdminHeader className="lg:hidden" />
      <div className="flex">
        <div className="hidden lg:block">
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>
        <div
          className={`
            w-full p-4 transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[20rem]'}
          `}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
