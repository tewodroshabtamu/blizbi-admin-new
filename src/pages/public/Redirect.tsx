import { useAuth, useUser } from "@clerk/clerk-react";
import BlizbiBlogLoader from "../../components/BlizbiBlogLoader";
import { Navigate, useLocation } from "react-router-dom";
import { createProfile, getProfileByClerkId } from "@/api/profiles";
import { useEffect, useState } from "react";

const Redirect = () => {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleProfile = async () => {
      if (isSignedIn && user?.id) {
        setLoading(true);
        try {
          const profile = await getProfileByClerkId(user.id);
          if (!profile) {
            await createProfile(user.id);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    handleProfile();
  }, [isSignedIn, user?.id]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BlizbiBlogLoader />
      </div>
    );
  }
  if (!isSignedIn) {
    return <Navigate to="/explore" state={{ from: location }} replace />;
  }

  // If user is not admin, redirect to home
  if (user?.publicMetadata?.admin !== true) {
    return <Navigate to="/interests" state={{ from: location }} replace />;
  }

  // If user is admin, redirect to admin dashboard
  return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
};

export default Redirect;
