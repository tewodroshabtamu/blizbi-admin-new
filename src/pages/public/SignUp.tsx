import React from 'react';
import { SignUp as ClerkSignUp, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/explore");
    }
  }, [isSignedIn, navigate]);

  if (isSignedIn) {
    return null; // Prevent flash of sign-up form while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blizbi-purple to-white flex items-center justify-center px-2">
      <ClerkSignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-xl",
            headerTitle: "text-2xl font-bold text-gray-900",
            headerSubtitle: "text-gray-600",
            formButtonPrimary: "bg-blizbi-teal hover:bg-blizbi-teal/90",
          },
        }}
        signInUrl="/signin"
        fallbackRedirectUrl="/explore"
      />
    </div>
  );
};

export default SignUp;
