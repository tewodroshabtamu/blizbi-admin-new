import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import BlizbiBlogLoader from "./BlizbiBlogLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Wait for auth to load
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BlizbiBlogLoader />
      </div>
    );
  }

  if (user?.publicMetadata?.admin !== true || !isSignedIn) {
    return <Navigate to="/explore" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
