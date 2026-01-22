import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminLayout = () => {
  return (
    <div>
      <AdminHeader className="lg:hidden" />
      <div className="flex">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <div className="w-full p-4 lg:ml-[20rem]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
