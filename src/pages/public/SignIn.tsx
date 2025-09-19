import { SignIn as ClerkSignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignIn = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/explore");
    }
  }, [isSignedIn, navigate]);

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blizbi-purple to-white flex items-center justify-center px-2">
      <ClerkSignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-xl",
            headerTitle: "text-2xl font-bold text-gray-900",
            headerSubtitle: "text-gray-600",
            formButtonPrimary: "bg-blizbi-teal hover:bg-blizbi-teal/90",
          },
        }}
        fallbackRedirectUrl="/redirect"
        signUpUrl="/signup"
      />
    </div>
  );
};

export default SignIn;
