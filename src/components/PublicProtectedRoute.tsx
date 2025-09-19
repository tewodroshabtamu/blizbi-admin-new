import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import BlizbiBlogLoader from "./BlizbiBlogLoader";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const PublicProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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

  if (user?.publicMetadata?.admin === true && isSignedIn) {
    toast.info("You are connect as an admin, sign out and connect as a user to continue");
    return (
      <Navigate to="/admin/dashboard" state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};

export default PublicProtectedRoute;
