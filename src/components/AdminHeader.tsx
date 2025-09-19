import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminDrawer from "./AdminDrawer";
import { BlizbiIcon } from "./BlizbiIcon";

const AdminHeader = ({ className }: AdminHeaderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <div
        className={`bg-blizbi-teal h-16 flex items-center justify-between px-4 ${
          className || ""
        }`}
      >
        <div className="flex items-center gap-6">
          <button
            className="text-white/80 hover:text-blizbi-yellow"
            onClick={toggleDrawer}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <BlizbiIcon size={18} />
            <span className="text-sm font-normal text-gray-200">
              Admin Panel
            </span>
          </Link>
        </div>
      </div>

      <AdminDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

interface AdminHeaderProps {
  className?: string;
}

export default AdminHeader;
