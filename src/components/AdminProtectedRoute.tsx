import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import BlizbiBlogLoader from "./BlizbiBlogLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BlizbiBlogLoader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // NOTE: Role-based access typically requires checking claims or a database.
  // For now, we allow any authenticated user or you can implement strict checks here
  // typically via `user.getIdTokenResult()` claims.

  return <>{children}</>;
};

export default AdminProtectedRoute;
