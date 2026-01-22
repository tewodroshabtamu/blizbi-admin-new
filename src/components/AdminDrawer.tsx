import { Building, Calendar1, HomeIcon, LogOut, Settings, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDrawer = ({ isOpen, onClose }: AdminDrawerProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigation = () => {
    onClose();
  };

  const items = [
    {
      label: "Dashboard",
      icon: <HomeIcon />,
      path: "/admin/dashboard",
    },
    {
      label: "Events",
      icon: <Calendar1 />,
      path: "/admin/events",
    },
    {
      label: "Providers",
      icon: <Building />,
      path: "/admin/providers",
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/admin/settings",
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-[9998] ${isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[20rem] bg-blizbi-teal shadow-lg z-[9999] transform transition-transform duration-300 ease-in-out sm:pb-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
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
                    onClick={() => handleNavigation()}
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
              <span className="text-sm text-blizbi-yellow">Version 1.0.0</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-blizbi-orange/80 hover:text-blizbi-orange"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-md font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDrawer;
